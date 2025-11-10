import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

async function signIn(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({ email });

        if (!email) return res.status(400).json({ message: 'email is required' });
        if (!password) return res.status(400).json({ message: 'password is required' });
        if (!findUser) return res.status(401).json({ message: 'Invalid data. Try again later' });

        const isPasswordMatch = await bcrypt.compare(password, findUser.password);
        if (!isPasswordMatch) return res.status(404).json({ message: 'incorrect password' });

        const generatedToken = jwt.sign(
            { user_id: findUser._id.toString() },
            process.env.JWT_TOKEN || 'jwt key',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            status: 'ok',
            token: generatedToken,
            user_id: findUser._id
        });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function signUp(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
    try {
        const { created_at, email, password, username } = req.body;
        const findUser = await User.findOne({ email });

        if (!email) return res.status(400).send({ message: 'email is required' });
        if (!password) return res.status(400).send({ message: 'password is required' });
        if (!username) return res.status(400).send({ message: 'username is required' });

        if (findUser) return res.status(409).send({ message: 'User already exist' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ created_at, email, password: hashedPassword, username });
        await newUser.save();
        res.status(201).json({ message: 'user added' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function getUserData(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
    try {
        const currentUserId = req.params.user_id;
        const findUser = await User.findOne(
            { _id: currentUserId }, 
            { _id: 1, created_at: 1, email: 1, username: 1 }
        );

        if (!findUser) return res.status(404).json({ message: 'User not found' });

        res.json({
            created_at: findUser.created_at,
            email: findUser.email,
            user_id: findUser._id,
            username: findUser.username
        });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export { getUserData, signIn, signUp }