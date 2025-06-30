
import { Bot, Shield, Zap, MessageSquare, Users, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Conversations",
      description: "Engage your community with intelligent AI that understands context and provides meaningful responses.",
      color: "bg-purple-500"
    },
    {
      icon: Shield,
      title: "Smart Moderation",
      description: "Automatically detect and handle inappropriate content with advanced AI moderation capabilities.",
      color: "bg-green-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast Responses",
      description: "Get instant AI responses that keep conversations flowing naturally in your Discord server.",
      color: "bg-yellow-500"
    },
    {
      icon: MessageSquare,
      title: "Natural Language Processing",
      description: "Advanced NLP understands intent, emotion, and context for more human-like interactions.",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "Community Engagement",
      description: "Boost server activity with AI that can host events, answer questions, and welcome new members.",
      color: "bg-pink-500"
    },
    {
      icon: Settings,
      title: "Easy Configuration",
      description: "Set up and customize your AI bot in minutes with our intuitive dashboard and simple commands.",
      color: "bg-indigo-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful AI Features for Your Discord Server
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transform your Discord experience with cutting-edge AI capabilities designed to enhance 
            community engagement and streamline server management.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
