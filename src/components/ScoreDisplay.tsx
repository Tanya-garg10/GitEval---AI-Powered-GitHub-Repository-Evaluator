import { motion } from "framer-motion";
import { Trophy, Star, Award } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

const tierConfig = {
  Bronze: { 
    color: "text-amber-600", 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/30",
    glow: "shadow-amber-500/20",
    icon: Award
  },
  Silver: { 
    color: "text-slate-300", 
    bg: "bg-slate-400/10", 
    border: "border-slate-400/30",
    glow: "shadow-slate-400/20",
    icon: Star
  },
  Gold: { 
    color: "text-yellow-400", 
    bg: "bg-yellow-500/10", 
    border: "border-yellow-500/30",
    glow: "shadow-yellow-500/20",
    icon: Trophy
  },
  Platinum: { 
    color: "text-cyan-300", 
    bg: "bg-cyan-400/10", 
    border: "border-cyan-400/30",
    glow: "shadow-cyan-400/20",
    icon: Trophy
  },
};

const ScoreDisplay = ({ score, tier }: ScoreDisplayProps) => {
  const config = tierConfig[tier];
  const TierIcon = config.icon;
  
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col items-center justify-center p-8 rounded-2xl ${config.bg} border ${config.border} shadow-2xl ${config.glow}`}
    >
      {/* Circular progress */}
      <div className="relative w-40 h-40 mb-6">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted/50"
          />
          {/* Progress circle */}
          <motion.circle
            cx="80"
            cy="80"
            r="60"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className={config.color}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-4xl font-bold font-mono ${config.color}`}
          >
            {score}
          </motion.span>
          <span className="text-sm text-muted-foreground">/100</span>
        </div>
      </div>

      {/* Tier badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} border ${config.border}`}
      >
        <TierIcon className={`w-5 h-5 ${config.color}`} />
        <span className={`font-mono font-semibold ${config.color}`}>{tier}</span>
      </motion.div>
    </motion.div>
  );
};

export default ScoreDisplay;
