import { motion } from "framer-motion";
import { CheckCircle2, XCircle, FileText } from "lucide-react";

interface ReadmeCheckItem {
  label: string;
  present: boolean;
}

interface ReadmeChecklistProps {
  items: ReadmeCheckItem[];
}

const ReadmeChecklist = ({ items }: ReadmeChecklistProps) => {
  const completedCount = items.filter(item => item.present).length;
  const percentage = Math.round((completedCount / items.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="p-6 rounded-xl bg-card border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold font-mono">README Completeness</h3>
        </div>
        <span className={`text-sm font-mono font-bold ${percentage >= 70 ? 'text-primary' : percentage >= 40 ? 'text-yellow-400' : 'text-destructive'}`}>
          {percentage}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className="flex items-center gap-2"
          >
            {item.present ? (
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-destructive/70 flex-shrink-0" />
            )}
            <span className={`text-sm ${item.present ? 'text-foreground' : 'text-muted-foreground'}`}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReadmeChecklist;
