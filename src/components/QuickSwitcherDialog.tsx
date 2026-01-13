import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Hash, Volume2, CheckSquare, AtSign, X, Compass, Search, FileText, Shield, Gamepad2, CheckCircle, Sparkles } from "lucide-react";
import RoverAvatar from "./RoverAvatar";
import { servers } from "@/data/discordData";

interface QuickSwitcherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChannelClick: (channelId: string) => void;
  onServerClick: (serverId: number) => void;
  onDMClick: (userId: string) => void;
}

interface QuickSwitcherItem {
  id: string;
  type: 'channel' | 'dm' | 'mention';
  name: string;
  category?: string;
  serverName?: string;
  serverId?: number;
  serverEmoji?: string;
  unreadCount?: number;
  icon: 'hash' | 'volume' | 'check' | 'mention';
}

// ROVER tips data for slideshow
const roverTips = [
  {
    category: "Navigation",
    icon: Compass,
    text: '"help me navigate to privacy settings" or "find notification options"',
    color: "hsl(var(--discord-blurple))"
  },
  {
    category: "Search",
    icon: Search,
    text: '"search for messages about crypto" or "find files from last week"',
    color: "hsl(142, 76%, 36%)"
  },
  {
    category: "Summarize",
    icon: FileText,
    text: '"summarize the last 50 messages" or "what did I miss?"',
    color: "hsl(45, 93%, 47%)"
  },
  {
    category: "Link Safety",
    icon: Shield,
    text: '"is this link safe?" or "check this URL for me"',
    color: "hsl(0, 84%, 60%)"
  },
  {
    category: "Gaming",
    icon: Gamepad2,
    text: '"what games are trending?" or "find gaming servers"',
    color: "hsl(280, 67%, 55%)"
  },
  {
    category: "Fact Check",
    icon: CheckCircle,
    text: '"fact check this claim" or "verify this information"',
    color: "hsl(199, 89%, 48%)"
  },
  {
    category: "Discovery",
    icon: Sparkles,
    text: '"recommend me servers about art" or "find communities for music"',
    color: "hsl(330, 81%, 60%)"
  }
];

