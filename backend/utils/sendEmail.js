import nodemailer from "nodemailer";

/**
 * Creates a configured Nodemailer transporter.
 * Falls back gracefully if credentials are missing (dev mode).
 */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("[Email] EMAIL_USER or EMAIL_PASS not set — email disabled.");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use Gmail App Password, NOT your account password
    },
  });
};

/**
 * Sends an email.
 * @param {Object} options
 * @param {string} options.to       - Recipient email address
 * @param {string} options.subject  - Email subject
 * @param {string} options.html     - HTML email body
 */
const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  if (!transporter) return; // Silently skip if email is not configured

  const mailOptions = {
    from: `"Karigari by Nisha" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[Email] Sent to ${to} — MessageId: ${info.messageId}`);
};

export default sendEmail;
