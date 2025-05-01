import express from 'express';
import verifyAuth from '../middlewares/auth.js';
import { fetchUser, login, register, updateProfile } from '../controllers/userController.js';


const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/me', verifyAuth, fetchUser);
userRouter.put('/update-profile', verifyAuth, updateProfile);

export default userRouter;