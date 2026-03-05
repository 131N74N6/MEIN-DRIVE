import { Request, Response } from "express";
import { Folder } from "../models/folder.model";
import { File } from "../models/file.model";
import { v2 } from "cloudinary";

export async function addToFavorite(req: Request, res: Response) {
    try {
        await Folder.updateOne({ _id: req.params._id }, {
            $set: { is_favorited: true }
        });
        res.status(200).json({ message: 'add to favorited' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function changeFolderName(req: Request, res: Response) {
    try {
        if (!req.body.folder_name) {
            return res.status(400).json({ message: 'folder name required' });
        }

        await Folder.updateOne({ _id: req.params._id }, {
            $set: { folder_name: req.body.folder_name }
        });
        
        res.status(200).json({ message: 'folder name changed' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllFolders(req: Request, res: Response) {
    try {
        const getCurrentUserId = req.params.user_id;
        const getAllFiles = await File.find({ user_id: getCurrentUserId, folder_name: { $ne: null, $exists: true } });

        const deletePromise = getAllFiles.map((file) => {
            return v2.uploader.destroy(file.files.public_id, { resource_type: file.files.resource_type });
        });

        await Promise.all(deletePromise);
        await Promise.all([
            File.deleteMany({ user_id: getCurrentUserId, folder_name: { $ne: null, $exists: true } }),
            Folder.deleteMany({ user_id: getCurrentUserId })
        ]);

        res.status(200).json({ message: 'all folders deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteOneFolder(req: Request, res: Response) {
    try {
        const getCurrentFolder = req.params.folder_name;
        const getAllFiles = await File.find({ user_id: req.params.user_id, folder_name: getCurrentFolder });

        const deletePromise = getAllFiles.map((file) => {
            return v2.uploader.destroy(file.files.public_id, { resource_type: file.files.resource_type });
        });

        await Promise.all(deletePromise);
        await Promise.all([
            await File.deleteMany({ folder_name: getCurrentFolder }),
            await Folder.deleteOne({ folder_name: getCurrentFolder })
        ]);

        res.status(200).json({ message: 'one folder deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getCurrentUserFolder(req: Request, res: Response) {
    try {
        const searched = req.query.search as string | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        if (searched !== undefined) {
            const getAllFolders = await Folder.find({ 
                user_id: req.params.user_id,
                folder_name: { $regex: new RegExp(searched, 'i') }
            }).limit(limit).skip(skip);
            res.status(200).json(getAllFolders);
        } else {
            const getAllFolders = await Folder.find({ user_id: req.params.user_id }).limit(limit).skip(skip);
            res.status(200).json(getAllFolders);
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function geFavoritedFolders(req: Request, res: Response) {
    try {
        const searched = req.query.search as string | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        if (searched !== undefined) {
            const getFavoriteFolders = await Folder.find({ 
                user_id: req.params.user_id,
                is_favorited: true,
                folder_name: { $regex: new RegExp(searched, 'i') }
            }).limit(limit).skip(skip);
            res.status(200).json(getFavoriteFolders);
        } else {
            const getFavoriteFolders = await Folder.find({ user_id: req.params.user_id, is_favorited: true }).limit(limit).skip(skip);
            res.status(200).json(getFavoriteFolders);
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function isFolderFavorited(req: Request, res: Response) {
    try {
        const getTargetedFolder = await Folder.find({ _id: req.params._id, is_favorited: true });
        res.status(200).json(!!getTargetedFolder.length);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function makeNewFolder(req: Request, res: Response) {
    try {
        if (!req.body.folder_name) return res.status(400).json({ message: 'folder name is required' });
        
        const newFolder = new Folder(req.body);
        await newFolder.save();
        res.status(200).json({ message: 'new folder created' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function removeFromFavorite(req: Request, res: Response) {
    try {
        await Folder.updateOne({ _id: req.params._id }, {
            $set: { is_favorited: false }
        });
        res.status(200).json({ message: 'remove from favorited' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}