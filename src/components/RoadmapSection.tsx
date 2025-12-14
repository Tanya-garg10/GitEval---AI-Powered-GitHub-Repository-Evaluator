import { motion } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface RoadmapItem {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  completed?: boolean;
}

interface RoadmapSectionProps {
  items: RoadmapItem[];
}

const priorityConfig = {
  high: { label: "High Priority", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
  medium: { label: "Medium Priority", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  low: { label: "Low Priority", color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" },
};

const RoadmapSection = ({ items }: RoadmapSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-6">
        <ArrowRight className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold font-mono">Improvement Roadmap</h3>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const config = priorityConfig[item.priority];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              className={`relative flex gap-4 p-4 rounded-xl border ${config.border} ${config.bg} group hover:border-primary/50 transition-all duration-300`}
            >
              {/* Status icon */}
              <div className="flex-shrink-0 mt-1">
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold font-mono text-foreground">{item.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border}`}>
                    {config.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>

              {/* Connecting line */}
              {index < items.length - 1 && (
                <div className="absolute left-[29px] top-full w-0.5 h-4 bg-border" />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RoadmapSection;
