interface GitHubRepo {
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    size: number;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    has_issues: boolean;
    has_projects: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    archived: boolean;
    disabled: boolean;
    license: {
        key: string;
        name: string;
    } | null;
    topics: string[];
    default_branch: string;
}

interface GitHubCommit {
    commit: {
        message: string;
        author: {
            date: string;
        };
    };
}

interface GitHubContent {
    name: string;
    path: string;
    type: 'file' | 'dir';
    size?: number;
    content?: string;
}

interface AnalysisResult {
    repoName: string;
    repoUrl: string;
    score: number;
    tier: "Bronze" | "Silver" | "Gold" | "Platinum";
    industryReadiness: "Academic" | "Portfolio-Ready" | "Industry-Ready";
    summary: string;
    categories: {
        title: string;
        score: number;
        description: string;
        iconName: string;
    }[];
    roadmap: {
        title: string;
        description: string;
        priority: "high" | "medium" | "low";
    }[];
    redFlags: {
        type: "copied_code" | "poor_commits" | "missing_docs" | "unused_files" | "security_issue";
        title: string;
        description: string;
    }[];
    readmeChecklist: {
        label: string;
        present: boolean;
    }[];
}

class GitHubAnalyzer {
    private baseUrl = 'https://api.github.com';

    private async fetchGitHubData(url: string): Promise<any> {
        try {
            // Add headers to avoid CORS issues and improve API response
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitEval-App'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Repository not found. Please check the URL and ensure the repository is public.');
                } else if (response.status === 403) {
                    throw new Error('GitHub API rate limit exceeded. Please try again later.');
                } else {
                    throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`);
                }
            }
            return response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to fetch data from GitHub API');
        }
    }

    private extractRepoInfo(githubUrl: string): { owner: string; repo: string } {
        // Clean the URL and handle different formats
        let cleanUrl = githubUrl.trim();

        // Remove trailing slash and .git extension
        cleanUrl = cleanUrl.replace(/\/$/, '').replace(/\.git$/, '');

        // Handle different GitHub URL formats
        const patterns = [
            /github\.com\/([^\/]+)\/([^\/]+)/,  // https://github.com/owner/repo
            /github\.com\/([^\/]+)\/([^\/]+)\//, // https://github.com/owner/repo/
        ];

        for (const pattern of patterns) {
            const match = cleanUrl.match(pattern);
            if (match) {
                return { owner: match[1], repo: match[2] };
            }
        }

        throw new Error('Invalid GitHub URL format. Please use: https://github.com/owner/repository');
    }

    private async getRepoData(owner: string, repo: string): Promise<GitHubRepo> {
        return this.fetchGitHubData(`${this.baseUrl}/repos/${owner}/${repo}`);
    }

    private async getCommits(owner: string, repo: string, count: number = 30): Promise<GitHubCommit[]> {
        return this.fetchGitHubData(`${this.baseUrl}/repos/${owner}/${repo}/commits?per_page=${count}`);
    }

    private async getContents(owner: string, repo: string, path: string = ''): Promise<GitHubContent[]> {
        try {
            return await this.fetchGitHubData(`${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`);
        } catch {
            return [];
        }
    }

    private async getFileContent(owner: string, repo: string, path: string): Promise<string> {
        try {
            const response = await this.fetchGitHubData(`${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`);
            if (response.content) {
                return atob(response.content);
            }
            return '';
        } catch {
            return '';
        }
    }

    private analyzeCodeQuality(repo: GitHubRepo, files: GitHubContent[]): number {
        let score = 50; // Base score

        // Language popularity bonus
        const popularLanguages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust'];
        if (repo.language && popularLanguages.includes(repo.language)) {
            score += 10;
        }

        // File organization
        const hasProperStructure = files.some(f => f.name === 'src' || f.name === 'lib' || f.name === 'app');
        if (hasProperStructure) score += 15;

        // Configuration files
        const configFiles = ['package.json', 'requirements.txt', 'Cargo.toml', 'go.mod', 'pom.xml'];
        const hasConfig = files.some(f => configFiles.includes(f.name));
        if (hasConfig) score += 10;

        // Size consideration (not too small, not too large)
        if (repo.size > 100 && repo.size < 50000) score += 15;

        return Math.min(score, 100);
    }

    private analyzeProjectStructure(files: GitHubContent[]): number {
        let score = 40;

        const goodStructureIndicators = [
            'src', 'lib', 'app', 'components', 'utils', 'services', 'types', 'interfaces'
        ];

        const structureScore = goodStructureIndicators.filter(indicator =>
            files.some(f => f.name.toLowerCase().includes(indicator.toLowerCase()))
        ).length;

        score += structureScore * 8;

        // Bonus for common good practices
        if (files.some(f => f.name === '.gitignore')) score += 10;
        if (files.some(f => f.name.includes('config'))) score += 5;

        return Math.min(score, 100);
    }

    private async analyzeDocumentation(owner: string, repo: string, files: GitHubContent[]): Promise<number> {
        let score = 20;

        // Check for README
        const readmeFile = files.find(f => f.name.toLowerCase().startsWith('readme'));
        if (readmeFile) {
            score += 30;

            // Analyze README content
            const readmeContent = await this.getFileContent(owner, repo, readmeFile.name);
            if (readmeContent.length > 500) score += 20;
            if (readmeContent.includes('installation') || readmeContent.includes('setup')) score += 10;
            if (readmeContent.includes('usage') || readmeContent.includes('example')) score += 10;
            if (readmeContent.includes('license')) score += 5;
            if (readmeContent.includes('contributing')) score += 5;
        }

        return Math.min(score, 100);
    }

    private analyzeTesting(files: GitHubContent[]): number {
        let score = 20;

        const testIndicators = ['test', 'spec', '__tests__', 'tests'];
        const hasTests = testIndicators.some(indicator =>
            files.some(f => f.name.toLowerCase().includes(indicator))
        );

        if (hasTests) score += 60;

        // Check for test configuration
        const testConfigs = ['jest.config', 'vitest.config', 'cypress.json', '.spec.ts', '.test.js'];
        const hasTestConfig = testConfigs.some(config =>
            files.some(f => f.name.includes(config))
        );

        if (hasTestConfig) score += 20;

        return Math.min(score, 100);
    }

    private analyzeGitPractices(commits: GitHubCommit[]): number {
        let score = 30;

        if (commits.length === 0) return 20;

        // Analyze commit messages
        const goodCommitMessages = commits.filter(commit => {
            const message = commit.commit.message.toLowerCase();
            return message.length > 10 &&
                !message.startsWith('fix') &&
                !message.startsWith('update') &&
                !message.includes('wip');
        });

        const commitQualityRatio = goodCommitMessages.length / commits.length;
        score += commitQualityRatio * 40;

        // Check commit frequency
        const now = new Date();
        const recentCommits = commits.filter(commit => {
            const commitDate = new Date(commit.commit.author.date);
            const daysDiff = (now.getTime() - commitDate.getTime()) / (1000 * 3600 * 24);
            return daysDiff <= 30;
        });

        if (recentCommits.length > 0) score += 20;
        if (recentCommits.length > 5) score += 10;

        return Math.min(score, 100);
    }

    private analyzeSecurity(files: GitHubContent[]): number {
        let score = 60;

        // Check for security files
        if (files.some(f => f.name === 'SECURITY.md')) score += 15;
        if (files.some(f => f.name === '.env.example')) score += 10;

        // Deduct for potential security issues
        if (files.some(f => f.name === '.env')) score -= 20;
        if (files.some(f => f.name.includes('secret') || f.name.includes('key'))) score -= 15;

        // Bonus for security-related dependencies (would need package.json analysis)
        return Math.max(Math.min(score, 100), 20);
    }

    private analyzePerformance(repo: GitHubRepo, files: GitHubContent[]): number {
        let score = 50;

        // Size optimization
        if (repo.size < 10000) score += 20;
        else if (repo.size > 100000) score -= 10;

        // Check for optimization files
        const optimizationFiles = ['webpack.config', 'vite.config', 'rollup.config', '.babelrc'];
        if (optimizationFiles.some(file => files.some(f => f.name.includes(file)))) {
            score += 20;
        }

        // Language-specific optimizations
        if (repo.language === 'TypeScript' || repo.language === 'JavaScript') {
            if (files.some(f => f.name === 'tsconfig.json')) score += 10;
        }

        return Math.min(score, 100);
    }

    private analyzeErrorHandling(repo: GitHubRepo): number {
        // This would require code analysis, so we'll use heuristics
        let score = 50;

        // Mature projects likely have better error handling
        const ageInDays = (new Date().getTime() - new Date(repo.created_at).getTime()) / (1000 * 3600 * 24);
        if (ageInDays > 365) score += 20;
        if (ageInDays > 30) score += 10;

        // Popular projects likely have better error handling
        if (repo.stargazers_count > 100) score += 15;
        if (repo.stargazers_count > 10) score += 10;

        return Math.min(score, 100);
    }

    private analyzePracticality(repo: GitHubRepo): number {
        let score = 40;

        // Has description
        if (repo.description && repo.description.length > 20) score += 20;

        // Community engagement
        if (repo.stargazers_count > 0) score += 10;
        if (repo.forks_count > 0) score += 10;
        if (repo.stargazers_count > 10) score += 10;

        // Recent activity
        const lastUpdate = new Date(repo.pushed_at);
        const daysSinceUpdate = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24);
        if (daysSinceUpdate < 30) score += 10;

        return Math.min(score, 100);
    }

    private getScoreDescription(score: number, excellent: string, good: string, needsWork: string): string {
        if (score >= 80) return excellent;
        if (score >= 60) return good;
        return needsWork;
    }

    private calculateOverallScore(categories: { score: number }[]): number {
        const totalScore = categories.reduce((sum, cat) => sum + cat.score, 0);
        return Math.round(totalScore / categories.length);
    }

    private getTier(score: number): "Bronze" | "Silver" | "Gold" | "Platinum" {
        if (score >= 90) return "Platinum";
        if (score >= 75) return "Gold";
        if (score >= 60) return "Silver";
        return "Bronze";
    }

    private getIndustryReadiness(score: number): "Academic" | "Portfolio-Ready" | "Industry-Ready" {
        if (score >= 85) return "Industry-Ready";
        if (score >= 65) return "Portfolio-Ready";
        return "Academic";
    }

    private generateSummary(repo: GitHubRepo, categories: any[], score: number): string {
        const strengths = categories.filter(cat => cat.score >= 75);
        const weaknesses = categories.filter(cat => cat.score < 60);
        const moderate = categories.filter(cat => cat.score >= 60 && cat.score < 75);

        let summary = "";

        // Overall assessment
        if (score >= 85) {
            summary += "🎉 Excellent work! Your repository demonstrates professional-level development practices. ";
        } else if (score >= 70) {
            summary += "👍 Good job! Your repository shows solid development fundamentals with room for enhancement. ";
        } else if (score >= 55) {
            summary += "📈 Your repository has a good foundation but needs some improvements to reach its full potential. ";
        } else {
            summary += "🚀 Great start! With some focused improvements, this repository can become much stronger. ";
        }

        // Highlight top strengths
        if (strengths.length > 0) {
            const topStrengths = strengths.slice(0, 2).map(s => s.title);
            summary += `Your strongest areas are ${topStrengths.join(' and ')}, which shows you understand these important aspects well. `;
        }

        // Address main improvement areas
        if (weaknesses.length > 0) {
            const mainWeaknesses = weaknesses.slice(0, 2).map(w => w.title);
            summary += `Focus on improving ${mainWeaknesses.join(' and ')} to significantly boost your repository's quality. `;
        }

        // Community and purpose
        if (repo.stargazers_count > 10) {
            summary += "The community interest in your project shows it addresses a real need. ";
        } else if (repo.description && repo.description.length > 20) {
            summary += "Your clear project description helps others understand its purpose. ";
        } else {
            summary += "Consider adding a detailed description to help others understand your project's value. ";
        }

        // Encouraging note
        if (score < 70) {
            summary += "Keep building - every improvement makes your repository more professional and valuable! 💪";
        } else {
            summary += "You're on the right track to creating an industry-ready repository! 🌟";
        }

        return summary;
    }

    private generateRoadmap(categories: any[]): any[] {
        const roadmap = [];

        categories.forEach(category => {
            if (category.score < 70) {
                switch (category.title) {
                    case 'Testing':
                        roadmap.push({
                            title: '🧪 Add Comprehensive Tests',
                            description: 'Create unit tests for your main functions. Start with testing the most important features first. Tools like Jest, Vitest, or Pytest can help you get started quickly.',
                            priority: 'high' as const
                        });
                        break;
                    case 'Documentation':
                        roadmap.push({
                            title: '📚 Enhance Documentation',
                            description: 'Add clear setup instructions, usage examples, and screenshots. A good README should help someone understand and use your project in 5 minutes.',
                            priority: 'high' as const
                        });
                        break;
                    case 'Security':
                        roadmap.push({
                            title: '🔒 Improve Security Practices',
                            description: 'Remove any hardcoded passwords or API keys. Add input validation to prevent common security issues. Use environment variables for sensitive data.',
                            priority: 'high' as const
                        });
                        break;
                    case 'Project Structure':
                        roadmap.push({
                            title: '📁 Organize Project Structure',
                            description: 'Create clear folders like src/, docs/, tests/. Group related files together. This makes your project easier to navigate and understand.',
                            priority: 'medium' as const
                        });
                        break;
                    case 'Performance':
                        roadmap.push({
                            title: '⚡ Optimize Performance',
                            description: 'Add build optimization, minimize bundle size, and implement caching where appropriate. Consider lazy loading for better user experience.',
                            priority: 'medium' as const
                        });
                        break;
                    case 'Error Handling':
                        roadmap.push({
                            title: '🛠️ Enhance Error Handling',
                            description: 'Add try-catch blocks around risky operations. Provide helpful error messages that guide users on what went wrong and how to fix it.',
                            priority: 'medium' as const
                        });
                        break;
                    case 'Git Practices':
                        roadmap.push({
                            title: '📝 Improve Commit Messages',
                            description: 'Write clear commit messages that explain what changed and why. Use format like "Add user authentication" instead of just "fix".',
                            priority: 'low' as const
                        });
                        break;
                }
            }
        });

        // Add general improvements based on overall quality
        const overallScore = this.calculateOverallScore(categories);

        if (overallScore < 80) {
            roadmap.push({
                title: '🚀 Set Up CI/CD Pipeline',
                description: 'Use GitHub Actions to automatically test your code when you push changes. This catches bugs early and shows professionalism.',
                priority: 'medium' as const
            });
        }

        if (overallScore < 60) {
            roadmap.push({
                title: '🎯 Define Project Goals',
                description: 'Clearly explain what problem your project solves and who it\'s for. Add a demo or screenshots to show it in action.',
                priority: 'high' as const
            });
        }

        return roadmap.slice(0, 6); // Limit to 6 most important items
    }

    private generateRedFlags(repo: GitHubRepo, commits: GitHubCommit[], files: GitHubContent[]): any[] {
        const redFlags = [];

        // Check for poor commit messages
        const poorCommits = commits.filter(commit => {
            const message = commit.commit.message.toLowerCase();
            return message.length < 5 || message === 'fix' || message === 'update' || message.includes('wip');
        });

        if (poorCommits.length > commits.length * 0.3) {
            redFlags.push({
                type: 'poor_commits' as const,
                title: '📝 Vague Commit Messages',
                description: `${Math.round((poorCommits.length / commits.length) * 100)}% of your commits use unclear messages. Try writing what you changed and why, like "Add user login validation" instead of just "fix".`
            });
        }

        // Check for missing documentation
        const hasReadme = files.some(f => f.name.toLowerCase().startsWith('readme'));
        if (!hasReadme) {
            redFlags.push({
                type: 'missing_docs' as const,
                title: '📚 Missing README File',
                description: 'Your project needs a README.md file to explain what it does, how to install it, and how to use it. This is the first thing people see!'
            });
        }

        // Check for potential security issues
        if (files.some(f => f.name === '.env' || f.name.includes('secret') || f.name.includes('key'))) {
            redFlags.push({
                type: 'security_issue' as const,
                title: '🔒 Potential Security Risk',
                description: 'Found files that might contain secrets or passwords. Move sensitive data to environment variables and add these files to .gitignore.'
            });
        }

        // Check for unused files
        const suspiciousFiles = files.filter(f =>
            f.name.includes('temp') || f.name.includes('backup') || f.name.includes('old') || f.name.includes('copy')
        );
        if (suspiciousFiles.length > 0) {
            redFlags.push({
                type: 'unused_files' as const,
                title: '🗑️ Cleanup Needed',
                description: `Found ${suspiciousFiles.length} files that look like temporary or backup files (${suspiciousFiles.slice(0, 2).map(f => f.name).join(', ')}). Clean these up to keep your repo tidy.`
            });
        }

        // Check for very old repository with no recent activity
        const lastUpdate = new Date(repo.pushed_at);
        const monthsSinceUpdate = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24 * 30);
        if (monthsSinceUpdate > 6) {
            redFlags.push({
                type: 'unused_files' as const,
                title: '⏰ Inactive Repository',
                description: `No updates in ${Math.round(monthsSinceUpdate)} months. Consider adding recent improvements or archiving if the project is complete.`
            });
        }

        return redFlags;
    }

