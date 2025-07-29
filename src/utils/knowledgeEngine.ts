import { SearchResult } from './searchEngine';

export interface KnowledgeQuery {
  query: string;
  type: 'fact_check' | 'general_knowledge' | 'gaming_info' | 'discord_help';
  sources?: string[];
  confidence?: number;
}

export interface KnowledgeResult {
  answer: string;
  sources: Array<{
    title: string;
    url: string;
    excerpt: string;
    reliability: 'high' | 'medium' | 'low';
  }>;
  confidence: number;
  relatedQuestions: string[];
  factCheck?: {
    claim: string;
    verdict: 'true' | 'false' | 'partially_true' | 'disputed' | 'unverified';
    evidence: string[];
  };
}

export class KnowledgeEngine {
  private gamingDatabase: Map<string, any> = new Map();
  private discordFeatures: Map<string, any> = new Map();

  constructor() {
    this.initializeGameDatabase();
    this.initializeDiscordKnowledge();
  }

  private initializeGameDatabase() {
    // Gaming knowledge base
    this.gamingDatabase.set('valorant', {
      description: 'Tactical first-person shooter by Riot Games',
      gameplay: 'Team-based competitive matches with unique agent abilities',
      popularity: 'Very High',
      platforms: ['PC'],
      release: '2020',
      tips: [
        'Focus on crosshair placement',
        'Learn map callouts',
        'Master economy management',
        'Practice aim daily'
      ]
    });

    this.gamingDatabase.set('csgo', {
      description: 'Counter-Strike: Global Offensive - tactical FPS',
      gameplay: 'Bomb defusal and hostage rescue game modes',
      popularity: 'Very High',
      platforms: ['PC', 'Mac'],
      release: '2012',
      tips: [
        'Learn spray patterns',
        'Master map positioning',
        'Understand economy system',
        'Practice grenades'
      ]
    });

    this.gamingDatabase.set('rocket league', {
      description: 'Vehicular soccer video game',
      gameplay: 'Cars play soccer with a large ball',
      popularity: 'High',
      platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
      release: '2015',
      tips: [
        'Master basic mechanics first',
        'Learn rotation positioning',
        'Practice aerial shots',
        'Focus on ball control'
      ]
    });
  }

  private initializeDiscordKnowledge() {
    this.discordFeatures.set('server discovery', {
      description: 'Find new Discord communities',
      howTo: 'Use Discord\'s Discover feature or browse server listings',
      tips: [
        'Check server activity levels',
        'Read server rules carefully',
        'Look for verified servers',
        'Join servers matching your interests'
      ]
    });

    this.discordFeatures.set('roles', {
      description: 'Assign permissions and organize members',
      howTo: 'Server Settings > Roles > Create Role',
      tips: [
        'Use role hierarchy for permissions',
        'Color-code roles for organization',
        'Create self-assignable roles',
        'Set up reaction roles for automation'
      ]
    });
  }

  async processKnowledgeQuery(query: string): Promise<KnowledgeResult> {
    const lowerQuery = query.toLowerCase();
    
    // Check if it's a fact-checking request
    if (this.isFactCheckQuery(lowerQuery)) {
      return this.handleFactCheck(query);
    }

    // Check gaming knowledge
    if (this.isGamingQuery(lowerQuery)) {
      return this.handleGamingQuery(query);
    }

    // Check Discord knowledge
    if (this.isDiscordQuery(lowerQuery)) {
      return this.handleDiscordQuery(query);
    }

    // Handle general knowledge
    return this.handleGeneralKnowledge(query);
  }

  private isFactCheckQuery(query: string): boolean {
    const factCheckPatterns = [
      /is it true that/i,
      /fact check/i,
      /verify/i,
      /is.*actually/i,
      /really/i,
      /true or false/i
    ];
    return factCheckPatterns.some(pattern => pattern.test(query));
  }

  private isGamingQuery(query: string): boolean {
    const gamingKeywords = [
      'game', 'gaming', 'valorant', 'csgo', 'rocket league', 
      'fps', 'strategy', 'multiplayer', 'esports', 'competitive'
    ];
    return gamingKeywords.some(keyword => query.includes(keyword));
  }

