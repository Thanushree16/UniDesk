import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(name, email) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Welcome to UniDesk!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #050b18; color: #ffffff; border-radius: 12px; padding: 40px;">
        <h1 style="color: #e74c3c; margin-bottom: 8px;">UniDesk</h1>
        <h2 style="margin-bottom: 16px;">Welcome, ${name}! 🎉</h2>
        <p style="color: #ccc; line-height: 1.6;">
          Your account has been created successfully. You can now access study materials, upload PDFs, and use the AI assistant.
        </p>
        <a href="${process.env.CLIENT_URL}/login" 
           style="display: inline-block; margin-top: 24px; padding: 12px 28px; background: #e74c3c; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Go to UniDesk
        </a>
        <p style="margin-top: 32px; font-size: 0.8rem; color: #555;">If you didn't create this account, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendResetEmail(email, resetToken) {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your UniDesk password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #050b18; color: #ffffff; border-radius: 12px; padding: 40px;">
        <h1 style="color: #e74c3c; margin-bottom: 8px;">UniDesk</h1>
        <h2 style="margin-bottom: 16px;">Password Reset</h2>
        <p style="color: #ccc; line-height: 1.6;">
          You requested a password reset. Click the button below — this link expires in <strong>15 minutes</strong>.
        </p>
        <a href="${resetUrl}" 
           style="display: inline-block; margin-top: 24px; padding: 12px 28px; background: #e74c3c; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Reset Password
        </a>
        <p style="margin-top: 16px; font-size: 0.85rem; color: #888;">Or copy this link: ${resetUrl}</p>
        <p style="margin-top: 32px; font-size: 0.8rem; color: #555;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}