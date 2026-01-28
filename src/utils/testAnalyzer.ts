import { githubAnalyzer } from '@/services/githubAnalyzer';

// Test function to verify the analyzer works
export async function testAnalyzer() {
    try {
        console.log('Testing GitHub Analyzer...');

        // Test with a popular repository
        const result = await githubAnalyzer.analyzeRepository('https://github.com/microsoft/vscode');

        console.log('Analysis Result:', {
            repoName: result.repoName,
            score: result.score,
            tier: result.tier,
            industryReadiness: result.industryReadiness,
            categoriesCount: result.categories.length,
            roadmapCount: result.roadmap.length,
            redFlagsCount: result.redFlags.length
        });

        return result;
    } catch (error) {
        console.error('Test failed:', error);
        throw error;
    }
}

// You can call this function in the browser console to test
// testAnalyzer().then(result => console.log('Test completed successfully'));