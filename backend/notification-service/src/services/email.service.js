import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from "dotenv";
import { templateMap } from '../layouts/templateMap.js';

dotenv.config();

const FROM_EMAIL = process.env.GOOGLE_API_USER;
const CLIENT_ID = process.env.GOOGLE_API_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_API_CLIENT_SECRET;
const REDIRECT_URL = process.env.GOOGLE_API_REDIRECT_URL;
const REFRESH_TOKEN = process.env.GOOGLE_API_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendEmail(to, subject, type, data) {
  const templateFn = templateMap[type];

  if (!templateFn) {
    throw new Error(`Email template for type "${type}" not found`);
  }

  const html = templateFn(data);
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: FROM_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  const mailOptions = {
    from: `"FoodRush" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  };

  const result = await transporter.sendMail(mailOptions);
  return result;
}
