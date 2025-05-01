import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import { getReceiverSocketId , io } from "../config/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.query.loggedInUserId;
        // console.log("req.query: ", req.query);  
        // console.log("Logged in user ID: ", loggedInUserId);
        const filteredUsers = await User.find({ clerkId: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json({
            data: filteredUsers,
            error: true,
            message: 'Users fetched successfully'
        });
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const userToChatId = req.query.selectedUserId;
        const myId = req.query.authUserId;
        // const myId = req.user._id;
        // console.log("req.query: ", req.query);

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json({
            data: messages,
            error: false,
            message: 'Messages fetched successfully'
        });
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, media } = req.body;
        const  receiverId  = req.query.selectedUserId;
        const senderId = req.query.authUserId;
        // console.log("req.query: ", req.query);

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            media,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json({
            data: newMessage,
            error: false,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};