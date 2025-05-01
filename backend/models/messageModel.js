import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    media: {
        type: String,
    },
    senderId: {
        type: String,

    },
    receiverId: {
        type: String,
    },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;