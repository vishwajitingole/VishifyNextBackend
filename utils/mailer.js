// utils/mailer.js
import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({ from: '"Music App" <noreply@musicapp.com>', to, subject, text, html });
}