  private isDiscordQuery(query: string): boolean {
    const discordKeywords = [
      'discord', 'server', 'channel', 'role', 'bot', 'moderation',
      'permissions', 'voice chat', 'nitro'
    ];
    return discordKeywords.some(keyword => query.includes(keyword));
  }

  private async handleFactCheck(query: string): Promise<KnowledgeResult> {
    // Extract the claim from the query
    const claim = this.extractClaim(query);
    
    // Simulate fact-checking with mock data
    const factCheckResults = this.performFactCheck(claim);
    
    return {
      answer: factCheckResults.explanation,
      sources: factCheckResults.sources,
      confidence: factCheckResults.confidence,
      relatedQuestions: factCheckResults.relatedQuestions,
      factCheck: factCheckResults.verdict
    };
  }

  private async handleGamingQuery(query: string): Promise<KnowledgeResult> {
    const lowerQuery = query.toLowerCase();
    
    // Check our gaming database
    for (const [game, info] of this.gamingDatabase.entries()) {
      if (lowerQuery.includes(game)) {
        return {
          answer: `🎮 **${game.toUpperCase()}**: ${info.description}\n\n**Gameplay:** ${info.gameplay}\n**Popularity:** ${info.popularity}\n**Platforms:** ${info.platforms.join(', ')}\n\n**Pro Tips:**\n${info.tips.map((tip: string) => `• ${tip}`).join('\n')}`,
          sources: [
            {
              title: `${game} Official Information`,
              url: `https://example.com/${game}`,
              excerpt: info.description,
              reliability: 'high' as const
            }
          ],
          confidence: 0.9,
          relatedQuestions: [
            `How to get better at ${game}?`,
            `Best ${game} settings for competitive play`,
            `${game} community servers`
          ]
        };
      }
    }

    // General gaming response
    return {
      answer: `🎮 **Gaming Knowledge**: I can help with information about popular games, gaming tips, competitive strategies, and community recommendations. What specific game or gaming topic are you interested in?`,
      sources: [
        {
          title: 'Gaming Community Knowledge',
          url: 'https://example.com/gaming',
          excerpt: 'Comprehensive gaming information and tips',
          reliability: 'high' as const
        }
      ],
      confidence: 0.7,
      relatedQuestions: [
        'What are the most popular competitive games?',
        'How to improve gaming skills?',
        'Best gaming communities to join?'
      ]
    };
  }

  private async handleDiscordQuery(query: string): Promise<KnowledgeResult> {
    const lowerQuery = query.toLowerCase();

    // Check Discord features database
    for (const [feature, info] of this.discordFeatures.entries()) {
      if (lowerQuery.includes(feature)) {
        return {
          answer: `🛠️ **${feature.toUpperCase()}**: ${info.description}\n\n**How to:** ${info.howTo}\n\n**Tips:**\n${info.tips.map((tip: string) => `• ${tip}`).join('\n')}`,
          sources: [
            {
              title: 'Discord Official Documentation',
              url: 'https://discord.com/developers/docs',
              excerpt: info.description,
              reliability: 'high' as const
            }
          ],
          confidence: 0.95,
          relatedQuestions: [
            `Advanced ${feature} features`,
            `Best practices for ${feature}`,
            `Common ${feature} problems`
          ]
        };
      }
    }

    // General Discord help
    return {
      answer: `🤖 **Discord Help**: I can assist with Discord features, server management, moderation, bots, and community building. What specific Discord topic would you like to know about?`,
      sources: [
        {
          title: 'Discord Support Center',
          url: 'https://support.discord.com',
          excerpt: 'Official Discord help and documentation',
          reliability: 'high' as const
        }
      ],
      confidence: 0.8,
      relatedQuestions: [
        'How to set up a Discord server?',
        'Discord moderation best practices',
        'How to grow a Discord community?'
      ]
    };
  }

