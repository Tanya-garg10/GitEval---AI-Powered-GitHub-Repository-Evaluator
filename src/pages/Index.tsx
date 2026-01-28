import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import GitGradeHero from "@/components/GitGradeHero";
import AnalysisResults from "@/components/AnalysisResults";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { githubAnalyzer } from "@/services/githubAnalyzer";

interface AnalysisData {
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

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleAnalyze = async (repoUrl: string) => {
    // Validate URL format
    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[^\/]+\/[^\/]+/;
    if (!githubUrlPattern.test(repoUrl.trim())) {
      toast.error("Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repository)");
      return;
    }

    setIsLoading(true);

    try {
      // Use the real GitHub analyzer
      const result = await githubAnalyzer.analyzeRepository(repoUrl);
      setAnalysisData(result);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze repository. Please check the URL and try again.");
    } finally {
      setIsLoading(false);
    }
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
