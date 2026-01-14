import { useState, useCallback } from 'react';
import { Message, servers } from '@/data/discordData';

export interface Violation {
  ruleNumber: number;
  ruleName: string;
  evidence: string;
  messageExcerpt: string;
}

export interface FlaggedUser {
  username: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  violations: Violation[];
  lastActive: string;
  totalMessages: number;
}

export interface ModerationAnalysis {
  healthScore: number;
  flaggedUsers: FlaggedUser[];
  analyzedAt: string;
  messageCount: number;
}

interface ModerationActionResult {
  success: boolean;
  newHealthScore: number;
  message: string;
}

interface UseModerationAnalysisReturn {
  analysis: ModerationAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
  analyzeServer: () => Promise<void>;
  handleAction: (username: string, severity: string, action: 'ban' | 'timeout' | 'warn' | 'dismiss') => Promise<ModerationActionResult>;
  refreshAnalysis: () => Promise<void>;
}

// Health score adjustments based on action and severity
const SCORE_ADJUSTMENTS: Record<string, Record<string, number>> = {
  ban: { critical: 5, high: 3, medium: 1, low: 1 },
  timeout: { critical: 2, high: 1, medium: 0.5, low: 0.5 },
  warn: { critical: 1, high: 1, medium: 1, low: 1 },
  dismiss: { critical: -3, high: -2, medium: -1, low: -1 },
};

export const useModerationAnalysis = (serverId: number): UseModerationAnalysisReturn => {
  const [analysis, setAnalysis] = useState<ModerationAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // External Supabase project for ROVER
  const EXTERNAL_SUPABASE_URL = 'https://zmwtueuwvbqrvppbsmyl.supabase.co';
  const EXTERNAL_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptd3R1ZXV3dmJxcnZwcGJzbXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNzg0NTgsImV4cCI6MjA4Mzc1NDQ1OH0.k132RAxzhH1OLBd5RirZVo8GN9qJyTPhcLtWH93yRtw';

  const getServerData = useCallback(() => {
    const server = servers.find(s => s.id === serverId);
    if (!server) return { messages: [], rules: '' };

    // Get all messages from all channels
    const allMessages: Message[] = server.textChannels.flatMap(channel => channel.messages);
    
    // Find rules channel and extract rules
    const rulesChannel = server.textChannels.find(c => c.name.includes('rules'));
    const rulesMessage = rulesChannel?.messages.find(m => m.content.includes('RULES'));
    const rules = rulesMessage?.content || '';

    return { messages: allMessages, rules };
  }, [serverId]);

  const analyzeServer = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const { messages, rules } = getServerData();
      const server = servers.find(s => s.id === serverId);
      
      if (messages.length === 0) {
        throw new Error('No messages found in server');
      }

      const CHAT_URL = `${EXTERNAL_SUPABASE_URL}/functions/v1/discord-rover`;

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${EXTERNAL_ANON_KEY}`,
        },
        body: JSON.stringify({
          requestType: 'moderation_analysis',
          channelContext: {
            channelName: 'all-channels',
            serverName: server?.name || 'Unknown Server',
            serverId: serverId.toString(),
            messages: messages.slice(-100).map(msg => ({
              id: msg.id,
              user: msg.user,
              content: msg.content,
              time: msg.time,
            })),
            rules: rules,
          },
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        let errorMessage = errorData.error || 'Failed to analyze server';
        
        if (resp.status === 402) {
          errorMessage = 'AI credits exhausted. Please check your workspace credits.';
        } else if (resp.status === 429) {
          errorMessage = 'Rate limited. Please wait a moment and try again.';
        } else if (resp.status >= 500) {
          errorMessage = 'Server error. Please try again in a moment.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await resp.json();
      
      // Parse the response - expect structured JSON from tool calling
      const analysisResult: ModerationAnalysis = {
        healthScore: data.healthScore ?? 85,
        flaggedUsers: data.flaggedUsers ?? [],
        analyzedAt: new Date().toISOString(),
        messageCount: messages.length,
      };

      setAnalysis(analysisResult);
    } catch (e) {
      console.error('Moderation analysis error:', e);
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  }, [serverId, getServerData]);

  const handleAction = useCallback(async (
    username: string, 
    severity: string, 
    action: 'ban' | 'timeout' | 'warn' | 'dismiss'
  ): Promise<ModerationActionResult> => {
    if (!analysis) {
      return { success: false, newHealthScore: 0, message: 'No analysis available' };
    }

    try {
      const server = servers.find(s => s.id === serverId);
      const CHAT_URL = `${EXTERNAL_SUPABASE_URL}/functions/v1/discord-rover`;

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${EXTERNAL_ANON_KEY}`,
        },
        body: JSON.stringify({
          requestType: 'moderation_action',
          actionDetails: {
            username,
            severity,
            action,
            currentHealthScore: analysis.healthScore,
          },
          channelContext: {
            serverName: server?.name || 'Unknown Server',
            serverId: serverId.toString(),
          },
        }),
      });

      if (!resp.ok) {
        throw new Error('Failed to process moderation action');
      }

      const data = await resp.json();
      
      // Calculate new health score locally as fallback
      const adjustment = SCORE_ADJUSTMENTS[action]?.[severity] ?? 0;
      const newHealthScore = Math.min(100, Math.max(0, (data.newHealthScore ?? analysis.healthScore + adjustment)));

      // Update analysis state
      setAnalysis(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          healthScore: newHealthScore,
          flaggedUsers: action === 'dismiss' 
            ? prev.flaggedUsers // Keep user but they're "dismissed"
            : prev.flaggedUsers.filter(u => u.username !== username),
        };
      });

      return {
        success: true,
        newHealthScore,
        message: data.message || `Successfully ${action}ed ${username}`,
      };
    } catch (e) {
      console.error('Moderation action error:', e);
      
      // Calculate score change locally on error
      const adjustment = SCORE_ADJUSTMENTS[action]?.[severity] ?? 0;
      const newHealthScore = Math.min(100, Math.max(0, analysis.healthScore + adjustment));

      // Still update UI optimistically
      setAnalysis(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          healthScore: newHealthScore,
          flaggedUsers: action === 'dismiss' 
            ? prev.flaggedUsers
            : prev.flaggedUsers.filter(u => u.username !== username),
        };
      });

      return {
        success: true, // Optimistic update
        newHealthScore,
        message: `${action.charAt(0).toUpperCase() + action.slice(1)} action applied to ${username}`,
      };
    }
  }, [analysis, serverId]);

  const refreshAnalysis = useCallback(async () => {
    await analyzeServer();
  }, [analyzeServer]);

  return {
    analysis,
    isAnalyzing,
    error,
    analyzeServer,
    handleAction,
    refreshAnalysis,
  };
};
