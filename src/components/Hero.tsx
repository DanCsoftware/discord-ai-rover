
import { ArrowRight, Bot, MessageSquare, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center text-center">
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <span className="text-xl font-semibold text-white/90">AI-Powered Discord Bot</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in leading-tight">
          Imagine a place<br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            powered by AI
          </span>
        </h1>
        
        <p className="text-xl text-white/80 mb-12 max-w-2xl leading-relaxed animate-fade-in">
          Transform your Discord server with cutting-edge AI capabilities. From intelligent conversations 
          to automated moderation, bring the future to your community today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all hover:scale-105">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-lg backdrop-blur-sm">
            View Demo
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="flex items-center gap-4 text-white/90 animate-fade-in">
            <div className="p-2 bg-white/10 rounded-lg">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <div className="font-semibold">Smart Conversations</div>
              <div className="text-sm text-white/70">AI that understands context</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-white/90 animate-fade-in">
            <div className="p-2 bg-white/10 rounded-lg">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <div className="font-semibold">Lightning Fast</div>
              <div className="text-sm text-white/70">Instant AI responses</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-white/90 animate-fade-in">
            <div className="p-2 bg-white/10 rounded-lg">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="font-semibold">Easy Setup</div>
              <div className="text-sm text-white/70">Ready in 60 seconds</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
