const jwt = require('jsonwebtoken'); 
const Chat = require('../Models/SellerChat.schema');

const sendMessage = async (req, res) => {
    try {
        const receiverId = req.params.receiverId;
        const { message } = req.body;

        let userId = res.locals.userId;
        let FullName = res.locals.name;

        const chatMessage = new Chat({
            senderId: userId,
            senderName: FullName, 
            receiverId,
            message,
        });

        await chatMessage.save();

        const chatHistory = await Chat.find({
            $or: [
                { senderId: userId, receiverId },
                { senderId: receiverId, receiverId: userId }
            ]
        }).select('senderName message createdAt -_id')
        .sort({ createdAt: 1 }); // Sorting by creation time

            res.status(201).json(chatHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { sendMessage };