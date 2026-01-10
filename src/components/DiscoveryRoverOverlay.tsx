import { useState, useCallback } from 'react';
import { Bot, ChevronLeft, ChevronRight, Minimize2, Maximize2, X, Sparkles, Send, Loader2 } from 'lucide-react';
import { servers, serverDiscoveryData } from '@/data/discordData';
import { useRoverChat } from '@/hooks/useRoverChat';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DiscoveryRoverOverlayProps {
  onServerHighlight?: (serverId: number) => void;
  onServerClick: (serverId: number) => void;
}

interface Step {
  id: string;
  title: string;
  subtitle: string;
}

const steps: Step[] = [
  { id: 'welcome', title: 'Welcome!', subtitle: 'Let me help you find your perfect community' },
  { id: 'interests', title: 'Your Interests', subtitle: 'What are you passionate about?' },
  { id: 'activity', title: 'Activity Level', subtitle: 'How active do you want to be?' },
  { id: 'community', title: 'Community Type', subtitle: 'What vibe are you looking for?' },
  { id: 'results', title: 'Your Matches', subtitle: 'Here are my recommendations!' },
];

const interestTags = [
  { id: 'gaming', label: '🎮 Gaming', icon: '🎮' },
  { id: 'music', label: '🎵 Music', icon: '🎵' },
  { id: 'art', label: '🎨 Art & Creative', icon: '🎨' },
  { id: 'tech', label: '💻 Technology', icon: '💻' },
  { id: 'crypto', label: '💰 Crypto & Finance', icon: '💰' },
  { id: 'competitive', label: '🏆 Competitive', icon: '🏆' },
  { id: 'casual', label: '☕ Casual', icon: '☕' },
  { id: 'social', label: '💬 Social', icon: '💬' },
];

const activityLevels = [
  { id: 'casual', label: 'Casual', description: 'I drop in when I feel like it', emoji: '🌙' },
  { id: 'regular', label: 'Regular', description: 'A few times a week', emoji: '☀️' },
  { id: 'active', label: 'Active', description: 'Daily engagement', emoji: '⚡' },
  { id: 'hardcore', label: 'Hardcore', description: 'This is my second home', emoji: '🔥' },
];

const communityTypes = [
  { id: 'competitive', label: 'Competitive', description: 'Tournaments & ranked play', emoji: '🏆' },
  { id: 'creative', label: 'Creative', description: 'Art, music, content creation', emoji: '🎨' },
  { id: 'social', label: 'Social', description: 'Hangouts & making friends', emoji: '💬' },
  { id: 'learning', label: 'Learning', description: 'Education & skill-building', emoji: '📚' },
];

