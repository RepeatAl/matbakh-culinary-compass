
import React from 'react';
import { useSafeT } from '@/hooks/useSafeT';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

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

interface DevLogExportProps {
  logs: DevLog[];
  expanded?: boolean;
}

const DevLogExport: React.FC<DevLogExportProps> = ({ logs, expanded = false }) => {
  const { t } = useSafeT();

  const exportToCSV = () => {
    const headers = [
      'Date',
      'Title',
      'Content',
      'Successes',
      'Challenges',
      'Solutions',
      'Next Steps',
      'Stakeholder Summary',
      'Created At',
      'Updated At'
    ];

    const csvData = logs.map(log => [
      log.date,
      log.title,
      log.content || '',
      log.successes.join('; '),
      log.challenges.join('; '),
      log.solutions.join('; '),
      log.next_steps || '',
      log.stakeholder_summary || '',
      new Date(log.created_at).toLocaleString('de-DE'),
      new Date(log.updated_at).toLocaleString('de-DE')
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dev-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    const jsonData = {
      exportDate: new Date().toISOString(),
      totalLogs: logs.length,
      logs: logs.map(log => ({
        ...log,
        exportNote: 'Exported from Matbakh Dev Dashboard'
      }))
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { 
      type: 'application/json;charset=utf-8;' 
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dev-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const generateReport = () => {
    const stats = {
      totalLogs: logs.length,
      totalSuccesses: logs.reduce((sum, log) => sum + log.successes.length, 0),
      totalChallenges: logs.reduce((sum, log) => sum + log.challenges.length, 0),
      totalSolutions: logs.reduce((sum, log) => sum + log.solutions.length, 0),
    };

    const reportContent = `
# Development Dashboard Report
Generated on: ${new Date().toLocaleDateString('de-DE')}

## Summary
- Total Logs: ${stats.totalLogs}
- Total Successes: ${stats.totalSuccesses}
- Total Challenges: ${stats.totalChallenges}
- Total Solutions: ${stats.totalSolutions}
- Solution Rate: ${stats.totalChallenges > 0 ? (stats.totalSolutions / stats.totalChallenges * 100).toFixed(1) : 0}%

## Detailed Logs

${logs.map(log => `
### ${log.date} - ${log.title}

**Content:**
${log.content || 'No content provided'}

**Successes (${log.successes.length}):**
${log.successes.map(s => `- ${s}`).join('\n')}

**Challenges (${log.challenges.length}):**
${log.challenges.map(c => `- ${c}`).join('\n')}

**Solutions (${log.solutions.length}):**
${log.solutions.map(s => `- ${s}`).join('\n')}

**Next Steps:**
${log.next_steps || 'None specified'}

**Stakeholder Summary:**
${log.stakeholder_summary || 'None provided'}

---
`).join('')}
    `;

    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dev-report-${new Date().toISOString().split('T')[0]}.md`;
    link.click();
  };

  if (expanded) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileSpreadsheet className="h-4 w-4" />
              CSV Export
            </CardTitle>
            <CardDescription className="text-xs">
              {t('devDashboard.export.csvDescription', 'Spreadsheet format for data analysis')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={exportToCSV} className="w-full" disabled={logs.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              {t('devDashboard.export.downloadCSV', 'Download CSV')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              JSON Export
            </CardTitle>
            <CardDescription className="text-xs">
              {t('devDashboard.export.jsonDescription', 'Structured data format for developers')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={exportToJSON} className="w-full" disabled={logs.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              {t('devDashboard.export.downloadJSON', 'Download JSON')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              Report
            </CardTitle>
            <CardDescription className="text-xs">
              {t('devDashboard.export.reportDescription', 'Formatted report for stakeholders')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={generateReport} className="w-full" disabled={logs.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              {t('devDashboard.export.downloadReport', 'Download Report')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Button onClick={exportToCSV} variant="outline" disabled={logs.length === 0}>
      <Download className="h-4 w-4 mr-2" />
      {t('devDashboard.export.export', 'Export')}
    </Button>
  );
};

export default DevLogExport;
