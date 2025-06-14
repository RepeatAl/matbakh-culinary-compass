
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { SignInSchema, SignUpSchema, TSignInSchema, TSignUpSchema } from '@/lib/validators/auth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AuthForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const signUpForm = useForm<TSignUpSchema>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
  });

  const signInForm = useForm<TSignInSchema>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSignUp = async (values: TSignUpSchema) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast({
        title: t('auth.signUpError', 'Sign up failed'),
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('auth.signUpSuccessTitle', 'Check your email!'),
        description: t('auth.signUpSuccessDescription', 'We have sent you a confirmation link.'),
      });
    }
    setLoading(false);
  };

  const handleSignIn = async (values: TSignInSchema) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast({
        title: t('auth.signInError', 'Sign in failed'),
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('auth.signInSuccess', 'Successfully signed in!'),
      });
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('auth.pageTitle', 'Welcome')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{t('auth.signInTab', 'Sign In')}</TabsTrigger>
            <TabsTrigger value="signup">{t('auth.signUpTab', 'Sign Up')}</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Form {...signInForm}>
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4 mt-4">
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.emailLabel', 'Email')}</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.passwordLabel', 'Password')}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('auth.loading', 'Loading...') : t('auth.signInButton', 'Sign In')}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="signup">
            <Form {...signUpForm}>
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4 mt-4">
                <FormField
                  control={signUpForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.firstNameLabel', 'First Name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('auth.firstNamePlaceholder', 'John')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.lastNameLabel', 'Last Name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('auth.lastNamePlaceholder', 'Doe')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.emailLabel', 'Email')}</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.passwordLabel', 'Password')}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('auth.loading', 'Loading...') : t('auth.signUpButton', 'Sign Up')}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
