
import React from 'react';
import { useSafeT } from '@/hooks/useSafeT';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Calendar, Tag } from 'lucide-react';

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

interface DevLogTableProps {
  logs: DevLog[];
  onEdit: (log: DevLog) => void;
  onDelete: (id: string) => void;
}

const DevLogTable: React.FC<DevLogTableProps> = ({ logs, onEdit, onDelete }) => {
  const { t } = useSafeT();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const truncateText = (text: string | null, maxLength: number = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {t('devDashboard.table.noLogs', 'No development logs yet')}
        </h3>
        <p className="text-muted-foreground">
          {t('devDashboard.table.noLogsDescription', 'Start by creating your first development log entry.')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('devDashboard.table.date', 'Date')}</TableHead>
            <TableHead>{t('devDashboard.table.title', 'Title')}</TableHead>
            <TableHead>{t('devDashboard.table.content', 'Content')}</TableHead>
            <TableHead>{t('devDashboard.table.metrics', 'Metrics')}</TableHead>
            <TableHead>{t('devDashboard.table.actions', 'Actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">
                {formatDate(log.date)}
              </TableCell>
              <TableCell>
                <div className="font-medium">{log.title}</div>
                {log.next_steps && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {t('devDashboard.table.nextSteps', 'Next')}: {truncateText(log.next_steps, 50)}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  {truncateText(log.content)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {log.successes.length > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {log.successes.length} {t('devDashboard.table.successes', 'Successes')}
                    </Badge>
                  )}
                  {log.challenges.length > 0 && (
                    <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {log.challenges.length} {t('devDashboard.table.challenges', 'Challenges')}
                    </Badge>
                  )}
                  {log.solutions.length > 0 && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {log.solutions.length} {t('devDashboard.table.solutions', 'Solutions')}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(log)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (window.confirm(t('devDashboard.table.confirmDelete', 'Are you sure you want to delete this log?'))) {
                        onDelete(log.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DevLogTable;
