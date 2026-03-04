import { Request, Response } from "express";
import { Folder } from "../models/folder.model";

export async function changeFolderName(req: Request, res: Response) {
    try {
        if (!req.body.folder_name) {
            return res.status(400).json({ message: 'folder name required' });
        }

        await Folder.updateOne({ _id: req.params._id }, {
            $set: { folder_name: req.body.folder_name }
        });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllFolders(req: Request, res: Response) {
    try {
        await Folder.updateOne({ user_id: req.params.user_id }, {
            $set: { files: [] }
        });
        await Folder.deleteMany({ user_id: req.params.user_id });
        res.status(200).json({ message: 'all folders deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteOneFolder(req: Request, res: Response) {
    try {
        await Folder.updateOne({ _id: req.params._id }, {
            $set: { files: [] }
        });
        await Folder.deleteOne({ _id: req.params._id });
        res.status(200).json({ message: 'one folder deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getCurrentUserFolder(req: Request, res: Response) {
    try {
        const getUserId = req.params.user_id;
        const searched = req.query.searched as string | undefined;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        if (searched) {
            const getFolders = await Folder.find(
                { user_id: getUserId, folder_name: new RegExp(searched, 'i')}
            ).limit(limit).skip(skip).sort({ created_at: 1 });
            res.status(200).json(getFolders);
        } else {
            const getFolders = await Folder.find({ user_id: getUserId }).limit(limit).skip(skip);
            res.status(200).json(getFolders);
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function insertFileToFolder(req: Request, res: Response) {
    try {
        await Folder.updateOne({ _id: req.params._id }, { 
            $push: { files: req.body.files }
        });
        res.status(200).json({ message: 'added 1 file' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function makeNewFolder(req: Request, res: Response) {
    try {
        const newFolder = new Folder(req.body);
        await newFolder.save();
        res.status(200).json({ message: 'new folder created' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}