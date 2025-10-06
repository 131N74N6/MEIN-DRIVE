import { Request, Response } from "express";
import { File } from "../models/file.model";
import dotenv from 'dotenv';
import { v2 } from "cloudinary";

dotenv.config();

v2.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

async function getAllFiles(req: Request, res: Response) {
    try {
        const getUserId = req.params.id;
        const getAllFiles = await File.find({ user_id: getUserId });
        res.json(getAllFiles);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function deleteAllFiles(req: Request, res: Response) {
    try {
        const getUserId = req.params.id;
        const getUserFiles = await File.find({ user_id: getUserId });
        const deletePromise = getUserFiles.map(user_file => {
            return v2.uploader.destroy(user_file.files.public_id);
        });

        await Promise.all(deletePromise);
        await File.deleteMany({ user_id: getUserId });
        res.status(200).json({ message: 'file deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function deleteSelectedFile(req: Request, res: Response) {
    try {
        const getFileId = req.params.id;
        const getFile = await File.find({ _id: getFileId });
        const deletePromise = getFile.map(file => {
            return v2.uploader.destroy(file.files.public_id);
        });
        
        await Promise.all(deletePromise);
        await File.deleteOne({ _id: getFileId });
        res.status(200).json({ message: 'file deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal sever error' });
    }
}

export { deleteAllFiles, deleteSelectedFile, getAllFiles }