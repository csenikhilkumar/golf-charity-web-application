import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}

/**
 * Core utility for sending emails via Resend.
 */
export async function sendEmail({ to, subject, react }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key_here') {
    console.warn('RESEND_API_KEY is not set. Falling back to MOCK mode (emails won\'t be sent, but in-app actions will continue).');
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: 'Golf Charity <notifications@resend.dev>', // Replace with your verified domain in production
      to,
      subject,
      react,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
