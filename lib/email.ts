import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendGDPREmail(params: {
  to: string;
  subject: string;
  text: string;
  ccUser?: string;
}) {
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: params.to,
      cc: params.ccUser,
      subject: params.subject,
      text: params.text,
    });

    if (error) {
      throw new Error(`Email failed: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Velkommen til SlettMeg!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Velkommen til SlettMeg${name ? `, ${name}` : ""}!</h2>
          <p style="color: #666; font-size: 16px;">
            Vi er glade for å ha deg her. SlettMeg hjelper deg med å ta kontroll over ditt digitale fotavtrykk.
          </p>
          <p style="color: #666; font-size: 16px;">
            Du kan nå:
          </p>
          <ul style="color: #666; font-size: 16px;">
            <li>Søke blant over 100 plattformer</li>
            <li>Få AI-drevet veiledning for sletting</li>
            <li>Generere GDPR-forespørsler automatisk</li>
            <li>Spore fremgangen din</li>
          </ul>
          <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Kom i gang
          </a>
          <p style="color: #999; font-size: 14px; margin-top: 40px;">
            Hvis du har spørsmål, er vi her for å hjelpe!
          </p>
        </div>
      `,
    });

    if (error) {
      throw new Error(`Welcome email failed: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Welcome email error:", error);
    // Don't throw - welcome email failure shouldn't block registration
    return { success: false };
  }
}