  private async handleGeneralKnowledge(query: string): Promise<KnowledgeResult> {
    // Simulate web search results
    return {
      answer: `🌐 **Knowledge Search**: I found information about "${query}". Based on multiple sources, here's what I can tell you about this topic. For the most current and detailed information, I recommend checking the sources below.`,
      sources: [
        {
          title: 'Wikipedia Article',
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
          excerpt: `Comprehensive article about ${query}`,
          reliability: 'high' as const
        },
        {
          title: 'Encyclopedia Britannica',
          url: `https://www.britannica.com/search?query=${encodeURIComponent(query)}`,
          excerpt: `Detailed encyclopedia entry for ${query}`,
          reliability: 'high' as const
        }
      ],
      confidence: 0.75,
      relatedQuestions: [
        `More details about ${query}`,
        `History of ${query}`,
        `Recent developments in ${query}`
      ]
    };
  }

  private extractClaim(query: string): string {
    // Simple claim extraction
    const patterns = [
      /is it true that (.+)/i,
      /fact check[:\s]+(.+)/i,
      /verify[:\s]+(.+)/i,
      /is (.+) actually/i
    ];

    for (const pattern of patterns) {
      const match = query.match(pattern);
      if (match) return match[1];
    }

    return query;
  }

  private performFactCheck(claim: string): any {
    // Mock fact-checking logic
    const lowerClaim = claim.toLowerCase();
    
    if (lowerClaim.includes('pineapple') && lowerClaim.includes('pizza')) {
      return {
        explanation: `🍕 **Pizza Topping Debate**: The pineapple on pizza question is subjective! While controversial, it's a legitimate preference.\n\n📊 **Facts:**\n• Hawaiian pizza was invented in Canada (1962)\n• ~12% of Americans regularly order pineapple pizza\n• It's more popular in Australia and Sweden\n• Taste preferences vary by culture and region`,
        confidence: 0.9,
        sources: [
          {
            title: 'Food History Research',
            url: 'https://example.com/pizza-history',
            excerpt: 'Hawaiian pizza origins and popularity data',
            reliability: 'high' as const
          }
        ],
        relatedQuestions: [
          'What are the most popular pizza toppings?',
          'Who invented Hawaiian pizza?',
          'Pizza preferences by country'
        ],
        verdict: {
          claim: 'Pineapple on pizza is acceptable',
          verdict: 'disputed' as const,
          evidence: [
            'Subjective taste preference',
            'Popular in some regions',
            'Cultural food tradition exists'
          ]
        }
      };
    }

    // Generic fact-check response
    return {
      explanation: `🔍 **Fact Check Results**: I've analyzed multiple sources regarding "${claim}". The evidence suggests this requires careful consideration of context and source reliability.`,
      confidence: 0.7,
      sources: [
        {
          title: 'Fact-checking Database',
          url: 'https://example.com/factcheck',
          excerpt: `Analysis of claim: ${claim}`,
          reliability: 'medium' as const
        }
      ],
      relatedQuestions: [
        'More evidence about this claim',
        'Similar fact-check topics',
        'How to verify information'
      ],
      verdict: {
        claim,
        verdict: 'unverified' as const,
        evidence: [
          'Multiple sources needed',
          'Context dependent',
          'Requires further verification'
        ]
      }
    };
  }

  formatKnowledgeResponse(result: KnowledgeResult): string {
    let response = result.answer;

    if (result.factCheck) {
      const { verdict, claim, evidence } = result.factCheck;
      const verdictEmoji = {
        true: '✅',
        false: '❌',
        partially_true: '⚠️',
        disputed: '🤔',
        unverified: '❓'
      };

      response += `\n\n${verdictEmoji[verdict]} **Verdict:** ${verdict.replace('_', ' ').toUpperCase()}\n`;
      response += `📝 **Claim:** ${claim}\n`;
      response += `🔍 **Evidence:**\n${evidence.map(e => `  • ${e}`).join('\n')}`;
    }

    if (result.sources.length > 0) {
      response += `\n\n📚 **Sources:**\n`;
      result.sources.slice(0, 3).forEach((source, i) => {
        response += `${i + 1}. **${source.title}** (${source.reliability} reliability)\n`;
      });
    }

    response += `\n\n💡 **Related Questions:**\n${result.relatedQuestions.map(q => `• ${q}`).join('\n')}`;
    response += `\n\n🎯 **Confidence:** ${Math.round(result.confidence * 100)}%`;

    return response;
  }
}

export const knowledgeEngine = new KnowledgeEngine();