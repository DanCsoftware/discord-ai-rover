import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, HelpCircle, Shield, ExternalLink, BookOpen } from 'lucide-react';
import { KnowledgeResult } from '@/utils/knowledgeEngine';

interface FactCheckResultsProps {
  result: KnowledgeResult;
  onSourceClick?: (url: string) => void;
}

export const FactCheckResults: React.FC<FactCheckResultsProps> = ({
  result,
  onSourceClick
}) => {
  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'true':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          label: 'TRUE'
        };
      case 'false':
        return {
          icon: <XCircle className="w-5 h-5" />,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          label: 'FALSE'
        };
      case 'partially_true':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          label: 'PARTIALLY TRUE'
        };
      case 'disputed':
        return {
          icon: <HelpCircle className="w-5 h-5" />,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          label: 'DISPUTED'
        };
      case 'unverified':
      default:
        return {
          icon: <HelpCircle className="w-5 h-5" />,
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30',
          label: 'UNVERIFIED'
        };
    }
  };

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const verdictConfig = result.factCheck ? getVerdictConfig(result.factCheck.verdict) : null;

  return (
    <div className="w-full space-y-4">
      {/* Main Answer */}
      <Card className="bg-discord-secondary border-discord-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-discord-text">
            <Shield className="w-5 h-5 text-discord-accent" />
            ROVER Knowledge Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm prose-invert max-w-none">
            <div className="text-discord-muted whitespace-pre-line">
              {result.answer}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fact Check Verdict */}
      {result.factCheck && verdictConfig && (
        <Card className={`${verdictConfig.bgColor} border-2 ${verdictConfig.borderColor}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${verdictConfig.color}`}>
              {verdictConfig.icon}
              Fact Check Verdict: {verdictConfig.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-discord-text mb-2">📝 Claim Analyzed:</h4>
              <p className="text-discord-muted italic">"{result.factCheck.claim}"</p>
            </div>

            <div>
              <h4 className="font-semibold text-discord-text mb-2">🔍 Evidence:</h4>
              <ul className="space-y-1">
                {result.factCheck.evidence.map((evidence, index) => (
                  <li key={index} className="flex items-start gap-2 text-discord-muted">
                    <span className="text-discord-accent mt-1">•</span>
                    {evidence}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sources */}
      {result.sources.length > 0 && (
        <Card className="bg-discord-secondary border-discord-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-discord-text">
              <BookOpen className="w-5 h-5 text-discord-accent" />
              Sources & References
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.sources.map((source, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-discord-dark border border-discord-border hover:border-discord-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-discord-text truncate">
                        {index + 1}. {source.title}
                      </h4>
                      <p className="text-sm text-discord-muted mt-1 line-clamp-2">
                        {source.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={`text-xs ${getReliabilityColor(source.reliability)}`}>
                          {source.reliability} reliability
                        </Badge>
                      </div>
                    </div>
                    
                    {onSourceClick && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSourceClick(source.url)}
                        className="shrink-0 text-discord-accent hover:text-discord-accent/80"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confidence & Related Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Confidence Score */}
        <Card className="bg-discord-secondary border-discord-border">
          <CardHeader>
            <CardTitle className="text-lg text-discord-text">🎯 Confidence Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getConfidenceColor(result.confidence)}`}>
                  {Math.round(result.confidence * 100)}%
                </div>
                <p className="text-sm text-discord-muted mt-1">
                  Confidence in accuracy
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Questions */}
        <Card className="bg-discord-secondary border-discord-border">
          <CardHeader>
            <CardTitle className="text-lg text-discord-text">💡 Related Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.relatedQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-2 px-3 text-sm text-discord-muted hover:text-discord-text hover:bg-discord-dark"
                >
                  <span className="text-discord-accent mr-2">•</span>
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};