    private async generateReadmeChecklist(owner: string, repo: string, files: GitHubContent[]): Promise<any[]> {
        const readmeFile = files.find(f => f.name.toLowerCase().startsWith('readme'));
        let readmeContent = '';

        if (readmeFile) {
            readmeContent = await this.getFileContent(owner, repo, readmeFile.name);
        }

        return [
            { label: 'Project Overview', present: readmeContent.includes('##') || readmeContent.length > 100 },
            { label: 'Setup Instructions', present: readmeContent.toLowerCase().includes('install') || readmeContent.toLowerCase().includes('setup') },
            { label: 'Usage Examples', present: readmeContent.toLowerCase().includes('usage') || readmeContent.toLowerCase().includes('example') },
            { label: 'Screenshots/Demo', present: readmeContent.includes('![') || readmeContent.includes('demo') },
            { label: 'API Documentation', present: readmeContent.toLowerCase().includes('api') },
            { label: 'Contributing Guide', present: readmeContent.toLowerCase().includes('contribut') || files.some(f => f.name.toLowerCase().includes('contribut')) },
            { label: 'License', present: readmeContent.toLowerCase().includes('license') || files.some(f => f.name.toLowerCase().includes('license')) },
            { label: 'Future Scope', present: readmeContent.toLowerCase().includes('todo') || readmeContent.toLowerCase().includes('roadmap') || readmeContent.toLowerCase().includes('future') },
        ];
    }

