import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  async sendActivationEmail(email: string, link: string) {
    const activateUrl = `${process.env.API_URL}/api/users/verify/${link}`;

    await this.transporter.sendMail({
      from: `"Avto-Service" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Email verification",
      html: `<p>Click the link below to activate your account:</p>
             <a href="${activateUrl}">ACTIVATE</a>`,
    });
  }

  async sendOtp(email: string, otp: string) {
    const mailOptions = {
      from: `"Avto-Service" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Login OTP Verification",
      html: `<p>Your OTP code is: <b>${otp}</b></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
