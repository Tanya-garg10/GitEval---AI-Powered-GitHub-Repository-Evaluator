import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import GitGradeHero from "@/components/GitGradeHero";
import AnalysisResults from "@/components/AnalysisResults";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { toast } from "sonner";

// Mock analysis data - in production this would come from AI analysis
const mockAnalysisData = {
  repoName: "awesome-project",
  repoUrl: "https://github.com/user/awesome-project",
  score: 78,
  tier: "Silver" as const,
  industryReadiness: "Portfolio-Ready" as const,
  summary: "This repository demonstrates solid fundamentals with well-organized code structure and consistent commit history. Security practices are adequate but could be strengthened. The documentation could be enhanced, and adding comprehensive tests would significantly improve reliability. Overall, it shows good development practices with room for improvement in testing and CI/CD setup.",
  categories: [
    { title: "Code Quality", score: 82, description: "Clean, readable code with consistent styling", iconName: "code" },
    { title: "Project Structure", score: 85, description: "Well-organized folders and file naming", iconName: "folder" },
    { title: "Documentation", score: 65, description: "README present but could use more detail", iconName: "file" },
    { title: "Testing", score: 55, description: "Limited test coverage detected", iconName: "test" },
    { title: "Git Practices", score: 90, description: "Consistent commits with clear messages", iconName: "git" },
    { title: "Security", score: 72, description: "No exposed secrets, basic input validation", iconName: "shield" },
    { title: "Performance", score: 68, description: "Room for optimization and caching", iconName: "gauge" },
    { title: "Error Handling", score: 60, description: "Basic error handling, missing edge cases", iconName: "alert" },
    { title: "Practicality", score: 88, description: "Solves a real-world problem effectively", iconName: "idea" },
  ],
  roadmap: [
    { title: "Add Comprehensive Tests", description: "Implement unit tests for core functionality. Aim for at least 70% code coverage.", priority: "high" as const },
    { title: "Enhance Security Practices", description: "Add input validation, sanitize user inputs, and implement proper error boundaries.", priority: "high" as const },
    { title: "Improve Error Handling", description: "Add try-catch blocks, handle edge cases, and implement proper error logging.", priority: "high" as const },
    { title: "Enhance Documentation", description: "Add API documentation, usage examples, and contribution guidelines.", priority: "medium" as const },
    { title: "Set Up CI/CD Pipeline", description: "Configure GitHub Actions for automated testing and deployment.", priority: "medium" as const },
    { title: "Optimize Performance", description: "Add lazy loading, implement caching strategies, and optimize bundle size.", priority: "low" as const },
  ],
  redFlags: [
    { type: "missing_docs" as const, title: "Incomplete API Documentation", description: "API endpoints lack proper documentation making integration difficult for other developers." },
    { type: "poor_commits" as const, title: "Some Vague Commit Messages", description: "Several commits use generic messages like 'fix' or 'update' without context." },
  ],
  readmeChecklist: [
    { label: "Project Overview", present: true },
    { label: "Setup Instructions", present: true },
    { label: "Usage Examples", present: false },
    { label: "Screenshots/Demo", present: true },
    { label: "API Documentation", present: false },
    { label: "Contributing Guide", present: false },
    { label: "License", present: true },
    { label: "Future Scope", present: false },
  ],
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<typeof mockAnalysisData | null>(null);

  const handleAnalyze = async (repoUrl: string) => {
    // Validate URL format
    if (!repoUrl.includes("github.com")) {
      toast.error("Please enter a valid GitHub repository URL");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    // Extract repo name from URL
    const urlParts = repoUrl.split("/");
    const repoName = urlParts[urlParts.length - 1] || "repository";
    
    setAnalysisData({
      ...mockAnalysisData,
      repoName,
      repoUrl,
    });
    
    setIsLoading(false);
    toast.success("Analysis complete!");
  };

  const handleReset = () => {
    setAnalysisData(null);
  };

  return (
    <>
      <Helmet>
        <title>GitEval - AI-Powered GitHub Repository Evaluator</title>
        <meta 
          name="description" 
          content="Evaluate your GitHub repositories with AI precision. Get actionable insights, scores, and a personalized improvement roadmap from GitEval - your virtual code mentor." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          {analysisData ? (
            <AnalysisResults data={analysisData} onReset={handleReset} />
          ) : (
            <>
              <GitGradeHero onAnalyze={handleAnalyze} isLoading={isLoading} />
              <FeaturesSection />
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