const QuickSwitcherDialog = ({
  open,
  onOpenChange,
  onChannelClick,
  onServerClick,
  onDMClick,
}: QuickSwitcherDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTips, setShowTips] = useState(true);

  // Mock data for previous channels and mentions
  const previousChannels: QuickSwitcherItem[] = [
    {
      id: 'general-chat',
      type: 'channel',
      name: 'general-chat',
      category: 'THE ALLEY',
      serverName: 'Azuki',
      serverId: 1,
      serverEmoji: '🫘',
      icon: 'hash'
    },
    {
      id: 'game-announcements',
      type: 'channel',
      name: 'announcements',
      category: 'ABOUT',
      serverName: 'Gaming Hub',
      serverId: 2,
      serverEmoji: '🎮',
      unreadCount: 32,
      icon: 'hash'
    },
    {
      id: 'rules-verify',
      type: 'channel',
      name: 'rules/verify',
      category: 'WELCOME',
      serverName: 'Crypto Central',
      serverId: 9,
      serverEmoji: '₿',
      icon: 'check'
    }
  ];

  const mentions: QuickSwitcherItem[] = [
    {
      id: 'stream-chat',
      type: 'mention',
      name: 'imstreaming',
      category: 'STREAM',
      serverName: 'Pie Stream',
      serverId: 2,
      serverEmoji: '🥧',
      unreadCount: 57,
      icon: 'hash'
    },
    {
      id: 'crypto-announcements',
      type: 'mention',
      name: 'announcements',
      category: 'ANNOUNCEMENTS',
      serverName: 'Crypto Central',
      serverId: 9,
      serverEmoji: '₿',
      unreadCount: 34,
      icon: 'hash'
    }
  ];

  const allItems = [...previousChannels, ...mentions];
  
  // Filter items based on search query
  const filteredItems = searchQuery 
    ? allItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.serverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allItems;

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setSelectedIndex(0);
      setShowTips(true);
      setCurrentTipIndex(0);
    }
  }, [open]);

  // Auto-rotate tips every 3.5 seconds
  useEffect(() => {
    if (!open || !showTips) return;
    
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % roverTips.length);
    }, 3500);
    
    return () => clearInterval(interval);
  }, [open, showTips]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedItem = filteredItems[selectedIndex];
      if (selectedItem) {
        handleItemClick(selectedItem);
      }
    }
  };

  const handleItemClick = (item: QuickSwitcherItem) => {
    if (item.serverId) {
      onServerClick(item.serverId);
      onChannelClick(item.id);
    }
    onOpenChange(false);
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'hash':
        return <Hash className="w-5 h-5" style={{ color: 'hsl(var(--discord-text-muted))' }} />;
      case 'volume':
        return <Volume2 className="w-5 h-5" style={{ color: 'hsl(var(--discord-text-muted))' }} />;
      case 'check':
        return <CheckSquare className="w-5 h-5" style={{ color: 'hsl(var(--discord-text-muted))' }} />;
      case 'mention':
        return <AtSign className="w-5 h-5" style={{ color: 'hsl(var(--discord-text-muted))' }} />;
      default:
        return <Hash className="w-5 h-5" style={{ color: 'hsl(var(--discord-text-muted))' }} />;
    }
  };

  const filteredPreviousChannels = searchQuery 
    ? filteredItems.filter(item => item.type === 'channel')
    : previousChannels;
  
  const filteredMentions = searchQuery 
    ? filteredItems.filter(item => item.type === 'mention')
    : mentions;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-xl p-0 border-0 overflow-hidden"
        style={{ 
          backgroundColor: 'hsl(var(--discord-bg-secondary))',
          borderRadius: '8px'
        }}
      >
        {/* Header */}
        <div className="p-4 pb-0">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'hsl(var(--discord-text-muted))' }}>
            Search for servers, channels or DMs
          </p>
          
          {/* Search Input */}
          <div 
            className="flex items-center rounded px-3 py-2.5"
            style={{ backgroundColor: 'hsl(var(--discord-bg-tertiary))' }}
          >
            <input
              type="text"
              placeholder="Where would you like to go?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full bg-transparent outline-none text-base"
              style={{ color: 'hsl(var(--discord-text-normal))' }}
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {/* Previous Channels Section */}
          {filteredPreviousChannels.length > 0 && (
            <>
              <div className="px-2 py-1.5">
                <span className="text-xs font-semibold uppercase" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                  Previous Channels
                </span>
              </div>
              {filteredPreviousChannels.map((item, index) => {
                const globalIndex = filteredItems.indexOf(item);
                return (
                  <div
                    key={`${item.id}-${index}`}
                    onClick={() => handleItemClick(item)}
                    className="flex items-center px-2 py-2 rounded cursor-pointer transition-colors"
                    style={{ 
                      backgroundColor: selectedIndex === globalIndex 
                        ? 'hsl(var(--discord-bg-quaternary))' 
                        : 'transparent'
                    }}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                  >
                    {/* Channel Icon */}
                    <div className="mr-2">
                      {getIcon(item.icon)}
                    </div>
                    
                    {/* Server Emoji */}
                    <div className="w-6 h-6 rounded-md flex items-center justify-center mr-2 text-sm" style={{ backgroundColor: 'hsl(var(--discord-bg-tertiary))' }}>
                      {item.serverEmoji}
                    </div>
                    
                    {/* Channel Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                          {item.name}
                        </span>
                        {item.unreadCount && (
                          <span 
                            className="px-1.5 py-0.5 text-xs font-bold rounded"
                            style={{ backgroundColor: '#f59e0b', color: 'white' }}
                          >
                            {item.unreadCount}
                          </span>
                        )}
                      </div>
                      <span className="text-xs" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                        {item.category}
                      </span>
                    </div>
                    
                    {/* Server Name */}
                    <span className="text-sm ml-2 flex-shrink-0" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                      {item.serverName}
                    </span>
                  </div>
                );
              })}
            </>
          )}

          {/* Mentions Section */}
          {filteredMentions.length > 0 && (
            <>
              <div className="px-2 py-1.5 mt-2">
                <span className="text-xs font-semibold uppercase" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                  Mentions
                </span>
              </div>
              {filteredMentions.map((item, index) => {
                const globalIndex = filteredItems.indexOf(item);
                return (
                  <div
                    key={`${item.id}-mention-${index}`}
                    onClick={() => handleItemClick(item)}
                    className="flex items-center px-2 py-2 rounded cursor-pointer transition-colors"
                    style={{ 
                      backgroundColor: selectedIndex === globalIndex 
                        ? 'hsl(var(--discord-bg-quaternary))' 
                        : 'transparent'
                    }}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                  >
                    {/* Channel Icon */}
                    <div className="mr-2">
                      {getIcon(item.icon)}
                    </div>
                    
                    {/* Server Emoji */}
                    <div className="w-6 h-6 rounded-md flex items-center justify-center mr-2 text-sm" style={{ backgroundColor: 'hsl(var(--discord-bg-tertiary))' }}>
                      {item.serverEmoji}
                    </div>
                    
                    {/* Channel Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                          {item.name}
                        </span>
                        {item.unreadCount && (
                          <span 
                            className="px-1.5 py-0.5 text-xs font-bold rounded"
                            style={{ backgroundColor: '#f59e0b', color: 'white' }}
                          >
                            {item.unreadCount}
                          </span>
                        )}
                      </div>
                      <span className="text-xs" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                        {item.category}
                      </span>
                    </div>
                    
                    {/* Server Name */}
                    <span className="text-sm ml-2 flex-shrink-0" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                      {item.serverName}
                    </span>
                  </div>
                );
              })}
            </>
          )}

          {/* No Results */}
          {filteredItems.length === 0 && searchQuery && (
            <div className="flex items-center justify-center py-8">
              <span style={{ color: 'hsl(var(--discord-text-muted))' }}>
                No results found for "{searchQuery}"
              </span>
            </div>
          )}
        </div>

        {/* ROVER Tips Slideshow Footer */}
        {showTips && (
          <div 
            className="px-4 py-3 border-t"
            style={{ 
              backgroundColor: 'hsl(var(--discord-bg-tertiary))',
              borderColor: 'hsl(var(--discord-bg-quaternary))'
            }}
          >
            <div className="flex items-center gap-3">
              {/* ROVER Avatar */}
              <RoverAvatar size="sm" isThinking={false} />
              
              {/* Tip Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {(() => {
                    const CurrentIcon = roverTips[currentTipIndex].icon;
                    return (
                      <CurrentIcon 
                        className="w-3.5 h-3.5" 
                        style={{ color: roverTips[currentTipIndex].color }} 
                      />
                    );
                  })()}
                  <span 
                    className="text-xs font-semibold"
                    style={{ color: roverTips[currentTipIndex].color }}
                  >
                    ROVER {roverTips[currentTipIndex].category}
                  </span>
                </div>
                <p 
                  className="text-xs truncate transition-opacity duration-300"
                  style={{ color: 'hsl(var(--discord-text-muted))' }}
                >
                  try: {roverTips[currentTipIndex].text}
                </p>
              </div>
              
              {/* Dismiss Button */}
              <button
                onClick={() => setShowTips(false)}
                className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0"
                style={{ color: 'hsl(var(--discord-text-muted))' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Slide Indicators */}
            <div className="flex items-center justify-center gap-1 mt-2">
              {roverTips.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTipIndex(index)}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: index === currentTipIndex 
                      ? 'hsl(var(--discord-text-normal))' 
                      : 'hsl(var(--discord-text-muted) / 0.3)'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickSwitcherDialog;
