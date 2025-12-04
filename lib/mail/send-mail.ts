"use server";
import nodemailer from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";
const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;
const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST,
  port: 465,
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
  attachments,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
}) {
  try {
    const isVerified = await transporter.verify();
  } catch (error) {
    console.error(
      "Something Went Wrong",
      SMTP_SERVER_USERNAME,
      SMTP_SERVER_PASSWORD,
      error
    );
    return;
  }
  try {
    const info = await transporter.sendMail({
      from: email,
      to: sendTo || SITE_MAIL_RECIEVER,
      bcc: SITE_MAIL_RECIEVER,
      subject: subject,
      text: text ? text : "",
      html: html ? html : "",
      attachments: attachments || [],
    });
    console.log("Message Sent with ID: ", info.messageId);
    console.log("Mail sent to: ", SITE_MAIL_RECIEVER, "-", sendTo);
    return { success: true, info };
  } catch (error) {
    console.error("Send Mail Error:", error);
    return { success: false, error };
  }
}
