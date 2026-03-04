import { Request, Response } from "express";
import { User } from "../models/user.model";
import { File } from "../models/file.model";
import { Folder } from "../models/folder.model";
import { v2 } from "cloudinary";

export async function changeUserInfo(req: Request, res: Response) {
    try {
        await User.updateOne({ _id: req.params.user_id }, {
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

export async function deleteCurrentUser(req: Request, res: Response) {
    try {
        const currentUserId = req.params.user_id;
        const getCurrentUserFiles = await File.find({ user_id: currentUserId });

        const deletePromise = getCurrentUserFiles.map(userFile => {
            return v2.uploader.destroy(userFile.files.public_id, { resource_type: userFile.files.resource_type });
        });

        await Promise.all(deletePromise);
        await Promise.all([
            await File.deleteMany({ user_id: currentUserId }),
            await Folder.deleteMany({ user_id: currentUserId })
        ]);

        res.status(200).json({ message: 'your account and files have been deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getUserData(req: Request, res: Response) {
    try {
        const findUser = await User.find({ _id: req.params.user_id });

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