const DiscoveryRoverOverlay = ({ onServerHighlight, onServerClick }: DiscoveryRoverOverlayProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [customQuery, setCustomQuery] = useState('');
  const [recommendations, setRecommendations] = useState<number[]>([]);
  const [roverMessage, setRoverMessage] = useState('');
  
  const { streamingResponse, isStreaming, sendMessage } = useRoverChat();

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getRecommendedServers = useCallback(() => {
    // Simple matching logic based on selections
    const serverScores: { id: number; score: number }[] = [];
    
    servers.forEach(server => {
      let score = 0;
      const name = server.name.toLowerCase();
      
      // Match interests
      if (selectedInterests.includes('gaming') && (name.includes('gaming') || name.includes('hub'))) score += 2;
      if (selectedInterests.includes('music') && name.includes('music')) score += 2;
      if (selectedInterests.includes('art') && (name.includes('art') || name.includes('midjourney'))) score += 2;
      if (selectedInterests.includes('tech') && (name.includes('tech') || name.includes('dev') || name.includes('code'))) score += 2;
      if (selectedInterests.includes('crypto') && name.includes('crypto')) score += 2;
      
      // Give all servers a base score if interests match
      if (selectedInterests.length > 0) score += 1;
      
      serverScores.push({ id: server.id, score });
    });
    
    return serverScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(s => s.id);
  }, [selectedInterests]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === 3) {
        // Moving to results - get recommendations
        const recs = getRecommendedServers();
        setRecommendations(recs);
        
        // Ask ROVER for personalized message
        const context = {
          channelName: 'discovery',
          serverName: 'Discovery',
          messages: []
        };
        
        const interestNames = selectedInterests.map(i => interestTags.find(t => t.id === i)?.label).join(', ');
        const activityName = activityLevels.find(a => a.id === selectedActivity)?.label;
        const communityName = communityTypes.find(c => c.id === selectedCommunity)?.label;
        
        try {
          await sendMessage(
            `Based on someone interested in ${interestNames || 'various topics'}, who wants ${activityName || 'moderate'} activity, and prefers ${communityName || 'social'} communities, give a brief 2-3 sentence personalized recommendation message. Be encouraging and specific.`,
            context
          );
        } catch {
          setRoverMessage("I've found some great communities that match your interests! Check them out below.");
        }
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAskRover = async () => {
    if (!customQuery.trim()) return;
    
    const context = {
      channelName: 'discovery',
      serverName: 'Discovery',
      messages: []
    };
    
    try {
      await sendMessage(
        `Help me find Discord servers: ${customQuery}. Suggest specific types of communities I should look for.`,
        context
      );
    } catch {
      // Error handled in hook
    }
    setCustomQuery('');
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
        onClick={() => setIsMinimized(false)}
      >
        <div 
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse"
          style={{ 
            background: 'linear-gradient(135deg, #5865f2 0%, #7c3aed 100%)',
            boxShadow: '0 4px 20px rgba(88, 101, 242, 0.4)'
          }}
        >
          <Bot className="w-7 h-7 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 rounded-2xl overflow-hidden shadow-2xl"
      style={{ 
        width: '380px',
        maxHeight: '520px',
        backgroundColor: 'hsl(var(--discord-bg-secondary))',
        border: '1px solid hsl(var(--discord-bg-quaternary))',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3"
        style={{ 
          background: 'linear-gradient(135deg, #5865f2 0%, #7c3aed 100%)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">ROVER Discovery</h3>
            <p className="text-white/80 text-xs">{steps[currentStep].subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-white" />
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-black/20">
        <div 
          className="h-full transition-all duration-300"
          style={{ 
            width: `${((currentStep + 1) / steps.length) * 100}%`,
            background: 'linear-gradient(90deg, #57f287 0%, #5865f2 100%)'
          }}
        />
      </div>

      {/* Content */}
      <ScrollArea className="flex-1" style={{ height: '380px' }}>
        <div className="p-4">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="text-center py-6">
              <div 
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5865f2 0%, #7c3aed 100%)' }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                Hey there! 👋
              </h2>
              <p className="text-sm mb-6" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                I'm ROVER, your AI discovery assistant. Let me help you find the perfect Discord communities based on your interests!
              </p>
              
              {/* Quick Ask */}
              <div className="mt-4">
                <p className="text-xs mb-2" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                  Or ask me anything:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="Find servers for..."
                    className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ 
                      backgroundColor: 'hsl(var(--discord-bg-tertiary))',
                      color: 'hsl(var(--discord-text-normal))'
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskRover()}
                  />
                  <button 
                    onClick={handleAskRover}
                    disabled={isStreaming}
                    className="px-3 py-2 rounded-lg transition-colors"
                    style={{ backgroundColor: 'hsl(var(--discord-brand))' }}
                  >
                    {isStreaming ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
                
                {(streamingResponse || isStreaming) && currentStep === 0 && (
                  <div 
                    className="mt-3 p-3 rounded-lg text-sm text-left"
                    style={{ 
                      backgroundColor: 'hsl(var(--discord-bg-tertiary))',
                      color: 'hsl(var(--discord-text-normal))'
                    }}
                  >
                    {streamingResponse || 'Thinking...'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Interests */}
          {currentStep === 1 && (
            <div>
              <h3 className="font-bold mb-3" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                What interests you? (Select multiple)
              </h3>
              <div className="flex flex-wrap gap-2">
                {interestTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleInterest(tag.id)}
                    className="px-3 py-2 rounded-full text-sm font-medium transition-all"
                    style={{ 
                      backgroundColor: selectedInterests.includes(tag.id) 
                        ? 'hsl(var(--discord-brand))' 
                        : 'hsl(var(--discord-bg-tertiary))',
                      color: selectedInterests.includes(tag.id)
                        ? 'white'
                        : 'hsl(var(--discord-text-normal))'
                    }}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-4" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                Selected: {selectedInterests.length > 0 
                  ? selectedInterests.map(i => interestTags.find(t => t.id === i)?.icon).join(' ')
                  : 'None yet'}
              </p>
            </div>
          )}

          {/* Step 2: Activity Level */}
          {currentStep === 2 && (
            <div>
              <h3 className="font-bold mb-3" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                How active do you want to be?
              </h3>
              <div className="space-y-2">
                {activityLevels.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedActivity(level.id)}
                    className="w-full p-3 rounded-lg text-left transition-all flex items-center gap-3"
                    style={{ 
                      backgroundColor: selectedActivity === level.id 
                        ? 'hsl(var(--discord-brand))' 
                        : 'hsl(var(--discord-bg-tertiary))',
                      color: selectedActivity === level.id
                        ? 'white'
                        : 'hsl(var(--discord-text-normal))'
                    }}
                  >
                    <span className="text-2xl">{level.emoji}</span>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs opacity-70">{level.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Community Type */}
          {currentStep === 3 && (
            <div>
              <h3 className="font-bold mb-3" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                What vibe are you looking for?
              </h3>
              <div className="space-y-2">
                {communityTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedCommunity(type.id)}
                    className="w-full p-3 rounded-lg text-left transition-all flex items-center gap-3"
                    style={{ 
                      backgroundColor: selectedCommunity === type.id 
                        ? 'hsl(var(--discord-brand))' 
                        : 'hsl(var(--discord-bg-tertiary))',
                      color: selectedCommunity === type.id
                        ? 'white'
                        : 'hsl(var(--discord-text-normal))'
                    }}
                  >
                    <span className="text-2xl">{type.emoji}</span>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs opacity-70">{type.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {currentStep === 4 && (
            <div>
              {/* ROVER's Message */}
              <div 
                className="p-3 rounded-lg mb-4 flex items-start gap-3"
                style={{ backgroundColor: 'hsl(var(--discord-bg-tertiary))' }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5865f2 0%, #7c3aed 100%)' }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                    {isStreaming ? streamingResponse || 'Finding your perfect matches...' : 
                     streamingResponse || "I've found some great communities that match your interests! Check them out below."}
                  </p>
                </div>
              </div>

              <h3 className="font-bold mb-3" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                🎯 Recommended for You
              </h3>
              
              <div className="space-y-2">
                {recommendations.map(serverId => {
                  const server = servers.find(s => s.id === serverId);
                  const meta = serverDiscoveryData[serverId];
                  if (!server || !meta) return null;
                  
                  return (
                    <div 
                      key={serverId}
                      className="p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: 'hsl(var(--discord-bg-tertiary))' }}
                      onClick={() => onServerClick(serverId)}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                          style={{ 
                            background: server.iconStyle?.background || 'hsl(var(--discord-bg-primary))'
                          }}
                        >
                          {server.icon.startsWith('/') || server.icon.startsWith('http') ? (
                            <img src={server.icon} alt={server.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold">
                              {server.iconStyle?.text || server.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                            {server.name}
                          </div>
                          <div className="text-xs truncate" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                            {meta.memberCount.toLocaleString()} members
                          </div>
                        </div>
                        <button 
                          className="px-3 py-1.5 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: 'hsl(var(--discord-green))',
                            color: 'white'
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button 
                onClick={() => setCurrentStep(0)}
                className="w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ 
                  backgroundColor: 'hsl(var(--discord-bg-tertiary))',
                  color: 'hsl(var(--discord-text-normal))'
                }}
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Navigation */}
      {currentStep > 0 && currentStep < 4 && (
        <div 
          className="flex items-center justify-between px-4 py-3"
          style={{ borderTop: '1px solid hsl(var(--discord-bg-quaternary))' }}
        >
          <button 
            onClick={handleBack}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ 
              backgroundColor: 'hsl(var(--discord-bg-tertiary))',
              color: 'hsl(var(--discord-text-normal))'
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button 
            onClick={handleNext}
            disabled={
              (currentStep === 1 && selectedInterests.length === 0) ||
              (currentStep === 2 && !selectedActivity) ||
              (currentStep === 3 && !selectedCommunity)
            }
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            style={{ 
              backgroundColor: 'hsl(var(--discord-brand))',
              color: 'white'
            }}
          >
            {currentStep === 3 ? 'Find Communities' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Get Started Button for Welcome */}
      {currentStep === 0 && (
        <div 
          className="px-4 py-3"
          style={{ borderTop: '1px solid hsl(var(--discord-bg-quaternary))' }}
        >
          <button 
            onClick={handleNext}
            className="w-full py-3 rounded-lg text-sm font-medium transition-colors"
            style={{ 
              backgroundColor: 'hsl(var(--discord-brand))',
              color: 'white'
            }}
          >
            Let's Get Started! 🚀
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscoveryRoverOverlay;
