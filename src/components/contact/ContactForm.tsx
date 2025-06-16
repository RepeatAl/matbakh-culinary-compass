import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useSafeT } from '@/hooks/useSafeT';
import { supabase } from '@/integrations/supabase/client';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email address is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
  honeypot: z.string().max(0, 'Spam detected'), // Honeypot field
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const { t } = useSafeT();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitTimestamp] = useState(Date.now());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: ContactFormData) => {
    // Anti-spam check: Submit too fast (< 3 seconds)
    const timeDiff = Date.now() - submitTimestamp;
    if (timeDiff < 3000) {
      toast({
        variant: "destructive",
        title: t('contact:form.toastRateLimit', 'Too many requests. Please wait a moment.')
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          timestamp: Date.now()
        }
      });

      if (error) {
        console.error('Contact form error:', error);
        throw error;
      }

      toast({
        title: t('contact:form.toastSuccess', 'Message sent successfully! We\'ll get back to you soon.')
      });

      reset();

      // Analytics event (only if GTM is loaded and consent given)
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'contact_submit',
          contact_method: 'form'
        });
      }

    } catch (error: any) {
      console.error('Failed to send contact message:', error);
      
      // Show fallback option in error toast with correct email
      const fallbackEmail = 'write@rabibskii.com';
      const mailtoLink = `mailto:${fallbackEmail}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.message)}`;
      
      toast({
        variant: "destructive",
        title: t('contact:form.toastError', 'Error sending message. Please try again.'),
        description: (
          <div className="mt-2">
            <p className="text-sm">{t('contact:form.fallbackText', 'Attempt failed?')}</p>
            <a 
              href={mailtoLink} 
              className="text-sm underline hover:no-underline"
              onClick={() => {
                // Analytics for fallback usage
                if (typeof window !== 'undefined' && window.dataLayer) {
                  window.dataLayer.push({
                    event: 'contact_fallback',
                    contact_method: 'mailto'
                  });
                }
              }}
            >
              {t('contact:form.fallbackLink', 'Click here for direct email contact')}
            </a>
          </div>
        )
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {t('contact:form.title', 'Contact')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Honeypot field - hidden from users but visible to bots */}
          <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }}>
            <Label htmlFor="honeypot">Leave this field empty</Label>
            <Input
              id="honeypot"
              type="text"
              {...register('honeypot')}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                {t('contact:form.name', 'Name')} *
              </Label>
              <Input
                id="name"
                type="text"
                {...register('name')}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p 
                  id="name-error"
                  role="alert" 
                  className="text-sm text-destructive"
                >
                  {t('contact:form.nameError', errors.name.message)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {t('contact:form.email', 'Email Address')} *
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p 
                  id="email-error"
                  role="alert" 
                  className="text-sm text-destructive"
                >
                  {t('contact:form.emailError', errors.email.message)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              {t('contact:form.subject', 'Subject')} *
            </Label>
            <Input
              id="subject"
              type="text"
              {...register('subject')}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
              className={errors.subject ? 'border-destructive' : ''}
            />
            {errors.subject && (
              <p 
                id="subject-error"
                role="alert" 
                className="text-sm text-destructive"
              >
                {t('contact:form.subjectError', errors.subject.message)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              {t('contact:form.message', 'Message')} *
            </Label>
            <Textarea
              id="message"
              rows={6}
              {...register('message')}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              className={errors.message ? 'border-destructive' : ''}
            />
            {errors.message && (
              <p 
                id="message-error"
                role="alert" 
                className="text-sm text-destructive"
              >
                {t('contact:form.messageError', errors.message.message) || 
                 t('contact:form.messageMinError', errors.message.message)}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting 
              ? t('contact:form.sending', 'Sending...') 
              : t('contact:form.submit', 'Send Message')
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
