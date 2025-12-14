import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Rocket } from "lucide-react";

type ReadinessLevel = "Academic" | "Portfolio-Ready" | "Industry-Ready";

interface IndustryReadinessTagProps {
  level: ReadinessLevel;
}

const readinessConfig = {
  "Academic": {
    icon: GraduationCap,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    description: "Suitable for coursework and learning purposes"
  },
  "Portfolio-Ready": {
    icon: Briefcase,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    description: "Good for showcasing skills to potential employers"
  },
  "Industry-Ready": {
    icon: Rocket,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    description: "Meets professional production standards"
  }
};

const IndustryReadinessTag = ({ level }: IndustryReadinessTagProps) => {
  const config = readinessConfig[level];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className={`p-6 rounded-xl ${config.bg} border ${config.border}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Industry Readiness</p>
          <h3 className={`text-xl font-bold font-mono ${config.color}`}>{level}</h3>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{config.description}</p>
    </motion.div>
  );
};

export default IndustryReadinessTag;
