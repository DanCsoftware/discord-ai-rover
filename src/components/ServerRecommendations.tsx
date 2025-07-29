import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Activity, Star, ArrowRight, Gamepad2, Hash } from 'lucide-react';
import { ServerRecommendation } from '@/utils/serverDiscovery';

interface ServerRecommendationsProps {
  recommendations: ServerRecommendation[];
  onJoinServer?: (serverId: string) => void;
  title?: string;
}

export const ServerRecommendations: React.FC<ServerRecommendationsProps> = ({
  recommendations,
  onJoinServer,
  title = "🌟 Recommended Servers"
}) => {
  if (recommendations.length === 0) {
    return (
      <Card className="w-full bg-discord-dark border-discord-border">
        <CardContent className="p-6 text-center">
          <div className="text-discord-muted mb-2">🔍</div>
          <h3 className="text-lg font-semibold text-discord-text mb-2">No Recommendations Found</h3>
          <p className="text-discord-muted">Try adjusting your search criteria or interests.</p>
        </CardContent>
      </Card>
    );
  }

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'very_high': return 'bg-green-500';
      case 'high': return 'bg-yellow-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'very_high': return '🚀';
      case 'high': return '🔥';
      case 'medium': return '📈';
      case 'low': return '📊';
      default: return '📊';
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-discord-accent" />
        <h2 className="text-xl font-bold text-discord-text">{title}</h2>
      </div>

      <div className="grid gap-4">
        {recommendations.slice(0, 6).map((rec, index) => (
          <Card key={rec.server.id} className="bg-discord-secondary border-discord-border hover:border-discord-accent transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-discord-text flex items-center gap-2">
                    <span className="text-xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}</span>
                    {rec.server.name}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {Math.round(rec.matchScore * 100)}% match
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-discord-muted">
                    <div className="flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      {rec.server.textChannels.length} channels
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {rec.server.voiceChannels.length} voice
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className={`w-4 h-4 ${getActivityColor(rec.memberActivity)}`} />
                      {getActivityIcon(rec.memberActivity)} {rec.memberActivity.replace('_', ' ')} activity
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {rec.category}
                  </Badge>
                  <p className="text-sm text-discord-muted leading-relaxed">
                    {rec.communityVibe}
                  </p>
                </div>

                {rec.primaryGames && rec.primaryGames.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Gamepad2 className="w-4 h-4 text-discord-accent" />
                      <span className="text-sm font-medium text-discord-text">Popular Games</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {rec.primaryGames.slice(0, 4).map((game, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {game}
                        </Badge>
                      ))}
                      {rec.primaryGames.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{rec.primaryGames.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {rec.specialFeatures && rec.specialFeatures.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-discord-text block mb-2">✨ Special Features</span>
                    <div className="flex flex-wrap gap-1">
                      {rec.specialFeatures.slice(0, 3).map((feature, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-discord-accent/10 border-discord-accent/30">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-sm font-medium text-discord-text block mb-2">🎯 Why you'll love it</span>
                  <ul className="text-sm text-discord-muted space-y-1">
                    {rec.matchReasons.slice(0, 3).map((reason, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-discord-accent mt-0.5">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {onJoinServer && (
                  <Button
                    onClick={() => onJoinServer(rec.server.id.toString())}
                    className="w-full mt-4 bg-discord-accent hover:bg-discord-accent/80 text-white"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Explore Server
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length > 6 && (
        <Card className="bg-discord-secondary/50 border-discord-border">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-discord-muted">
              And {recommendations.length - 6} more amazing communities waiting for you! 🚀
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};