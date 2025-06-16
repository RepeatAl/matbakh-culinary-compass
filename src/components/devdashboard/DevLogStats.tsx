
import React from 'react';
import { useSafeT } from '@/hooks/useSafeT';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Calendar, Award, AlertTriangle } from 'lucide-react';

interface DevLog {
  id: string;
  date: string;
  title: string;
  content: string | null;
  successes: string[];
  challenges: string[];
  solutions: string[];
  next_steps: string | null;
  stakeholder_summary: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface DevLogStatsProps {
  logs: DevLog[];
}

const DevLogStats: React.FC<DevLogStatsProps> = ({ logs }) => {
  const { t } = useSafeT();

  const stats = React.useMemo(() => {
    const totalLogs = logs.length;
    const totalSuccesses = logs.reduce((sum, log) => sum + log.successes.length, 0);
    const totalChallenges = logs.reduce((sum, log) => sum + log.challenges.length, 0);
    const totalSolutions = logs.reduce((sum, log) => sum + log.solutions.length, 0);
    
    const last30Days = logs.filter(log => {
      const logDate = new Date(log.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return logDate >= thirtyDaysAgo;
    });

    const recentSuccesses = last30Days.reduce((sum, log) => sum + log.successes.length, 0);
    const recentChallenges = last30Days.reduce((sum, log) => sum + log.challenges.length, 0);
    
    const challengesSolved = logs.filter(log => 
      log.challenges.length > 0 && log.solutions.length > 0
    ).length;

    const solutionRate = totalChallenges > 0 ? (totalSolutions / totalChallenges * 100) : 0;

    // Most common success/challenge patterns
    const allSuccesses = logs.flatMap(log => log.successes);
    const allChallenges = logs.flatMap(log => log.challenges);
    
    return {
      totalLogs,
      totalSuccesses,
      totalChallenges,
      totalSolutions,
      recentSuccesses,
      recentChallenges,
      challengesSolved,
      solutionRate,
      last30DaysCount: last30Days.length,
      avgSuccessesPerLog: totalLogs > 0 ? (totalSuccesses / totalLogs).toFixed(1) : '0',
      avgChallengesPerLog: totalLogs > 0 ? (totalChallenges / totalLogs).toFixed(1) : '0',
    };
  }, [logs]);

  const recentLogs = logs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('devDashboard.stats.totalLogs', 'Total Logs')}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.last30DaysCount} {t('devDashboard.stats.last30Days', 'in last 30 days')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('devDashboard.stats.successes', 'Successes')}
            </CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalSuccesses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.avgSuccessesPerLog} {t('devDashboard.stats.avgPerLog', 'avg per log')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('devDashboard.stats.challenges', 'Challenges')}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.totalChallenges}</div>
            <p className="text-xs text-muted-foreground">
              {stats.avgChallengesPerLog} {t('devDashboard.stats.avgPerLog', 'avg per log')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('devDashboard.stats.solutionRate', 'Solution Rate')}
            </CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.solutionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalSolutions} {t('devDashboard.stats.totalSolutions', 'solutions documented')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('devDashboard.stats.recentActivity', 'Recent Activity')}
            </CardTitle>
            <CardDescription>
              {t('devDashboard.stats.recentActivityDescription', 'Latest development log entries')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentLogs.length > 0 ? (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="border-l-2 border-blue-200 pl-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{log.title}</div>
                      <Badge variant="outline" className="text-xs">
                        {new Date(log.date).toLocaleDateString('de-DE')}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-1">
                      {log.successes.length > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          {log.successes.length} ✓
                        </Badge>
                      )}
                      {log.challenges.length > 0 && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                          {log.challenges.length} ⚠
                        </Badge>
                      )}
                      {log.solutions.length > 0 && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          {log.solutions.length} 💡
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {t('devDashboard.stats.noRecentActivity', 'No recent activity')}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              {t('devDashboard.stats.insights', 'Insights')}
            </CardTitle>
            <CardDescription>
              {t('devDashboard.stats.insightsDescription', 'Key development insights')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('devDashboard.stats.productivityTrend', 'Productivity Trend')}</span>
                <div className="flex items-center gap-1">
                  {stats.recentSuccesses > stats.recentChallenges ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    {stats.recentSuccesses > stats.recentChallenges 
                      ? t('devDashboard.stats.positive', 'Positive')
                      : t('devDashboard.stats.needsAttention', 'Needs Attention')
                    }
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('devDashboard.stats.problemSolving', 'Problem Solving')}</span>
                <span className="text-sm font-medium">
                  {stats.challengesSolved} / {stats.totalLogs} {t('devDashboard.stats.logsWithSolutions', 'logs with solutions')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">{t('devDashboard.stats.consistency', 'Consistency')}</span>
                <span className="text-sm font-medium">
                  {stats.last30DaysCount > 15 
                    ? t('devDashboard.stats.excellent', 'Excellent')
                    : stats.last30DaysCount > 8
                    ? t('devDashboard.stats.good', 'Good')
                    : t('devDashboard.stats.needsImprovement', 'Needs Improvement')
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevLogStats;
