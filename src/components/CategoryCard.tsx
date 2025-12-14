import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  score: number;
  description: string;
  icon: LucideIcon;
  index: number;
}

const CategoryCard = ({ title, score, description, icon: Icon, index }: CategoryCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-destructive";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-primary";
    if (score >= 60) return "bg-yellow-400";
    if (score >= 40) return "bg-orange-400";
    return "bg-destructive";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-muted">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <span className={`text-2xl font-bold font-mono ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>

        <h3 className="text-lg font-semibold font-mono mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
            className={`h-full rounded-full ${getProgressColor(score)}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
