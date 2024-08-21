import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import Message from "../models/Message.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ogingagabriel@gmail.com",
    pass: process.env.MAIL_PASSWORD, // using environment variables
  },
});

export const sendUnreadMessageReminders = async () => {
  //   const reminderThreshold = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago
  const reminderThreshold = Date.now() - 5 * 60 * 1000; // 5 minutes ago

  try {
    const unreadMessages = await Message.find({
      read: false,
      reminderSent: false, // Check if reminder is not sent
      createdAt: { $lte: reminderThreshold }, // Filter messages created at least 10 minutes ago
    }).populate("sender recipient");

    for (const message of unreadMessages) {
      const recipientEmail = message.recipient.email;
      const senderName = message.sender.name;

      const emailContent = `
          <h3>Unread Message Reminder:</h3>
          <p>You have an unread message from ${senderName}.</p>
          <a href="http://localhost:5173">Login on the website to view the message</a>
        `;

      await transporter.sendMail({
        from: "ogingagabriel@gmail.com", // Replace with your actual email
        to: recipientEmail,
        subject: "Unread Message Reminder",
        html: emailContent,
      });

      // Update message to mark reminderSent as true
      message.reminderSent = true;
      await message.save();
    }
  } catch (error) {
    console.error("Error sending email reminders:", error);
  }
};
