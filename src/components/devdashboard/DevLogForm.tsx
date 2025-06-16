
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSafeT } from '@/hooks/useSafeT';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

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
}

interface DevLogFormProps {
  log?: DevLog | null;
  onSave: () => void;
  onCancel: () => void;
}

const DevLogForm: React.FC<DevLogFormProps> = ({ log, onSave, onCancel }) => {
  const { t } = useSafeT();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    date: log?.date || new Date().toISOString().split('T')[0],
    title: log?.title || '',
    content: log?.content || '',
    successes: log?.successes || [],
    challenges: log?.challenges || [],
    solutions: log?.solutions || [],
    next_steps: log?.next_steps || '',
    stakeholder_summary: log?.stakeholder_summary || '',
  });

  const [loading, setLoading] = useState(false);
  const [newSuccess, setNewSuccess] = useState('');
  const [newChallenge, setNewChallenge] = useState('');
  const [newSolution, setNewSolution] = useState('');

  const addArrayItem = (field: 'successes' | 'challenges' | 'solutions', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      
      if (field === 'successes') setNewSuccess('');
      if (field === 'challenges') setNewChallenge('');
      if (field === 'solutions') setNewSolution('');
    }
  };

  const removeArrayItem = (field: 'successes' | 'challenges' | 'solutions', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      const logData = {
        ...formData,
        user_id: user.id,
      };

      let result;
      if (log?.id) {
        result = await supabase
          .from('dev_logs')
          .update(logData)
          .eq('id', log.id);
      } else {
        result = await supabase
          .from('dev_logs')
          .insert([logData]);
      }

      if (result.error) throw result.error;
      onSave();
    } catch (error: any) {
      console.error('Error saving log:', error);
      toast({
        title: t('devDashboard.error.saveTitle', 'Error saving log'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>
            {log?.id 
              ? t('devDashboard.form.editTitle', 'Edit Development Log')
              : t('devDashboard.form.createTitle', 'Create Development Log')
            }
          </CardTitle>
          <CardDescription>
            {t('devDashboard.form.description', 'Document your development progress and insights')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">{t('devDashboard.form.date', 'Date')}</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="title">{t('devDashboard.form.title', 'Title')}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t('devDashboard.form.titlePlaceholder', 'Enter a descriptive title')}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="content">{t('devDashboard.form.content', 'Content')}</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder={t('devDashboard.form.contentPlaceholder', 'Describe your development activities and insights...')}
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Successes */}
              <div>
                <Label>{t('devDashboard.form.successes', 'Successes')}</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newSuccess}
                    onChange={(e) => setNewSuccess(e.target.value)}
                    placeholder={t('devDashboard.form.successPlaceholder', 'Add success...')}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('successes', newSuccess))}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addArrayItem('successes', newSuccess)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.successes.map((success, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      {success}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('successes', index)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Challenges */}
              <div>
                <Label>{t('devDashboard.form.challenges', 'Challenges')}</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newChallenge}
                    onChange={(e) => setNewChallenge(e.target.value)}
                    placeholder={t('devDashboard.form.challengePlaceholder', 'Add challenge...')}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('challenges', newChallenge))}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addArrayItem('challenges', newChallenge)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.challenges.map((challenge, index) => (
                    <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                      {challenge}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('challenges', index)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Solutions */}
              <div>
                <Label>{t('devDashboard.form.solutions', 'Solutions')}</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newSolution}
                    onChange={(e) => setNewSolution(e.target.value)}
                    placeholder={t('devDashboard.form.solutionPlaceholder', 'Add solution...')}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('solutions', newSolution))}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addArrayItem('solutions', newSolution)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.solutions.map((solution, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {solution}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('solutions', index)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="next_steps">{t('devDashboard.form.nextSteps', 'Next Steps')}</Label>
              <Textarea
                id="next_steps"
                value={formData.next_steps}
                onChange={(e) => setFormData(prev => ({ ...prev, next_steps: e.target.value }))}
                placeholder={t('devDashboard.form.nextStepsPlaceholder', 'What needs to be done next?')}
              />
            </div>

            <div>
              <Label htmlFor="stakeholder_summary">{t('devDashboard.form.stakeholderSummary', 'Stakeholder Summary')}</Label>
              <Textarea
                id="stakeholder_summary"
                value={formData.stakeholder_summary}
                onChange={(e) => setFormData(prev => ({ ...prev, stakeholder_summary: e.target.value }))}
                placeholder={t('devDashboard.form.stakeholderPlaceholder', 'Summary for stakeholders and business development...')}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                {t('devDashboard.form.cancel', 'Cancel')}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading 
                  ? t('devDashboard.form.saving', 'Saving...')
                  : t('devDashboard.form.save', 'Save Log')
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevLogForm;
