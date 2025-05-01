import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePicUrl: {
        type: String,
        default: ""
    },
    status:{
        type: String,
        default: "active"
    }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;