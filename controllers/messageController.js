import Message from "../models/Message.js";

// new message
const createMessage = async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

// get message

const getMessage = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (error) {}
};

const markMessageAsRead = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Update the read property directly
    message.read = true;
    await message.save();

    res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking message as read" });
  }
};

export { createMessage, getMessage, markMessageAsRead };
