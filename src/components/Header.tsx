import { GitBranch, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <GitBranch className="w-5 h-5 text-primary" />
          </div>
          <span className="font-mono font-bold text-lg text-gradient">GitEval</span>
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </a>
        </nav>

        {/* CTA */}
        <Button variant="glass" size="sm" asChild>
          <a href="https://github.com/Tanya-garg10/GitEval---AI-Powered-GitHub-Repository-Evaluator" target="_blank" rel="noopener noreferrer">
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </Button>
      </div>
    </header>
  );
};

export default Header;
