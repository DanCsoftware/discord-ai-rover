import { useState, useCallback } from 'react';
import { discoverableServers, serverDiscoveryData, discoveryMetadata, ServerDiscoveryMeta, DiscoveryServerMeta } from '@/data/discordData';

// External Supabase connection for ROVER (same as useRoverChat)
const DISCOVERY_URL = 'https://zmwtueuwvbqrvppbsmyl.supabase.co/functions/v1/discord-rover';
const EXTERNAL_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptd3R1ZXV3dmJxcnZwcGJzbXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNzg0NTgsImV4cCI6MjA4Mzc1NDQ1OH0.k132RAxzhH1OLBd5RirZVo8GN9qJyTPhcLtWH93yRtw';

export interface ServerMatch {
  serverId: number;
  matchScore: number; // 0-100
  matchReasons: string[];
}

export interface ServerRecommendation {
  server: {
    id: number;
    name: string;
    icon: string;
    iconStyle?: any;
  };
  discoveryMeta: ServerDiscoveryMeta;
  extendedMeta?: DiscoveryServerMeta;
  matchScore: number;
  matchReasons: string[];
}

interface UseServerDiscoveryReturn {
  recommendations: ServerRecommendation[];
  isLoading: boolean;
  error: string | null;
  discoverServers: (query: string) => Promise<void>;
}

// Local fallback scoring when AI is unavailable
function calculateLocalScore(query: string, server: any, extendedMeta: any, discoveryMeta: any): ServerMatch {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  let score = 0;
  const reasons: string[] = [];
  
  // Normalize query terms for D&D variations
  const normalizedQuery = queryLower
    .replace(/dungeons?\s*(and|&)?\s*dragons?/gi, 'dnd ttrpg tabletop rpg')
    .replace(/d\s*&\s*d/gi, 'dnd ttrpg')
    .replace(/beginner/gi, 'beginner newbie new')
    .replace(/advanced/gi, 'advanced experienced veteran');
  
  const normalizedWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
  
  // Check server name match
  const nameLower = server.name.toLowerCase();
  const nameMatches = normalizedWords.filter(w => nameLower.includes(w));
  if (nameMatches.length > 0) {
    score += 35;
    reasons.push(`Matches your search: "${server.name}"`);
  }
  
  // Check tags match (most important for relevance)
  const tags = (extendedMeta?.tags || []).map((t: string) => t.toLowerCase());
  const tagMatches = normalizedWords.filter(w => 
    tags.some((tag: string) => tag.includes(w) || w.includes(tag))
  );
  
  if (tagMatches.length > 0) {
    score += Math.min(40, tagMatches.length * 15);
    reasons.push(`Has relevant tags: ${tags.slice(0, 3).join(', ')}`);
  }
  
  // Check category match
  const category = (extendedMeta?.category || '').toLowerCase();
  if (normalizedWords.some(w => category.includes(w))) {
    score += 15;
    reasons.push(`In ${extendedMeta?.category} category`);
  }
  
  // Check description match
  const description = (discoveryMeta?.description || '').toLowerCase();
  const descMatches = normalizedWords.filter(w => description.includes(w));
  if (descMatches.length > 0) {
    score += Math.min(20, descMatches.length * 5);
  }
  
  // Experience level matching
  const expLevel = extendedMeta?.experienceLevel || 'all';
  if (queryLower.includes('beginner') || queryLower.includes('new') || queryLower.includes('newbie')) {
    if (expLevel === 'beginner' || expLevel === 'all') {
      score += 15;
      reasons.push('Perfect for beginners!');
    } else {
      score -= 20; // Penalize advanced servers for beginner queries
    }
  } else if (queryLower.includes('advanced') || queryLower.includes('experienced') || queryLower.includes('veteran')) {
    if (expLevel === 'advanced') {
      score += 15;
      reasons.push('For experienced players');
    } else if (expLevel === 'beginner') {
      score -= 20; // Penalize beginner servers for advanced queries
    }
  }
  
  // Activity bonus
  if (extendedMeta?.activityLevel === 'very_high') {
    score += 5;
    reasons.push('Very active community');
  } else if (extendedMeta?.activityLevel === 'high') {
    score += 3;
    reasons.push('Active community');
  }
  
  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));
  
  // Add generic reason if none found
  if (reasons.length === 0 && score > 20) {
    reasons.push('Related community');
  }
  
  return {
    serverId: server.id,
    matchScore: score,
    matchReasons: reasons.slice(0, 3),
  };
}

export function useServerDiscovery(): UseServerDiscoveryReturn {
  const [recommendations, setRecommendations] = useState<ServerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discoverServers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setRecommendations([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    // Prepare server data
    const serversForAnalysis = discoverableServers.map(server => {
      const discoveryMeta = serverDiscoveryData[server.id];
      const extendedMeta = discoveryMetadata[server.id];
      
      return {
        id: server.id,
        name: server.name,
        description: discoveryMeta?.description || '',
        memberCount: discoveryMeta?.memberCount || 0,
        tags: extendedMeta?.tags || [],
        category: extendedMeta?.category || '',
        experienceLevel: extendedMeta?.experienceLevel || 'all',
        activityLevel: extendedMeta?.activityLevel || 'medium',
      };
    });

    let matches: ServerMatch[] = [];
    let usedAI = false;

    try {
      // Try AI-powered discovery first
      const response = await fetch(DISCOVERY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${EXTERNAL_ANON_KEY}`,
        },
        body: JSON.stringify({
          requestType: 'server_discovery',
          channelContext: {
            query,
            servers: serversForAnalysis,
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('Rate limited, using local scoring');
        } else if (response.status === 402) {
          console.warn('Credits exhausted, using local scoring');
        } else {
          console.warn('Discovery API error:', response.status);
        }
        throw new Error('API unavailable');
      }

      const result = await response.json();
      
      // Check if we got valid matches from AI
      if (result.matches && Array.isArray(result.matches) && result.matches.length > 0) {
        matches = result.matches;
        usedAI = true;
        console.log('✅ Using AI-powered discovery results');
      } else {
        throw new Error('No matches from AI');
      }
    } catch (err) {
      // Fallback to local scoring
      console.log('📊 Using local keyword-based scoring');
      
      matches = discoverableServers.map(server => {
        const discoveryMeta = serverDiscoveryData[server.id];
        const extendedMeta = discoveryMetadata[server.id];
        return calculateLocalScore(query, server, extendedMeta, discoveryMeta);
      });
    }

    // Sort by score descending and filter low scores
    const sortedMatches = matches
      .filter(m => m.matchScore >= 25) // Minimum 25% to show
      .sort((a, b) => b.matchScore - a.matchScore);

    // Build full recommendations with server data
    const recs: ServerRecommendation[] = sortedMatches.map(match => {
      const server = discoverableServers.find(s => s.id === match.serverId);
      const discoveryMeta = serverDiscoveryData[match.serverId];
      const extendedMeta = discoveryMetadata[match.serverId];

      if (!server || !discoveryMeta) return null;

      return {
        server: {
          id: server.id,
          name: server.name,
          icon: server.icon,
          iconStyle: server.iconStyle,
        },
        discoveryMeta,
        extendedMeta,
        matchScore: match.matchScore / 100, // Convert to 0-1 for component
        matchReasons: match.matchReasons || [],
      };
    }).filter(Boolean) as ServerRecommendation[];

    setRecommendations(recs);
    setIsLoading(false);
  }, []);

  return {
    recommendations,
    isLoading,
    error,
    discoverServers,
  };
}
