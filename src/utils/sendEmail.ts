import env from "../core/env";
import transporter from "./mail.config";


interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({to, subject, html, text}: SendEmailOptions) => {
  await transporter.sendMail({
    from: `"${env.MAIL_FROM_NAME}" <${env.MAIL_USER}>`,
    to,
    subject,
    html,
    text,
  });
};