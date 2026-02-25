import { Request, Response } from "express";
import { File } from "../models/file.model";
import dotenv from 'dotenv';
import { v2 } from "cloudinary";
import { Favorited } from "../models/favorited.model";

dotenv.config();

v2.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

export async function getAllFiles(req: Request, res: Response) {
    try {
        const getUserId = req.params.user_id;
        const searched = req.query.search as string | undefined;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        if (searched === undefined) {
            const getAllFiles = await File.find({ user_id: getUserId }).limit(limit).skip(skip);
            res.json(getAllFiles);
        } else {
            const getAllFiles = await File.find({ 
                file_name: { $regex: new RegExp(searched, 'i') }, 
                user_id: getUserId 
            }).limit(limit).skip(skip);

            res.json(getAllFiles);
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllFiles(req: Request, res: Response) {
    try {
        const getUserId = req.params.user_id;
        const currentUserfiles: { public_id: string; resource_type: string }[] = [];
        const findUserFiles = await File.find({ user_id: getUserId });

        if (findUserFiles.length === 0) return res.status(400).json({ message: "no files added" });

        findUserFiles.forEach((user_file) => {
            currentUserfiles.push({ 
                public_id: user_file.files.public_id, 
                resource_type: user_file.files.resource_type 
            });
        });

        const deletePromise = currentUserfiles.map((userFile) => {
            return v2.uploader.destroy(userFile.public_id, { resource_type: userFile.resource_type });
        });

        await Promise.all(deletePromise);
        await Promise.all([
            File.deleteMany({ user_id: getUserId }),
            Favorited.deleteMany({ user_id: getUserId })
        ]);
        res.status(200).json({ message: 'file deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteSelectedFile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
    try {
        const getFileId = req.params.id;
        const getFile = await File.findOne({ _id: getFileId });

        if (!getFile) return res.status(404).json({ message: 'file not found' });
        
        await v2.uploader.destroy(getFile.files.public_id, { resource_type: getFile.files.resource_type });
        await Promise.all([
            File.deleteOne({ _id: getFileId }),
            Favorited.deleteOne({ file_id: getFileId })
        ]);
        res.status(200).json({ message: 'file deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal sever error' });
    }
}

export async function insertNewFile(req: Request, res: Response) {
    try {
        const { files } = req.body;
        const newFile = new File(req.body);

        if (!files || files.length === 0) return res.status(400).json({ message: 'Please select at least one file' });

        await newFile.save();
        res.status(201).json({ message: 'new file added' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}