    async analyzeRepository(githubUrl: string): Promise<AnalysisResult> {
        try {
            const { owner, repo } = this.extractRepoInfo(githubUrl);

            // Fetch all necessary data
            const [repoData, commits, files] = await Promise.all([
                this.getRepoData(owner, repo),
                this.getCommits(owner, repo),
                this.getContents(owner, repo)
            ]);

            // Analyze different aspects
            const categories = [
                {
                    title: 'Code Quality',
                    score: this.analyzeCodeQuality(repoData, files),
                    description: this.getScoreDescription(this.analyzeCodeQuality(repoData, files), 'Your code is well-structured and follows good practices', 'Code organization needs improvement', 'Consider improving code structure and consistency'),
                    iconName: 'code'
                },
                {
                    title: 'Project Structure',
                    score: this.analyzeProjectStructure(files),
                    description: this.getScoreDescription(this.analyzeProjectStructure(files), 'Excellent file organization and folder structure', 'Basic structure in place', 'Reorganize files into logical folders (src/, docs/, tests/)'),
                    iconName: 'folder'
                },
                {
                    title: 'Documentation',
                    score: await this.analyzeDocumentation(owner, repo, files),
                    description: this.getScoreDescription(await this.analyzeDocumentation(owner, repo, files), 'Comprehensive documentation with clear instructions', 'Good README with basic information', 'Add setup instructions, usage examples, and API docs'),
                    iconName: 'file'
                },
                {
                    title: 'Testing',
                    score: this.analyzeTesting(files),
                    description: this.getScoreDescription(this.analyzeTesting(files), 'Great test coverage and testing setup', 'Some tests present', 'Add unit tests and aim for 70%+ code coverage'),
                    iconName: 'test'
                },
                {
                    title: 'Git Practices',
                    score: this.analyzeGitPractices(commits),
                    description: this.getScoreDescription(this.analyzeGitPractices(commits), 'Excellent commit messages and git workflow', 'Good commit practices', 'Write more descriptive commit messages'),
                    iconName: 'git'
                },
                {
                    title: 'Security',
                    score: this.analyzeSecurity(files),
                    description: this.getScoreDescription(this.analyzeSecurity(files), 'Strong security practices implemented', 'Basic security measures in place', 'Add input validation and remove any exposed secrets'),
                    iconName: 'shield'
                },
                {
                    title: 'Performance',
                    score: this.analyzePerformance(repoData, files),
                    description: this.getScoreDescription(this.analyzePerformance(repoData, files), 'Well-optimized with performance considerations', 'Decent performance setup', 'Add build optimization and consider bundle size'),
                    iconName: 'gauge'
                },
                {
                    title: 'Error Handling',
                    score: this.analyzeErrorHandling(repoData),
                    description: this.getScoreDescription(this.analyzeErrorHandling(repoData), 'Robust error handling throughout', 'Basic error handling present', 'Add try-catch blocks and user-friendly error messages'),
                    iconName: 'alert'
                },
                {
                    title: 'Practicality',
                    score: this.analyzePracticality(repoData),
                    description: this.getScoreDescription(this.analyzePracticality(repoData), 'Solves real problems with clear value', 'Addresses a specific use case', 'Clarify the problem this project solves'),
                    iconName: 'idea'
                }
            ];

            const overallScore = this.calculateOverallScore(categories);
            const tier = this.getTier(overallScore);
            const industryReadiness = this.getIndustryReadiness(overallScore);

            return {
                repoName: repoData.name,
                repoUrl: repoData.html_url,
                score: overallScore,
                tier,
                industryReadiness,
                summary: this.generateSummary(repoData, categories, overallScore),
                categories,
                roadmap: this.generateRoadmap(categories),
                redFlags: this.generateRedFlags(repoData, commits, files),
                readmeChecklist: await this.generateReadmeChecklist(owner, repo, files)
            };

        } catch (error) {
            throw new Error(`Failed to analyze repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const githubAnalyzer = new GitHubAnalyzer();