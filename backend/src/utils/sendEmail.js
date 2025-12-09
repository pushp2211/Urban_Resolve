// utils/sendEmail.js
import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    const response = await sendgrid.send({
      from: "contact.developer.dev@gmail.com", 
      to,
      subject,
      html,
    });
    console.log("Email sent:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};