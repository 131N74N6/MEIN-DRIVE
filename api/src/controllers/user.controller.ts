import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Data } from "../models/data.model";
import { v2 } from "cloudinary";
import { AuthRequest } from "../middleware/auth.middleware";

export async function changeUserInfo(req: AuthRequest, res: Response) {
    try {
        await User.updateOne({ _id: req.user?.user_id }, {
            $set: {
                email: req.body.email,
                username: req.body.username
            }
        });
        res.status(200).json({ message: 'user info updated' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteCurrentUser(req: AuthRequest, res: Response) {
    try {
        const currentUserId = req.user?.user_id;
        const getCurrentUserFiles = await Data.find({ category: "files", user_id: currentUserId });

        const deletePromise = getCurrentUserFiles.map(userFile => {
            return v2.uploader.destroy(userFile.files.public_id, { resource_type: userFile.files.resource_type });
        });

        await Promise.all([
            ...deletePromise,
            Data.deleteMany({ user_id: currentUserId }),
            User.deleteOne({ _id: currentUserId })
        ]);

        res.status(200).json({ message: 'your account and files have been deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getUserData(req: AuthRequest, res: Response) {
    try {
        const findUser = await User.findOne({ _id: req.user?.user_id });
        if (!findUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            created_at: findUser.created_at,
            email: findUser.email,
            user_id: findUser._id,
            username: findUser.username
        });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}
