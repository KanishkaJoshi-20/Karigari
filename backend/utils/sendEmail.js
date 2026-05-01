import { Resend } from "resend";

/**
 * Sends an email via Resend HTTP API.
 * Works on all cloud platforms (Render, Vercel, Railway, etc.)
 * because it uses port 443 (HTTPS), never blocked.
 *
 * @param {Object} options
 * @param {string} options.to       - Recipient email address
 * @param {string} options.subject  - Email subject
 * @param {string} options.html     - HTML email body
 */
const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.EMAIL_FROM || "Karigari by Nisha <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[Email] Skipped — RESEND_API_KEY not set in environment.");
    return;
  }

  console.log(`[Email] Attempting to send to: ${to}`);

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message || JSON.stringify(error)}`);
  }

  console.log(`[Email] ✅ Sent successfully to ${to} — Id: ${data?.id}`);
};

export default sendEmail;
