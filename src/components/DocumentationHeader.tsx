import { FileText, Sparkles } from 'lucide-react';

export const DocumentationHeader = () => {
  return (
    <div className="text-center space-y-6 mb-12">
      {/* Logo/Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow">
            <FileText className="w-12 h-12 text-primary-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 p-1 bg-gradient-primary rounded-full">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Title and Description */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Documentation AI
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Upload your documents and ask intelligent questions. Get precise answers 
          from your PDFs, docs, and text files with AI-powered document analysis.
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {[
          "PDF Analysis",
          "Document Q&A", 
          "Multiple Formats",
          "Instant Answers"
        ].map((feature) => (
          <span
            key={feature}
            className="px-3 py-1 text-xs font-medium bg-gradient-accent border border-border rounded-full text-foreground"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
};