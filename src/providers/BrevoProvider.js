const SibApiV3Sdk = require("@getbrevo/brevo");
import { env } from "~/config/environment";

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let apiKey = apiInstance.authentications["apiKey"];

apiKey.apiKey = env.BREVO_API_KEY;

const sendEmail = async (recipientEmail, customSubject, customHtmlContent) => {
  let SendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  SendSmtpEmail.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME };

  SendSmtpEmail.to = [{ email: recipientEmail }];

  SendSmtpEmail.subject = customSubject;

  SendSmtpEmail.htmlContent = customHtmlContent;

  return apiInstance.sendTransacEmail(SendSmtpEmail);
};

export const BrevoProvider = {
  sendEmail,
};
