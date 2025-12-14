import { motion } from "framer-motion";
import { 
  Code2, 
  FolderTree, 
  FileText, 
  TestTube, 
  GitCommit, 
  Lightbulb,
  ExternalLink,
  RotateCcw,
  Shield,
  Gauge,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScoreDisplay from "./ScoreDisplay";
import CategoryCard from "./CategoryCard";
import RoadmapSection from "./RoadmapSection";
import IndustryReadinessTag from "./IndustryReadinessTag";
import RedFlagsSection from "./RedFlagsSection";
import ReadmeChecklist from "./ReadmeChecklist";
import AIDisclaimer from "./AIDisclaimer";

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

interface AnalysisResultsProps {
  data: AnalysisData;
  onReset: () => void;
}

const iconMap: { [key: string]: any } = {
  code: Code2,
  folder: FolderTree,
  file: FileText,
  test: TestTube,
  git: GitCommit,
  idea: Lightbulb,
  shield: Shield,
  gauge: Gauge,
  alert: AlertCircle,
};

const AnalysisResults = ({ data, onReset }: AnalysisResultsProps) => {
  return (
    <section className="relative py-16 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl font-bold font-mono text-gradient mb-2">
              {data.repoName}
            </h2>
            <a 
              href={data.repoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {data.repoUrl}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <Button variant="glass" onClick={onReset}>
            <RotateCcw className="w-4 h-4" />
            Analyze Another
          </Button>
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Score column */}
          <div className="lg:col-span-1 space-y-6">
            <ScoreDisplay score={data.score} tier={data.tier} />
            
            {/* Industry Readiness */}
            <IndustryReadinessTag level={data.industryReadiness} />
            
            {/* README Checklist */}
            <ReadmeChecklist items={data.readmeChecklist} />
            
            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <h3 className="text-lg font-semibold font-mono mb-3">Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {data.summary}
              </p>
            </motion.div>
          </div>

          {/* Categories and Roadmap */}
          <div className="lg:col-span-2 space-y-8">
            {/* Categories grid */}
            <div>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold font-mono mb-6 flex items-center gap-2"
              >
                <Code2 className="w-5 h-5 text-primary" />
                Category Breakdown
              </motion.h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.categories.map((category, index) => (
                  <CategoryCard
                    key={category.title}
                    title={category.title}
                    score={category.score}
                    description={category.description}
                    icon={iconMap[category.iconName] || Code2}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Red Flags Section */}
            <RedFlagsSection redFlags={data.redFlags} />

            {/* Roadmap */}
            <RoadmapSection items={data.roadmap} />
          </div>
        </div>

        {/* AI Disclaimer */}
        <AIDisclaimer />
      </div>
    </section>
  );
};

export default AnalysisResults;
