import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { ConfirmationEmail } from './_templates/confirmation-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Based on https://supabase.com/docs/guides/auth/auth-hooks#payload
interface SupabaseAuthHookPayload {
  type: string;
  user: {
    id: string;
    aud: string;
    role: string;
    email: string;
    user_metadata: {
      first_name?: string;
      last_name?: string;
    };
    // and other user properties
  };
  email_data: {
    token_hash: string;
    type: string;
    redirect_to: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!hookSecret) {
    console.error("SEND_EMAIL_HOOK_SECRET is not set.");
    return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);
  const wh = new Webhook(hookSecret);

  try {
    const { user, email_data }: SupabaseAuthHookPayload = wh.verify(payload, headers) as any;
    
    // We only want to handle the sign-up confirmation email here.
    if (email_data.type !== 'signup') {
       return new Response(JSON.stringify({ message: 'Ignoring non-signup email type' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const confirmationLink = `${supabaseUrl}/auth/v1/verify?token=${email_data.token_hash}&type=signup&redirect_to=${email_data.redirect_to}`;
    const userName = user.user_metadata?.first_name || null;

    const html = await renderAsync(
      React.createElement(ConfirmationEmail, {
        confirmationLink,
        userName,
      })
    );

    const { error } = await resend.emails.send({
      from: 'Matbakh <admin@whatsgonow.com>',
      to: [user.email],
      subject: 'Welcome to Matbakh! Please confirm your email.',
      html,
    });

    if (error) {
      console.error("Resend API Error:", error);
      throw error;
    }

    return new Response(JSON.stringify({ message: "Email sent." }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook Error:', error.message);
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
        },
      }),
      {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
