// utils/sendEmail.js
import axios from "axios";

if (!process.env.BREVO_API_KEY) {
  throw new Error("BREVO_API_KEY is missing");
}

export const sendEmail = async (to, subject, html) => {
  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: "contact.developer.dev@gmail.com", 
          name: "Urban-Resolve",
        },
        to: Array.isArray(to)
          ? to.map((email) => ({ email }))
          : [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent:", res.data);
    return res.data;

  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.data || error.message
    );
    throw new Error("Email sending failed");
  }
};