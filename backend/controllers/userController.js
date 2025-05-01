import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

const register = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({
                data: null,
                error: true,
                message: 'All fields are required'
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                data: null,
                error: true,
                message: 'User already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate JWT token after registration
        const token = jwt.sign(
            { _id: newUser._id, email: newUser.email },
            process.env.SECRET_KEY,
            // { expiresIn: '7d' } // Optional: Set expiration time
        );
        return res.status(201).json({
            data: {
                user: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    status: newUser.status,
                    createdAt: newUser.createdAt,
                    profilePicUrl: newUser.profilePicUrl
                },
                token: token
            },
            error: false,
            message: 'User registered successfully'
        });

    } catch (error) {
        return res.status(500).json({
            data: null,
            error: error.message,
            message: "Failed to register user"
        });
    }
}

// login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                data: null,
                error: true,
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                data: null,
                error: true,
                message: 'User does not exist'
            });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({
                data: null,
                error: true,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign({ _id: existingUser._id, email: existingUser.email }, process.env.SECRET_KEY);

        return res.status(200).json({
            data: {
                user: {
                    id: existingUser._id,
                    fullName: existingUser.fullName,
                    email: existingUser.email,
                    status: existingUser.status,
                    createdAt: existingUser.createdAt,
                    profilePicUrl: existingUser.profilePicUrl
                },
                token: token
            },
            error: false,
            message: 'User logged in successfully'
        });

    } catch (error) {
        return res.status(500).json({
            data: null,
            error: error.message,
            message: "Failed to login user"
        });
    }
}

// fetch user
const fetchUser = async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await User.findOne({ _id });
        return res.status(200).json({
            data: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                status: user.status,
                createdAt: user.createdAt,
                profilePicUrl: user.profilePicUrl
            },
            error: false,
            message: 'User fetched successfully'
        });
    } catch (error) {
        return res.status(409).json({
            data: null,
            error: error.message,
            message: "Failed to fetch user"
        });
    }
}

// update profile
const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const { _id } = req.user;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const user = await User.findOneAndUpdate({ _id }, { profilePicUrl : uploadResponse.secure_url }, { new: true });
        res.status(200).json({
            data: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePicUrl: user.profilePicUrl,
                status: user.status,
                createdAt: user.createdAt
            },
            message: "User updated successfully",
        });
    } catch (error) {
        return res.status(409).json({
            data: null,
            error: error.message,
            message: "Failed to update profile"
        });
    }
}

export { register, login, fetchUser, updateProfile };