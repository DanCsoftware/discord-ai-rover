import { servers, Server, discoverableServers, discoveryMetadata, userJoinedServerIds, serverDiscoveryData } from '@/data/discordData';
import { SearchResult } from './searchEngine';

export interface ServerRecommendation {
  server: Server | { id: number; name: string; icon: string; iconStyle?: any };
  matchScore: number;
  matchReasons: string[];
  category: string;
  memberActivity: 'low' | 'medium' | 'high' | 'very_high';
  communityVibe: string;
  primaryGames?: string[];
  specialFeatures?: string[];
  whyJoin?: string[];
}

export interface UserProfile {
  interests: string[];
  preferredGames: string[];
  activityLevel: 'casual' | 'regular' | 'hardcore';
  serverPreferences: {
    size: 'small' | 'medium' | 'large' | 'any';
    activityLevel: 'low' | 'medium' | 'high' | 'any';
    communityType: 'competitive' | 'casual' | 'creative' | 'social' | 'any';
  };
}

export class ServerDiscoveryEngine {
  private serverDatabase: Map<string, any> = new Map();
  private communityTags: Map<string, string[]> = new Map();

  constructor() {
    this.initializeServerDatabase();
    this.buildCommunityTags();
  }

  private initializeServerDatabase() {
    // Enhanced server data with discovery metadata
    servers.forEach(server => {
      const metadata = this.generateServerMetadata(server);
      this.serverDatabase.set(server.id.toString(), {
        ...server,
        ...metadata
      });
    });
  }

  private generateServerMetadata(server: Server): any {
    const name = server.name.toLowerCase();
    
    if (name.includes('gaming')) {
      return {
        category: 'Gaming',
        memberActivity: 'very_high',
        communityVibe: 'Competitive and friendly gaming community',
        primaryGames: ['Valorant', 'CS:GO', 'Rocket League', 'Apex Legends'],
        specialFeatures: ['LFG Channels', 'Tournament Hosting', 'Coaching'],
        tags: ['fps', 'competitive', 'esports', 'community'],
        size: 'large',
        activityScore: 95,
        friendliness: 90,
        organization: 85
      };
    } else if (name.includes('music')) {
      return {
        category: 'Music',
        memberActivity: 'high',
        communityVibe: 'Creative and collaborative music community',
        primaryGames: [],
        specialFeatures: ['Music Sharing', 'Collaboration Rooms', 'Live Sessions'],
        tags: ['music', 'creative', 'collaboration', 'chill'],
        size: 'medium',
        activityScore: 80,
        friendliness: 95,
        organization: 75
      };
    } else if (name.includes('midjourney')) {
      return {
        category: 'AI & Creative',
        memberActivity: 'high',
        communityVibe: 'Artistic and innovative AI community',
        primaryGames: [],
        specialFeatures: ['AI Art Generation', 'Prompt Sharing', 'Tutorials'],
        tags: ['ai', 'art', 'creative', 'innovative'],
        size: 'large',
        activityScore: 88,
        friendliness: 85,
        organization: 90
      };
    }

    return {
      category: 'General',
      memberActivity: 'medium',
      communityVibe: 'Friendly general community',
      primaryGames: [],
      specialFeatures: ['General Chat', 'Community Events'],
      tags: ['general', 'community', 'social'],
      size: 'medium',
      activityScore: 70,
      friendliness: 80,
      organization: 70
    };
  }

  private buildCommunityTags() {
    this.communityTags.set('competitive_gaming', ['fps', 'esports', 'ranked', 'tournaments', 'coaching']);
    this.communityTags.set('casual_gaming', ['chill', 'fun', 'variety', 'social', 'friendly']);
    this.communityTags.set('creative', ['art', 'music', 'design', 'collaboration', 'showcase']);
    this.communityTags.set('educational', ['learning', 'tutorials', 'guides', 'mentorship', 'discussion']);
    this.communityTags.set('social', ['chat', 'friends', 'community', 'events', 'hangout']);
  }

