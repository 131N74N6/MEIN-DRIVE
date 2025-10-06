import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

async function signIn(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const findUser = await User.find({ email });

        const isPasswordMatch = await bcrypt.compare(password, findUser[0].password);
        if (!isPasswordMatch) return res.status(404).json({ message: 'incorrect password' });

        const generatedToken = jwt.sign(
            { id: findUser[0]._id, email, password },
            process.env.JWT_TOKEN || 'jwt key',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token: generatedToken,
            signin_user_id: findUser[0]._id
        });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function signUp(req: Request, res: Response) {
    try {
        const { created_at, email, password, username } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ created_at, email, password: hashedPassword, username });
        await newUser.save();
        res.status(201).json({ message: 'user added' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export { signIn, signUp }