
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSafeT } from '@/hooks/useSafeT';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Download, FileText, BarChart3 } from 'lucide-react';
import DevLogForm from '@/components/devdashboard/DevLogForm';
import DevLogTable from '@/components/devdashboard/DevLogTable';
import DevLogStats from '@/components/devdashboard/DevLogStats';
import DevLogExport from '@/components/devdashboard/DevLogExport';

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

const DevDashboard = () => {
  const { t } = useSafeT();
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<DevLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState<DevLog | null>(null);

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dev_logs')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      console.error('Error fetching dev logs:', error);
      toast({
        title: t('devDashboard.error.fetchTitle', 'Error loading logs'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogSaved = () => {
    fetchLogs();
    setShowForm(false);
    setEditingLog(null);
    toast({
      title: t('devDashboard.success.saveTitle', 'Log saved'),
      description: t('devDashboard.success.saveDescription', 'Development log has been saved successfully.'),
    });
  };

  const handleEdit = (log: DevLog) => {
    setEditingLog(log);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dev_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchLogs();
      toast({
        title: t('devDashboard.success.deleteTitle', 'Log deleted'),
        description: t('devDashboard.success.deleteDescription', 'Development log has been deleted successfully.'),
      });
    } catch (error: any) {
      console.error('Error deleting log:', error);
      toast({
        title: t('devDashboard.error.deleteTitle', 'Error deleting log'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">
          {t('devDashboard.loading', 'Loading development logs...')}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {t('devDashboard.title', 'Development Dashboard')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('devDashboard.description', 'Track your development progress and insights')}
          </p>
        </div>
        <div className="flex gap-2">
          <DevLogExport logs={logs} />
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('devDashboard.addLog', 'Add Log')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('devDashboard.tabs.overview', 'Overview')}
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('devDashboard.tabs.logs', 'All Logs')}
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {t('devDashboard.tabs.export', 'Export')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DevLogStats logs={logs} />
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>{t('devDashboard.allLogs.title', 'Development Logs')}</CardTitle>
              <CardDescription>
                {t('devDashboard.allLogs.description', 'View and manage all your development logs')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DevLogTable 
                logs={logs} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>{t('devDashboard.export.title', 'Export Data')}</CardTitle>
              <CardDescription>
                {t('devDashboard.export.description', 'Export your development logs in various formats')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DevLogExport logs={logs} expanded />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showForm && (
        <DevLogForm
          log={editingLog}
          onSave={handleLogSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingLog(null);
          }}
        />
      )}
    </div>
  );
};

export default DevDashboard;