  findSimilarServers(currentServerId: string, criteria?: string): ServerRecommendation[] {
    const currentServer = this.serverDatabase.get(currentServerId);
    if (!currentServer) return [];

    const recommendations: ServerRecommendation[] = [];

    Array.from(this.serverDatabase.values()).forEach(server => {
      if (server.id.toString() === currentServerId) return;

      const matchScore = this.calculateServerSimilarity(currentServer, server, criteria);
      if (matchScore > 0.3) {
        recommendations.push({
          server,
          matchScore,
          matchReasons: this.getMatchReasons(currentServer, server),
          category: server.category,
          memberActivity: server.memberActivity,
          communityVibe: server.communityVibe,
          primaryGames: server.primaryGames,
          specialFeatures: server.specialFeatures
        });
      }
    });

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  recommendServersForUser(userProfile: UserProfile): ServerRecommendation[] {
    const recommendations: ServerRecommendation[] = [];

    Array.from(this.serverDatabase.values()).forEach(server => {
      const matchScore = this.calculateUserServerMatch(userProfile, server);
      if (matchScore > 0.4) {
        recommendations.push({
          server,
          matchScore,
          matchReasons: this.getUserMatchReasons(userProfile, server),
          category: server.category,
          memberActivity: server.memberActivity,
          communityVibe: server.communityVibe,
          primaryGames: server.primaryGames,
          specialFeatures: server.specialFeatures
        });
      }
    });

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  discoverServersByQuery(query: string): ServerRecommendation[] {
    const lowerQuery = query.toLowerCase();
    const recommendations: ServerRecommendation[] = [];

    Array.from(this.serverDatabase.values()).forEach(server => {
      const relevanceScore = this.calculateQueryRelevance(lowerQuery, server);
      if (relevanceScore > 0.2) {
        recommendations.push({
          server,
          matchScore: relevanceScore,
          matchReasons: this.getQueryMatchReasons(lowerQuery, server),
          category: server.category,
          memberActivity: server.memberActivity,
          communityVibe: server.communityVibe,
          primaryGames: server.primaryGames,
          specialFeatures: server.specialFeatures
        });
      }
    });

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  private calculateServerSimilarity(server1: any, server2: any, criteria?: string): number {
    let score = 0;

    // Category match
    if (server1.category === server2.category) score += 0.3;

    // Activity level match
    if (server1.memberActivity === server2.memberActivity) score += 0.2;

    // Tag overlap
    const tagOverlap = server1.tags.filter((tag: string) => server2.tags.includes(tag));
    score += (tagOverlap.length / Math.max(server1.tags.length, 1)) * 0.3;

    // Primary games overlap
    if (server1.primaryGames && server2.primaryGames) {
      const gameOverlap = server1.primaryGames.filter((game: string) => 
        server2.primaryGames.includes(game)
      );
      score += (gameOverlap.length / Math.max(server1.primaryGames.length, 1)) * 0.2;
    }

    // Criteria-specific matching
    if (criteria) {
      const criteriaScore = this.calculateCriteriaMatch(server2, criteria);
      score += criteriaScore * 0.3;
    }

    return Math.min(score, 1.0);
  }

  private calculateUserServerMatch(userProfile: UserProfile, server: any): number {
    let score = 0;

    // Interest matching
    const interestMatch = userProfile.interests.some(interest => 
      server.tags.includes(interest.toLowerCase()) ||
      server.category.toLowerCase().includes(interest.toLowerCase())
    );
    if (interestMatch) score += 0.3;

    // Game preferences
    if (userProfile.preferredGames.length > 0 && server.primaryGames) {
      const gameMatch = userProfile.preferredGames.some(game =>
        server.primaryGames.some((serverGame: string) => 
          serverGame.toLowerCase().includes(game.toLowerCase())
        )
      );
      if (gameMatch) score += 0.4;
    }

    // Activity level match
    if (userProfile.activityLevel === 'hardcore' && server.memberActivity === 'very_high') score += 0.2;
    if (userProfile.activityLevel === 'regular' && ['high', 'very_high'].includes(server.memberActivity)) score += 0.2;
    if (userProfile.activityLevel === 'casual' && ['medium', 'high'].includes(server.memberActivity)) score += 0.2;

    // Size preference
    if (userProfile.serverPreferences.size === 'any' || userProfile.serverPreferences.size === server.size) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  private calculateQueryRelevance(query: string, server: any): number {
    let score = 0;

    // Name matching
    if (server.name.toLowerCase().includes(query)) score += 0.4;

    // Category matching
    if (server.category.toLowerCase().includes(query)) score += 0.3;

    // Tag matching
    const tagMatch = server.tags.some((tag: string) => 
      tag.includes(query) || query.includes(tag)
    );
    if (tagMatch) score += 0.2;

    // Games matching
    if (server.primaryGames) {
      const gameMatch = server.primaryGames.some((game: string) =>
        game.toLowerCase().includes(query) || query.includes(game.toLowerCase())
      );
      if (gameMatch) score += 0.3;
    }

    // Description/vibe matching
    if (server.communityVibe.toLowerCase().includes(query)) score += 0.2;

    return Math.min(score, 1.0);
  }

  private calculateCriteriaMatch(server: any, criteria: string): number {
    const lowerCriteria = criteria.toLowerCase();
    let score = 0;

    if (lowerCriteria.includes('competitive') && server.tags.includes('competitive')) score += 0.5;
    if (lowerCriteria.includes('casual') && server.tags.includes('casual')) score += 0.5;
    if (lowerCriteria.includes('active') && ['high', 'very_high'].includes(server.memberActivity)) score += 0.3;
    if (lowerCriteria.includes('friendly') && server.friendliness > 80) score += 0.3;

    return Math.min(score, 1.0);
  }

  private getMatchReasons(server1: any, server2: any): string[] {
    const reasons: string[] = [];

    if (server1.category === server2.category) {
      reasons.push(`Same category: ${server1.category}`);
    }

    const tagOverlap = server1.tags.filter((tag: string) => server2.tags.includes(tag));
    if (tagOverlap.length > 0) {
      reasons.push(`Similar interests: ${tagOverlap.join(', ')}`);
    }

    if (server1.primaryGames && server2.primaryGames) {
      const gameOverlap = server1.primaryGames.filter((game: string) => 
        server2.primaryGames.includes(game)
      );
      if (gameOverlap.length > 0) {
        reasons.push(`Shared games: ${gameOverlap.join(', ')}`);
      }
    }

    if (server1.memberActivity === server2.memberActivity) {
      reasons.push(`Similar activity level: ${server1.memberActivity}`);
    }

    return reasons;
  }

  private getUserMatchReasons(userProfile: UserProfile, server: any): string[] {
    const reasons: string[] = [];

    const interestMatch = userProfile.interests.filter(interest => 
      server.tags.includes(interest.toLowerCase())
    );
    if (interestMatch.length > 0) {
      reasons.push(`Matches interests: ${interestMatch.join(', ')}`);
    }

    if (userProfile.preferredGames.length > 0 && server.primaryGames) {
      const gameMatch = userProfile.preferredGames.filter(game =>
        server.primaryGames.some((serverGame: string) => 
          serverGame.toLowerCase().includes(game.toLowerCase())
        )
      );
      if (gameMatch.length > 0) {
        reasons.push(`Preferred games: ${gameMatch.join(', ')}`);
      }
    }

    if (server.activityScore > 85) {
      reasons.push('High community activity');
    }

    if (server.friendliness > 85) {
      reasons.push('Very friendly community');
    }

    return reasons;
  }

  private getQueryMatchReasons(query: string, server: any): string[] {
    const reasons: string[] = [];

    if (server.name.toLowerCase().includes(query)) {
      reasons.push('Server name match');
    }

    if (server.category.toLowerCase().includes(query)) {
      reasons.push(`Category: ${server.category}`);
    }

    const tagMatch = server.tags.filter((tag: string) => 
      tag.includes(query) || query.includes(tag)
    );
    if (tagMatch.length > 0) {
      reasons.push(`Tags: ${tagMatch.join(', ')}`);
    }

    return reasons;
  }

  formatServerRecommendations(recommendations: ServerRecommendation[]): string {
    if (recommendations.length === 0) {
      return `🔍 **No perfect matches yet, but here are some great options!**\n\n🌟 **I recommend checking out:**\n• Gaming communities with active LFG channels\n• Servers with similar game focuses\n• Communities that match your activity level\n\n💡 **Pro tip:** Try asking me "recommend servers for competitive gaming" or "find casual gaming communities" for more specific results!`;
    }

    let response = `🎯 **Perfect! Found ${recommendations.length} servers you'll absolutely love:**\n\n`;

    recommendations.slice(0, 4).forEach((rec, index) => {
      const score = Math.round(rec.matchScore * 100);
      const activityEmoji = {
        'low': '📊',
        'medium': '📈',
        'high': '🔥',
        'very_high': '🚀'
      };

      response += `**${index + 1}. 🏆 ${rec.server.name}** (${score}% match)\n`;
      response += `   ${activityEmoji[rec.memberActivity]} **${rec.memberActivity.replace('_', ' ')} activity** • ${rec.category}\n`;
      response += `   💬 *"${rec.communityVibe}"*\n`;
      
      if (rec.primaryGames && rec.primaryGames.length > 0) {
        response += `   🎮 **Top Games:** ${rec.primaryGames.slice(0, 3).join(', ')}\n`;
      }
      
      if (rec.specialFeatures && rec.specialFeatures.length > 0) {
        response += `   ✨ **Special Features:** ${rec.specialFeatures.slice(0, 2).join(', ')}\n`;
      }
      
      response += `   🎯 **Why it's perfect:** ${rec.matchReasons.slice(0, 2).join(', ')}\n`;
      response += `   🔗 **Ready to join?** Look for invite links or ask for an invite!\n\n`;
    });

    if (recommendations.length > 4) {
      response += `*...plus ${recommendations.length - 4} more excellent matches!*\n\n`;
    }

    response += `🚀 **Next Steps:**\n`;
    response += `• Browse these servers and see which vibe appeals to you\n`;
    response += `• Check their member count and recent activity\n`;
    response += `• Read their rules and introduction channels\n`;
    response += `• Don't be shy - introduce yourself when you join!\n\n`;
    response += `💡 **Need more help?** Ask me to "find [specific game] servers" or "recommend [competitive/casual] communities"!`;

    return response;
  }

  // NEW: Get recommendations for discovery page (excludes joined servers)
  getDiscoveryRecommendations(query?: string): ServerRecommendation[] {
    const recommendations: ServerRecommendation[] = [];
    
    // Skill level keywords detection
    const detectSkillLevel = (q: string): 'beginner' | 'intermediate' | 'advanced' | null => {
      const lower = q.toLowerCase();
      if (lower.includes('beginner') || lower.includes('new') || lower.includes('newbie') || 
          lower.includes('learn') || lower.includes('first time') || lower.includes('starting out') ||
          lower.includes('never played')) {
        return 'beginner';
      }
      if (lower.includes('advanced') || lower.includes('veteran') || lower.includes('experienced') ||
          lower.includes('hardcore') || lower.includes('expert') || lower.includes('serious')) {
        return 'advanced';
      }
      if (lower.includes('intermediate') || lower.includes('some experience')) {
        return 'intermediate';
      }
      return null;
    };
    
    const requestedSkillLevel = query ? detectSkillLevel(query) : null;
    
    // Use discoverable servers (not joined by user)
    discoverableServers.forEach(server => {
      const meta = discoveryMetadata[server.id];
      if (!meta) return;
      
      let matchScore = 0.5; // Base score
      const matchReasons: string[] = [];
      
      if (query) {
        const lowerQuery = query.toLowerCase();
        
        // Skill level matching - significant boost
        if (requestedSkillLevel && meta.experienceLevel) {
          if (meta.experienceLevel === requestedSkillLevel) {
            matchScore += 0.35;
            if (requestedSkillLevel === 'beginner') {
              matchReasons.push('Perfect for first-time players!');
            } else if (requestedSkillLevel === 'advanced') {
              matchReasons.push('For experienced players seeking challenge');
            } else {
              matchReasons.push('Great for growing your skills');
            }
          } else if (meta.experienceLevel === 'all') {
            matchScore += 0.15;
            matchReasons.push('Welcomes all skill levels');
          }
        }
        
        // Check category match
        if (meta.category.toLowerCase().includes(lowerQuery)) {
          matchScore += 0.2;
          matchReasons.push(`Matches your interest in ${meta.category}`);
        }
        
        // Check tags
        const matchingTags = meta.tags.filter(tag => 
          tag.includes(lowerQuery) || lowerQuery.includes(tag)
        );
        if (matchingTags.length > 0) {
          matchScore += 0.15 * Math.min(matchingTags.length, 3);
          matchReasons.push(`Related to ${matchingTags.slice(0, 2).join(', ')}`);
        }
        
        // Check name
        if (server.name.toLowerCase().includes(lowerQuery)) {
          matchScore += 0.25;
          matchReasons.push('Direct match for your search');
        }
        
        // D&D/Tabletop specific
        if (lowerQuery.includes('d&d') || lowerQuery.includes('dnd') || lowerQuery.includes('dungeons')) {
          if (meta.tags.some(t => ['dnd', 'dungeons-dragons', 'ttrpg', 'tabletop'].includes(t))) {
            matchScore += 0.2;
            matchReasons.push('D&D community');
          }
        }
        
        // Activity keywords
        if (lowerQuery.includes('active') && ['high', 'very_high'].includes(meta.activityLevel)) {
          matchScore += 0.15;
          matchReasons.push('Very active community');
        }
        
        if (lowerQuery.includes('chill') && ['low', 'medium'].includes(meta.activityLevel)) {
          matchScore += 0.15;
          matchReasons.push('Relaxed community pace');
        }
        
        // Game-related
        if (lowerQuery.includes('gaming') || lowerQuery.includes('game')) {
          if (meta.category === 'Gaming' || meta.tags.includes('gamedev')) {
            matchScore += 0.2;
            matchReasons.push('Gaming-focused community');
          }
        }
        
        // Creative
        if (lowerQuery.includes('art') || lowerQuery.includes('creative')) {
          if (meta.category === 'Creative' || meta.tags.some(t => ['art', 'creative', 'photography'].includes(t))) {
            matchScore += 0.2;
            matchReasons.push('Creative community for artists');
          }
        }
        
        // Music
        if (lowerQuery.includes('music')) {
          if (meta.category === 'Music' || meta.tags.includes('lofi')) {
            matchScore += 0.2;
            matchReasons.push('Music-loving community');
          }
        }
        
        // Anime
        if (lowerQuery.includes('anime')) {
          if (meta.tags.includes('anime') || meta.tags.includes('manga')) {
            matchScore += 0.3;
            matchReasons.push('Perfect for anime fans');
          }
        }
        
        // Learning/Education
        if (lowerQuery.includes('learn') || lowerQuery.includes('education')) {
          if (meta.category === 'Education' || meta.tags.includes('learning')) {
            matchScore += 0.2;
            matchReasons.push('Great for learning and growth');
          }
        }
      } else {
        // No query - provide general reasons
        if (meta.activityLevel === 'very_high') {
          matchScore += 0.2;
          matchReasons.push('Very active community');
        }
        matchReasons.push(meta.communityVibe);
      }
      
      // Add some randomness for variety
      matchScore += Math.random() * 0.1;
      matchScore = Math.min(matchScore, 1.0);
      
      if (matchReasons.length === 0) {
        matchReasons.push(meta.communityVibe);
      }
      
      recommendations.push({
        server,
        matchScore,
        matchReasons,
        category: meta.category,
        memberActivity: meta.activityLevel,
        communityVibe: meta.communityVibe,
        specialFeatures: meta.specialFeatures,
        whyJoin: meta.whyJoin
      });
    });
    
    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  // Get all discoverable server IDs
  getDiscoverableServerIds(): number[] {
    return discoverableServers.map(s => s.id);
  }
}

export const serverDiscovery = new ServerDiscoveryEngine();