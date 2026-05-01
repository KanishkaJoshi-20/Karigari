import nodemailer from "nodemailer";

/**
 * Sends an email using Nodemailer via Gmail App Password.
 * Logs detailed errors to help with debugging on Render.
 *
 * @param {Object} options
 * @param {string} options.to       - Recipient email address
 * @param {string} options.subject  - Email subject
 * @param {string} options.html     - HTML email body
 */
const sendEmail = async ({ to, subject, html }) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn("[Email] Skipped — EMAIL_USER or EMAIL_PASS not set in environment.");
    return;
  }

  console.log(`[Email] Attempting to send to: ${to}`);
  console.log(`[Email] Using sender: ${user}`);

  // Create a fresh transporter each time (avoids stale connection issues on Render)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user,
      pass,
    },
  });

  // Verify connection before sending
  await transporter.verify();
  console.log("[Email] SMTP connection verified ✅");

  const info = await transporter.sendMail({
    from: `"Karigari by Nisha" <${user}>`,
    to,
    subject,
    html,
  });

  console.log(`[Email] ✅ Sent successfully to ${to} — MessageId: ${info.messageId}`);
};

export default sendEmail;
