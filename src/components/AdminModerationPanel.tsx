import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Ban, 
  Clock, 
  MessageSquare, 
  TrendingUp,
  Users,
  Activity,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useRoverChat } from '@/hooks/useRoverChat';
import { Message } from '@/data/discordData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FlaggedUser {
  id: string;
  username: string;
  avatar: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  violations: string[];
  lastActive: string;
  messageCount: number;
}

interface AdminModerationPanelProps {
  serverName: string;
  serverId: number;
  messages: Message[];
}

const mockFlaggedUsers: FlaggedUser[] = [
  {
    id: '1',
    username: 'SpamBot2024',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    riskLevel: 'critical',
    violations: ['Spam messages (12 in 1hr)', 'Suspicious links', 'New account'],
    lastActive: '2 min ago',
    messageCount: 47
  },
  {
    id: '2',
    username: 'CryptoScammer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    riskLevel: 'high',
    violations: ['Promotional content', 'DM solicitation reports'],
    lastActive: '15 min ago',
    messageCount: 23
  },
  {
    id: '3',
    username: 'ToxicGamer99',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face',
    riskLevel: 'medium',
    violations: ['Mild harassment', 'Excessive caps'],
    lastActive: '1 hr ago',
    messageCount: 156
  }
];

const AdminModerationPanel = ({ serverName, serverId, messages }: AdminModerationPanelProps) => {
  const [healthScore, setHealthScore] = useState(87);
  const [flaggedUsers, setFlaggedUsers] = useState<FlaggedUser[]>(mockFlaggedUsers);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [roverResponse, setRoverResponse] = useState('');
  
  const { streamingResponse, isStreaming, sendMessage } = useRoverChat();

  // Update rover response when streaming completes
  useEffect(() => {
    if (!isStreaming && streamingResponse) {
      setRoverResponse(streamingResponse);
    }
  }, [isStreaming, streamingResponse]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return 'hsl(var(--discord-text-muted))';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle2 className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleQuickAction = async (action: string) => {
    const context = {
      channelName: 'moderation',
      serverName,
      messages: messages.slice(-50)
    };

    let prompt = '';
    switch (action) {
      case 'tos':
        prompt = 'Analyze the recent messages and identify any users who may have violated Terms of Service or community guidelines. Provide a summary with usernames, violations, and recommended actions.';
        break;
      case 'health':
        prompt = 'Analyze the channel health based on recent messages. Provide metrics on sentiment, engagement quality, potential issues, and recommendations for improvement.';
        break;
      case 'report':
        prompt = 'Generate a brief moderation report for the last 24 hours. Include active users, flagged content, resolved issues, and areas needing attention.';
        break;
      default:
        return;
    }

    try {
      await sendMessage(prompt, context);
    } catch (e) {
      console.error('Moderation query error:', e);
    }
  };

  const handleCustomQuery = async () => {
    if (!query.trim()) return;

    const context = {
      channelName: 'moderation',
      serverName,
      messages: messages.slice(-50)
    };

    try {
      await sendMessage(`As a server moderator, I need help with: ${query}`, context);
      setQuery('');
    } catch (e) {
      console.error('Moderation query error:', e);
    }
  };

  const handleUserAction = (userId: string, action: 'ban' | 'timeout' | 'warn') => {
    // Simulate action - in real app would call API
    console.log(`Action ${action} on user ${userId}`);
    
    // Remove user from list after action
    if (action === 'ban') {
      setFlaggedUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ backgroundColor: 'hsl(var(--discord-bg-secondary))' }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 flex items-center gap-3"
        style={{ borderBottom: '1px solid hsl(var(--discord-bg-quaternary))' }}
      >
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#2b2d31' }}
        >
          <img 
            src="/lovable-uploads/discord-new-logo-2.webp" 
            alt="ROVER Moderation"
            className="w-8 h-8 object-contain"
            style={{ filter: 'sepia(1) saturate(5) hue-rotate(-5deg) brightness(0.95)' }}
          />
        </div>
        <div>
          <h2 className="font-bold text-sm" style={{ color: 'hsl(var(--discord-text-normal))' }}>
            ROVER Moderation
          </h2>
          <p className="text-xs" style={{ color: 'hsl(var(--discord-text-muted))' }}>
            {serverName} • Admin Tools
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Server Health Score */}
          <div 
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'hsl(var(--discord-bg-tertiary))' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" style={{ color: 'hsl(var(--discord-green))' }} />
                <span className="text-sm font-medium" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                  Server Health Score
                </span>
              </div>
              <span className="text-2xl font-bold" style={{ color: 'hsl(var(--discord-green))' }}>
                {healthScore}/100
              </span>
            </div>
            <div 
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'hsl(var(--discord-bg-quaternary))' }}
            >
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${healthScore}%`,
                  background: healthScore > 70 
                    ? 'linear-gradient(90deg, #22c55e 0%, #57f287 100%)'
                    : healthScore > 40 
                    ? 'linear-gradient(90deg, #eab308 0%, #facc15 100%)'
                    : 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)'
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'hsl(var(--discord-text-muted))' }}>
              <span>Based on recent activity</span>
              <span>Updated 5m ago</span>
            </div>
          </div>

          {/* Flagged Users */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                <AlertTriangle className="w-4 h-4" style={{ color: '#f97316' }} />
                Users Requiring Attention
              </h3>
              <span 
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: 'rgba(249, 115, 22, 0.2)',
                  color: '#f97316'
                }}
              >
                {flaggedUsers.length}
              </span>
            </div>

            <div className="space-y-2">
              {flaggedUsers.map(user => (
                <div 
                  key={user.id}
                  className="rounded-lg overflow-hidden"
                  style={{ backgroundColor: 'hsl(var(--discord-bg-tertiary))' }}
                >
                  {/* User Header */}
                  <div 
                    className="p-3 cursor-pointer"
                    onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar} 
                        alt={user.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                            {user.username}
                          </span>
                          <span 
                            className="px-2 py-0.5 rounded text-xs font-medium uppercase flex items-center gap-1"
                            style={{ 
                              backgroundColor: `${getRiskColor(user.riskLevel)}20`,
                              color: getRiskColor(user.riskLevel)
                            }}
                          >
                            {getRiskIcon(user.riskLevel)}
                            {user.riskLevel}
                          </span>
                        </div>
                        <p className="text-xs truncate" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                          {user.violations[0]}
                        </p>
                      </div>
                      {expandedUser === user.id ? (
                        <ChevronUp className="w-4 h-4" style={{ color: 'hsl(var(--discord-text-muted))' }} />
                      ) : (
                        <ChevronDown className="w-4 h-4" style={{ color: 'hsl(var(--discord-text-muted))' }} />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedUser === user.id && (
                    <div 
                      className="px-3 pb-3"
                      style={{ borderTop: '1px solid hsl(var(--discord-bg-quaternary))' }}
                    >
                      <div className="pt-3">
                        <p className="text-xs font-medium mb-2" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                          Violations:
                        </p>
                        <ul className="space-y-1 mb-3">
                          {user.violations.map((v, i) => (
                            <li 
                              key={i}
                              className="text-xs flex items-center gap-2"
                              style={{ color: 'hsl(var(--discord-text-normal))' }}
                            >
                              <span style={{ color: getRiskColor(user.riskLevel) }}>•</span>
                              {v}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex items-center gap-2 text-xs mb-3" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                          <span>Last active: {user.lastActive}</span>
                          <span>•</span>
                          <span>{user.messageCount} messages</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleUserAction(user.id, 'ban')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                            style={{ 
                              backgroundColor: 'rgba(239, 68, 68, 0.2)',
                              color: '#ef4444'
                            }}
                          >
                            <Ban className="w-3 h-3" />
                            Ban
                          </button>
                          <button 
                            onClick={() => handleUserAction(user.id, 'timeout')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                            style={{ 
                              backgroundColor: 'rgba(234, 179, 8, 0.2)',
                              color: '#eab308'
                            }}
                          >
                            <Clock className="w-3 h-3" />
                            Timeout
                          </button>
                          <button 
                            onClick={() => handleUserAction(user.id, 'warn')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                            style={{ 
                              backgroundColor: 'hsl(var(--discord-bg-quaternary))',
                              color: 'hsl(var(--discord-text-normal))'
                            }}
                          >
                            <MessageSquare className="w-3 h-3" />
                            Warn
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {flaggedUsers.length === 0 && (
                <div 
                  className="text-center py-6 rounded-lg"
                  style={{ backgroundColor: 'hsl(var(--discord-bg-tertiary))' }}
                >
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: 'hsl(var(--discord-green))' }} />
                  <p className="text-sm" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                    All clear! No users need attention.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: 'hsl(var(--discord-text-normal))' }}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => handleQuickAction('tos')}
                disabled={isStreaming}
                className="p-3 rounded-lg text-left transition-all hover:scale-[1.02]"
                style={{ backgroundColor: 'hsl(var(--discord-bg-tertiary))' }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                  >
                    <AlertTriangle className="w-4 h-4" style={{ color: '#ef4444' }} />
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                      Get TOS Violations Summary
                    </div>
                    <div className="text-xs" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                      Analyze recent messages for rule violations
                    </div>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => handleQuickAction('health')}
                disabled={isStreaming}
                className="p-3 rounded-lg text-left transition-all hover:scale-[1.02]"
                style={{ backgroundColor: 'hsl(var(--discord-bg-tertiary))' }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
                  >
                    <TrendingUp className="w-4 h-4" style={{ color: '#22c55e' }} />
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                      Analyze Channel Health
                    </div>
                    <div className="text-xs" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                      Get sentiment and engagement metrics
                    </div>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => handleQuickAction('report')}
                disabled={isStreaming}
                className="p-3 rounded-lg text-left transition-all hover:scale-[1.02]"
                style={{ backgroundColor: 'hsl(var(--discord-bg-tertiary))' }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(88, 101, 242, 0.2)' }}
                  >
                    <Users className="w-4 h-4" style={{ color: '#5865f2' }} />
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                      Generate Weekly Report
                    </div>
                    <div className="text-xs" style={{ color: 'hsl(var(--discord-text-muted))' }}>
                      Summary of moderation activity
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* ROVER Response */}
          {(isStreaming || roverResponse) && (
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'hsl(var(--discord-bg-tertiary))' }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: '#2b2d31' }}
                >
                  <img 
                    src="/lovable-uploads/discord-new-logo-2.webp" 
                    alt="ROVER"
                    className="w-6 h-6 object-contain"
                    style={{ filter: 'sepia(1) saturate(5) hue-rotate(-5deg) brightness(0.95)' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm" style={{ color: 'hsl(var(--discord-text-normal))' }}>
                      ROVER
                    </span>
                    {isStreaming && (
                      <Loader2 className="w-3 h-3 animate-spin" style={{ color: 'hsl(var(--discord-text-muted))' }} />
                    )}
                  </div>
                  <p 
                    className="text-sm whitespace-pre-wrap"
                    style={{ color: 'hsl(var(--discord-text-normal))' }}
                  >
                    {isStreaming ? streamingResponse || 'Analyzing...' : roverResponse}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ask ROVER */}
          <div>
            <h3 className="text-sm font-bold mb-2" style={{ color: 'hsl(var(--discord-text-normal))' }}>
              Ask ROVER
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about moderation..."
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                style={{ 
                  backgroundColor: 'hsl(var(--discord-bg-tertiary))',
                  color: 'hsl(var(--discord-text-normal))'
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomQuery()}
              />
              <button 
                onClick={handleCustomQuery}
                disabled={isStreaming || !query.trim()}
                className="px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'hsl(var(--discord-brand))' }}
              >
                {isStreaming ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AdminModerationPanel;
