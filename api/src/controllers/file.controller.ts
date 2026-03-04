import { Request, Response } from "express";
import { File } from "../models/file.model";
import { v2 } from "cloudinary";

export async function addNewFile(req: Request, res: Response) {
    try {
        if (!req.body.files) return res.status(400).json({ message: 'Please select at least one file' });
        const newFile = new File(req.body);

        await newFile.save();
        res.status(201).json({ message: 'new file added' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function addToFavorite(req: Request, res: Response) {
    try {
        await File.updateOne({ _id: req.params._id }, {
            $set: { is_favorited: true }
        });
        res.status(200).json({ message: 'add to favorited' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function addToFolder(req: Request, res: Response) {
    try {
        await File.updateOne({ _id: req.params._id }, { 
            $set: { folder_name: req.body.folder_name }
        });
        res.status(200).json({ message: 'added 1 file' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllFilesInFolder(req: Request, res: Response) {
    try {
        const getCurrentFolder = req.params.folder_name;
        const getAllFiles = await File.find({ folder_name: getCurrentFolder });

        if (getAllFiles.length === 0) return res.status(400).json({ message: "no files added" });

        const deletePromise = getAllFiles.map((userFile) => {
            return v2.uploader.destroy(userFile.files.public_id, { resource_type: userFile.files.resource_type });
        });

        await Promise.all(deletePromise);
        await Promise.all([
            File.deleteMany({ folder_name: getCurrentFolder }),
        ]);

        res.status(200).json({ message: 'file deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllFiles(req: Request, res: Response) {
    try {
        const getUserId = req.params.user_id;
        const findUserFiles = await File.find({ user_id: getUserId });

        if (findUserFiles.length === 0) return res.status(400).json({ message: "no files added" });

        const deletePromise = findUserFiles.map((userFile) => {
            return v2.uploader.destroy(userFile.files.public_id, { resource_type: userFile.files.resource_type });
        });

        await Promise.all(deletePromise);
        await Promise.all([
            File.deleteMany({ user_id: getUserId }),
        ]);

        res.status(200).json({ message: 'file deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteSelectedFile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
    try {
        const getFileId = req.params._id;
        const getFile = await File.findOne({ _id: getFileId });

        if (!getFile) return res.status(404).json({ message: 'file not found' });
        
        await v2.uploader.destroy(getFile.files.public_id, { resource_type: getFile.files.resource_type });
        await Promise.all([
            File.deleteOne({ _id: getFileId }),
        ]);
        
        res.status(200).json({ message: 'file deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal sever error' });
    }
}

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

export async function getFileInFolder(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.limit as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;
        const searched = req.query.search as string | undefined;

        if (searched !== undefined) {
            const getAllFiles = await File.find({ 
                folder_name: req.params.folder_name, 
                file_name: { $regex: new RegExp(searched, 'i') }, 
                user_id: req.params.user_id 
            }).limit(limit).skip(skip);

            res.status(200).json(getAllFiles);
        } else {
            const getAllFiles = await File.find({ 
                folder_name: req.params.folder_name, 
                user_id: req.params.user_id 
            }).limit(limit).skip(skip);

            res.status(200).json(getAllFiles);
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getFavoritedFiles(req: Request, res: Response) {
    try {
        const getUserId = req.params.user_id;
        const searched = req.query.search as string | undefined;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        if (searched === undefined) {
            const getFavoriteFiles = await File.find({ user_id: getUserId, is_favorited: true }).limit(limit).skip(skip);
            res.json(getFavoriteFiles);
        } else {
            const getFavoriteFiles = await File.find({ 
                file_name: { $regex: new RegExp(searched, 'i') }, 
                user_id: getUserId, 
                is_favorited: true
            }).limit(limit).skip(skip);

            res.json(getFavoriteFiles);
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function isFileFavorited(req: Request, res: Response) {
    try {
        const getTargetedFile = await File.find({ _id: req.params._id, is_favorited: req.params.is_favorited });
        res.status(200).json(!!getTargetedFile.length);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function removeFromFavorite(req: Request, res: Response) {
    try {
        await File.updateOne({ _id: req.params._id }, {
            $set: { is_favorited: false }
        });
        res.status(200).json({ message: 'remove from favorited' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}