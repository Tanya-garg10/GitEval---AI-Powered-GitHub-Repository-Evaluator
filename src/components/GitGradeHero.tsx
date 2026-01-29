import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitBranch, ArrowRight, Sparkles } from "lucide-react";

interface GitGradeHeroProps {
  onAnalyze: (repoUrl: string) => void;
  isLoading: boolean;
}

const GitGradeHero = ({ onAnalyze, isLoading }: GitGradeHeroProps) => {
  const [repoUrl, setRepoUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      onAnalyze(repoUrl.trim());
    }
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-radial" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow delay-200" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-8 animate-slide-up">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground font-mono">AI-Powered Code Review</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up delay-100">
          <span className="text-gradient">GitEval</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-slide-up delay-200 font-mono">
          Your AI Virtual Mentor
        </p>

        <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto animate-slide-up delay-300">
          Evaluate any public GitHub repository with AI precision. Get actionable insights,
          scores, and a personalized improvement roadmap.
        </p>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="animate-slide-up delay-400">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="pl-12 h-14 text-base"
              />
            </div>
            <Button
              type="submit"
              variant="hero"
              size="xl"
              disabled={isLoading || !repoUrl.trim()}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Quick stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 animate-slide-up delay-400">
          {[
            { label: "Repos Analyzed", value: "10K+" },
            { label: "Code Quality Metrics", value: "15+" },
            { label: "Accuracy Rate", value: "98%" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold font-mono text-gradient">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GitGradeHero;