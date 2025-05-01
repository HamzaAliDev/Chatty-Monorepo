import express from "express";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", getUsersForSidebar);
messageRouter.get("/", getMessages);
messageRouter.post("/send", sendMessage);

export default messageRouter;