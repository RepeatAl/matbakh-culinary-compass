
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: number;
}

// Rate limiting storage (in-memory, resets with function restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 requests per IP per 15 minutes

function getClientIP(req: Request): string {
  return req.headers.get("cf-connecting-ip") || 
         req.headers.get("x-forwarded-for") || 
         req.headers.get("x-real-ip") || 
         "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const rateData = rateLimitMap.get(ip);

  if (!rateData || now > rateData.resetTime) {
    // Reset or initialize rate limit data
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (rateData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  rateData.count++;
  return false;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = getClientIP(req);
    
    // Check rate limiting
    if (isRateLimited(clientIP)) {
      console.log(JSON.stringify({
        event: 'rate_limit_exceeded',
        ip_hash: clientIP.slice(0, 8), // Only log partial IP for privacy
        timestamp: new Date().toISOString()
      }));

      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, subject, message, timestamp }: ContactEmailRequest = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Anti-spam: Check if submission is too fast
    const timeDiff = Date.now() - timestamp;
    if (timeDiff < 2000) { // Less than 2 seconds
      console.log(JSON.stringify({
        event: 'spam_attempt_detected',
        reason: 'too_fast_submission',
        time_diff: timeDiff,
        ip_hash: clientIP.slice(0, 8),
        timestamp: new Date().toISOString()
      }));

      return new Response(
        JSON.stringify({ error: "Submission too fast. Please try again." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get target email from environment variable with fallback
    const targetEmail = Deno.env.get("CONTACT_TARGET_EMAIL") || "write@rabibskii.com";

    // Send email to target address
    const emailResponse = await resend.emails.send({
      from: "Matbakh Contact <write@rabibskii.com>",
      to: [targetEmail],
      subject: `[Matbakh Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
            Neue Kontaktnachricht von Matbakh
          </h2>
          
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>E-Mail:</strong> ${email}</p>
            <p><strong>Betreff:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #555;">Nachricht:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #888;">
            <p>Gesendet am: ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}</p>
            <p>IP-Hash: ${clientIP.slice(0, 8)}</p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to sender
    await resend.emails.send({
      from: "Matbakh <write@rabibskii.com>",
      to: [email],
      subject: "Ihre Nachricht wurde empfangen - Your message was received",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Vielen Dank für Ihre Nachricht!</h2>
          
          <p>Hallo ${name},</p>
          
          <p>wir haben Ihre Nachricht mit dem Betreff "<strong>${subject}</strong>" erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>
          
          <p>Falls Sie dringende Fragen haben, können Sie uns auch direkt unter write@rabibskii.com erreichen.</p>
          
          <p>Mit freundlichen Grüßen<br>
          Das Matbakh Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <h3 style="color: #333;">Thank you for your message!</h3>
          
          <p>Hello ${name},</p>
          
          <p>we have received your message with the subject "<strong>${subject}</strong>" and will get back to you as soon as possible.</p>
          
          <p>If you have urgent questions, you can also reach us directly at write@rabibskii.com.</p>
          
          <p>Best regards<br>
          The Matbakh Team</p>
        </div>
      `,
    });

    // Structured logging for monitoring
    console.log(JSON.stringify({
      event: 'contact_email_sent',
      message_id: emailResponse.data?.id,
      sender_email_hash: email.substring(0, 3) + '***', // Anonymized logging
      subject_preview: subject.substring(0, 20),
      ip_hash: clientIP.slice(0, 8),
      timestamp: new Date().toISOString(),
      status: 'success'
    }));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        messageId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error(JSON.stringify({
      event: 'contact_email_error',
      error_message: error.message,
      error_type: error.name,
      timestamp: new Date().toISOString(),
      status: 'error'
    }));

    return new Response(
      JSON.stringify({ 
        error: "Failed to send email",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
