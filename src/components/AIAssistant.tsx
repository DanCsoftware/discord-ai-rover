
import { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface AIAssistantProps {
  message: string;
  onResponse: (response: string) => void;
}

export const AIAssistant = ({ message, onResponse }: AIAssistantProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processAIRequest = async (userMessage: string) => {
    setIsProcessing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // User-focused response generation
    const cleanMessage = userMessage.replace('@rover', '').trim().toLowerCase();
    let response = "Hey! I'm ROVER, and I'm here to make your Discord experience awesome! 🚀";
    
    // User-centric responses prioritizing helpfulness and friendliness
    if (cleanMessage.includes('help')) {
      response = "I'd love to help you! Here's what I can do for you:\n\n🔍 **Search & Find**: Find old messages, conversations, or specific topics\n🛡️ **Safety & Moderation**: Help moderators keep the community safe\n📊 **Server Insights**: Analyze channels and user activity\n💬 **Smart Assistance**: Answer questions and provide guidance\n\nJust ask me anything! What would you like help with today?";
    } else if (cleanMessage.includes('hello') || cleanMessage.includes('hi') || cleanMessage.includes('hey')) {
      response = "Hello there! 👋 I'm so glad you reached out! I'm here to help make your Discord experience better. What can I assist you with today?";
    } else if (cleanMessage.includes('search') || cleanMessage.includes('find')) {
      response = "I can definitely help you find what you're looking for! 🔍 You can ask me to:\n\n• Find messages about specific topics\n• Search for conversations with certain people\n• Look up historical discussions\n• Find threads or channels\n\nWhat would you like me to search for?";
    } else if (cleanMessage.includes('users') && (cleanMessage.includes('harass') || cleanMessage.includes('problem') || cleanMessage.includes('toxic'))) {
      response = "I understand you're concerned about user behavior. As a safety-focused assistant, I can help moderators by:\n\n🛡️ **User Safety Analysis**: Identify users with concerning behavior patterns\n📊 **Violation Reports**: Generate detailed reports on rule violations\n⚠️ **Risk Assessment**: Highlight users who need moderator attention\n\nWould you like me to analyze user behavior patterns for your server?";
    } else if (cleanMessage.includes('channel') && (cleanMessage.includes('delete') || cleanMessage.includes('remove') || cleanMessage.includes('optimize'))) {
      response = "Great question about channel management! I can help you optimize your server by:\n\n📊 **Channel Analysis**: Identify inactive or redundant channels\n🔄 **Consolidation Suggestions**: Recommend channels to merge\n❌ **Deletion Recommendations**: Find channels that can be safely removed\n📈 **Activity Insights**: Show which channels are thriving\n\nShould I analyze your server's channels and provide recommendations?";
    } else if (cleanMessage.includes('what') || cleanMessage.includes('how')) {
      response = "That's a fantastic question! 💭 I'm designed to be your helpful companion in Discord. I can assist with searches, provide insights, help with moderation, and much more!\n\nFeel free to be specific about what you're curious about - I'm here to help make things easier for you!";
    } else {
      response = "Thanks for reaching out! 😊 I'm ROVER, your friendly Discord assistant. I'm here to help you find information, assist with moderation, analyze your server, or just chat!\n\nWhat would you like to explore together today?";
    }
    
    setIsProcessing(false);
    onResponse(response);
  };

  return (
    <div className="flex items-start space-x-3 opacity-80">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
        {isProcessing ? (
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-white font-medium">ROVER</span>
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-1.5 py-0.5 rounded">AI</span>
          <span className="text-gray-500 text-xs">now</span>
        </div>
        
        {isProcessing ? (
          <div className="text-gray-400 text-sm italic">
            ROVER is thinking...
          </div>
        ) : (
          <div className="text-gray-300 text-sm">
            Processing your request...
          </div>
        )}
      </div>
    </div>
  );
};
