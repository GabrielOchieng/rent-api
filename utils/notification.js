import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
// import Task from "../models/taskModel.js";
import User from "../models/userModel.js"; // Assuming you have a User model
import Message from "../models/Message.js";
import House from "../models/houseModel.js";

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
  const reminderThreshold = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago

  try {
    // const unreadMessages = await Message.find({
    //   // Add conditions to filter for unread messages
    //   readAt: null, // Or any other condition to indicate unread status
    // }).populate("recipient");

    const unread = await House.find().populate("landlord");
    const unreadMessages = await Message.find({
      read: false, //
    }).populate("sender recipient");
    console.log("MESSAGE", unreadMessages[0].recipient);

    console.log("HOUSE", unread[0].landlord);

    for (const message of unreadMessages) {
      const recipientEmail = message.recipient.email;
      //   const senderEmail = message.sender.email;
      const senderName = message.sender.name;
      console.log("GABRIEL", unreadMessages);
      console.log("GABU", message.recipient);
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
    }
  } catch (error) {
    console.error("Error sending email reminders:", error);
  }
};

// export const sendUnreadMessageReminders = async () => {
//   const reminderThreshold = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days from now

//   try {
//     const tasks = await Task.find({
//       dueDate: { $lt: reminderThreshold },
//       completed: false,
//     }).populate("assignedTo");

//     for (const task of tasks) {
//       const assignedUserEmail = task.assignedTo.email;
//       const managerEmails = await User.find({ role: "manager" }).select(
//         "email"
//       );

//       const assignedUserContent = `
//         <h3>Task Reminder: ${task.title} (Assigned to you)</h3>
//         <p>This task is due on ${task.dueDate.toLocaleDateString()}. Don't forget to complete it!</p>
//         <a href="https://task-manager-r6wk.onrender.com">Login into TASKY to view details</a>
//       `;

//       const managerContent = `
//         <h3>Task Reminder: ${task.title} (Assigned to ${task.assignedTo.name} ${
//         task.assignedTo.email
//       })</h3>
//         <p>This task is due on ${task.dueDate.toLocaleDateString()}. Remind him/her to complete it.</p>
//         <a href="https://task-manager-r6wk.onrender.com">Login into TASKY to view details</a>
//       `;

//       const emailsToSend = [
//         { email: assignedUserEmail, content: assignedUserContent },
//         ...managerEmails.map((user) => ({
//           email: user.email,
//           content: managerContent,
//         })),
//       ];

//       for (const email of emailsToSend) {
//         await transporter.sendMail({
//           from: "ogingagabriel@gmail.com", // Replace with your actual email
//           to: email.email,
//           subject: `Task Reminder: ${task.title}`,
//           html: email.content,
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Error sending email reminders:", error);
//   }
// };
