import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

async function signIn(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const findEmail = await User.findOne({ email });
        
        if (!password || !email) return res.status(400).json({ message: "email and password is required" });
        if (!email) return res.status(400).json({ message: 'email is required' });
        if (!password) return res.status(400).json({ message: 'password is required' });

        if (!findEmail) return res.status(400).json({ message: 'email not found' });
        
        const isPasswordMatch = await bcrypt.compare(password, findEmail.password);
        if (!isPasswordMatch) return res.status(400).json({ message: 'incorrect password' });

        const generatedToken = jwt.sign(
            { user_id: findEmail._id.toString() },
            process.env.JWT_TOKEN || 'your-jwt-key',
        );

        res.status(200).json({
            status: 'ok',
            info: {
                token: generatedToken,
                user_id: findEmail._id
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function signUp(req: Request, res: Response) {
    try {
        const { created_at, email, password, username } = req.body;
        
        if (!password || !email || !username) return res.status(400).json({ message: "email, username, and password is required" });
        if (!email) return res.status(400).send({ message: 'email is required' });
        if (!password) return res.status(400).send({ message: 'password is required' });
        if (!username) return res.status(400).send({ message: 'username is required' });
        
        const findEmail = await User.findOne({ email: email });
        if (findEmail) return res.status(400).send({ message: 'this email already exist' });

        const findUser = await User.findOne({ username: username });
        if (findUser) return res.status(400).send({ message: 'this username already exist' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ created_at, email, password: hashedPassword, username });
        await newUser.save();
        res.status(201).json({ message: 'user added' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function getUserData(req: Request, res: Response) {
    try {
        if (!req.user) return res.status(401).json({ message: 'Authentication required' });
        const findUser = await User.find({ _id: req.user.user_id });

        if (!findUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            created_at: findUser[0].created_at,
            email: findUser[0].email,
            user_id: findUser[0]._id,
            username: findUser[0].username
        });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export { getUserData, signIn, signUp }