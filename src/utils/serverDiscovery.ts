import { servers, Server } from '@/data/discordData';
import { SearchResult } from './searchEngine';

export interface ServerRecommendation {
  server: Server;
  matchScore: number;
  matchReasons: string[];
  category: string;
  memberActivity: 'low' | 'medium' | 'high' | 'very_high';
  communityVibe: string;
  primaryGames?: string[];
  specialFeatures?: string[];
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
      return "🔍 **No similar servers found** - but that makes this community unique! 🌟";
    }

    let response = `🌟 **Server Discovery Results** 🌟\n\n`;
    response += `**Found ${recommendations.length} amazing communities you'd love:**\n\n`;

    recommendations.slice(0, 5).forEach((rec, index) => {
      const score = Math.round(rec.matchScore * 100);
      const activityEmoji = {
        'low': '📊',
        'medium': '📈',
        'high': '🔥',
        'very_high': '🚀'
      };

      response += `**${index + 1}. ${rec.server.name}** (${score}% match)\n`;
      response += `├─ 🎯 ${rec.category} • ${activityEmoji[rec.memberActivity]} ${rec.memberActivity.replace('_', ' ')} activity\n`;
      response += `├─ 💭 ${rec.communityVibe}\n`;
      
      if (rec.primaryGames && rec.primaryGames.length > 0) {
        response += `├─ 🎮 Games: ${rec.primaryGames.slice(0, 3).join(', ')}\n`;
      }
      
      if (rec.specialFeatures && rec.specialFeatures.length > 0) {
        response += `├─ ✨ Features: ${rec.specialFeatures.slice(0, 2).join(', ')}\n`;
      }
      
      response += `└─ 🔍 Match: ${rec.matchReasons.slice(0, 2).join(', ')}\n\n`;
    });

    response += `🚀 **Want to explore?** These communities are welcoming new members!\n`;
    response += `💡 **Pro tip:** Check their rules and introduce yourself when you join!`;

    return response;
  }
}

export const serverDiscovery = new ServerDiscoveryEngine();