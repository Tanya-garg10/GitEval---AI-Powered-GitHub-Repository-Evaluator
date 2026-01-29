import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  TrendingUp,
  Code2,
  Users,
  Sparkles,
  AlertTriangle,
  Gauge,
  FileCheck
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Get comprehensive code reviews in seconds, not hours."
  },
  {
    icon: Shield,
    title: "Security Analysis",
    description: "Detect exposed secrets, API keys, and security vulnerabilities."
  },
  {
    icon: Gauge,
    title: "Performance Review",
    description: "Evaluate scalability potential and optimization opportunities."
  },
  {
    icon: AlertTriangle,
    title: "Red Flag Detection",
    description: "Identify copied code, poor commits, and missing documentation."
  },
  {
    icon: FileCheck,
    title: "README Checklist",
    description: "Comprehensive documentation completeness verification."
  },
  {
    icon: TrendingUp,
    title: "Industry Readiness",
    description: "Know if your code is Academic, Portfolio, or Industry-Ready."
  },
  {
    icon: Code2,
    title: "Error Handling Review",
    description: "Analyze defensive programming and edge case coverage."
  },
  {
    icon: Users,
    title: "Recruiter-Ready",
    description: "Get feedback that mirrors what hiring managers look for."
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description: "Leverage advanced AI with honest limitation disclaimers."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-mono mb-4">
            Why <span className="text-gradient">GitEval</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Elevate your coding skills with AI-powered insights that help you
            write cleaner, more maintainable, and production-ready code.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="p-3 rounded-lg bg-muted w-fit mb-4 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold font-mono mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;