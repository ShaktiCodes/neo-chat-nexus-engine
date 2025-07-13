export const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gradient-card border border-border rounded-lg p-4 max-w-[80%] shadow-glow">
        <div className="flex items-center gap-2">
          <div className="text-neon-cyan">NEO is thinking</div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-typing-dots"></div>
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-typing-dots" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-typing-dots" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};