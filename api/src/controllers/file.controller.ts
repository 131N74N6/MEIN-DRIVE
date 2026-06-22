import { Request, Response } from "express";
import { Data } from "../models/data.model";
import { v2 } from "cloudinary";
import { AuthRequest } from "../middleware/auth.middleware";

export async function addNewFile(req: Request, res: Response) {
    try {
        const isFileExist = await Data.findOne({ category: "files", file_name: req.body.file_name, user_id: req.body.user_id });
        if (isFileExist) return res.status(409).json({ message: 'This file already exist' });
        if (!req.body.files) return res.status(400).json({ message: 'Please select at least one file' });
        
        const newFile = new Data({
            category: "files",
            created_at: req.body.created_at,
            files: req.body.files,
            file_name: req.body.file_name,
            file_type: req.body.file_type,
            user_id: req.body.user_id
        });

        await newFile.save();
        res.status(200).json({ message: 'new file added' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function addToFolder(req: Request, res: Response) {
    try {
        await Data.updateOne({ _id: req.params._id, category: "files" }, { 
            $set: { folder_id: req.body.folder_id }
        });
        res.status(200).json({ message: 'added 1 file' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function changeFileName(req: Request, res: Response) {
    try {
        await Data.updateOne({ _id: req.params._id, category: "files" }, { 
            $set: { file_name: req.body.file_name }
        });
        res.status(200).json({ message: 'added 1 file' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllFilesInFolder(req: Request, res: Response) {
    try {
        const getCurrentFolderId = req.params.folder_id;
        const getAllFiles = await Data.find({ category: "files", folder_id: getCurrentFolderId });

        if (getAllFiles.length === 0) return res.status(400).json({ message: "no files added" });

        const deletePromise = getAllFiles.map((userFile) => {
            return v2.uploader.destroy(userFile.files.public_id, { resource_type: userFile.files.resource_type });
        });

        await Promise.all([...deletePromise, Data.deleteMany({ category: "files", folder_id: getCurrentFolderId })]);

        res.status(200).json({ message: 'file deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllFiles(req: AuthRequest, res: Response) {
    try {
        const getUserId = req.user?.user_id;
        const findUserFiles = await Data.find({ category: "files", user_id: getUserId });

        if (findUserFiles.length === 0) return res.status(400).json({ message: "no files added" });

        const deletePromise = findUserFiles.map((userFile) => {
            return v2.uploader.destroy(userFile.files.public_id, { resource_type: userFile.files.resource_type });
        });

        await Promise.all([deletePromise, Data.deleteMany({ category: "files", user_id: getUserId })]);

        res.status(200).json({ message: 'file deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteSelectedFile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
    try {
        const getFileId = req.params._id;
        const getFile = await Data.findOne({ category: "files", _id: getFileId });

        if (!getFile) return res.status(404).json({ message: 'file not found' });
        
        await v2.uploader.destroy(getFile.files.public_id, { resource_type: getFile.files.resource_type });
        await Data.deleteOne({ category: "files", _id: getFileId });
        
        res.status(200).json({ message: 'file deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal sever error' });
    }
}

export async function getAllFiles(req: AuthRequest, res: Response) {
    try {
        const getUserId = req.user?.user_id;
        const searched = req.query.search as string | undefined;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        if (searched === undefined) {
            const getAllFiles = await Data.find({ 
                category: "files", 
                user_id: getUserId 
            }).limit(limit).skip(skip);

            res.status(200).json(getAllFiles);
        } else {
            const getAllFiles = await Data.find({ 
                category: "files", 
                file_name: { $regex: new RegExp(searched, 'i') }, 
                user_id: getUserId 
            }).limit(limit).skip(skip);

            res.status(200).json(getAllFiles);
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getSelectedFiles(req: Request, res: Response) {
    try {
        const getTargetedFile = await Data.find({ _id: req.params._id, category: "files" });

        res.status(200).json(getTargetedFile);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function moveFromFolder(req: Request, res: Response) {
    try {
        await Data.updateOne({ _id: req.params._id, category: "files" }, { 
            $set: { folder_id: null }
        });
        res.status(200).json({ message: 'removed 1 file' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}