import { motion } from "framer-motion";
import { AlertTriangle, Copy, FileQuestion, MessageSquareWarning, Trash2 } from "lucide-react";

interface RedFlag {
  type: "copied_code" | "poor_commits" | "missing_docs" | "unused_files" | "security_issue";
  title: string;
  description: string;
}

interface RedFlagsSectionProps {
  redFlags: RedFlag[];
}

const flagIcons = {
  copied_code: Copy,
  poor_commits: MessageSquareWarning,
  missing_docs: FileQuestion,
  unused_files: Trash2,
  security_issue: AlertTriangle,
};

const RedFlagsSection = ({ redFlags }: RedFlagsSectionProps) => {
  if (redFlags.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl bg-primary/10 border border-primary/30"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <AlertTriangle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold font-mono text-primary">No Red Flags Detected</h3>
            <p className="text-sm text-muted-foreground">Great job! No major issues found.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <h3 className="text-xl font-bold font-mono">Red Flags</h3>
        <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-destructive/20 text-destructive border border-destructive/30">
          {redFlags.length} found
        </span>
      </div>

      <div className="space-y-3">
        {redFlags.map((flag, index) => {
          const Icon = flagIcons[flag.type] || AlertTriangle;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/30"
            >
              <div className="flex-shrink-0">
                <Icon className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h4 className="font-semibold font-mono text-destructive">{flag.title}</h4>
                <p className="text-sm text-muted-foreground">{flag.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RedFlagsSection;
