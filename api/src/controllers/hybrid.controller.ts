import { Request, Response } from "express";
import { Data } from "../models/data.model";
import { AuthRequest } from "../middleware/auth.middleware";

export async function addToFavorite(req: Request, res: Response) {
    try {
        await Data.updateOne({ _id: req.params._id }, {
            $set: { is_favorited: true }
        });
        res.status(200).json({ message: 'added to favorited' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getAllData(req: AuthRequest, res: Response) {
    try {
        const getUserId = req.user?.user_id;
        const searched = req.query.search as string | undefined;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        if (searched === undefined) {
            const getAll = await Data.find({  user_id: getUserId }).limit(limit).skip(skip).sort({ category: -1 });

            res.status(200).json(getAll);
        } else {
            const getAll = await Data.find({ 
                $or: [
                    { file_name: { $regex: new RegExp(searched, 'i') } }, 
                    { folder_name: { $regex: new RegExp(searched, 'i') } }
                ],
                user_id: getUserId 
            }).limit(limit).skip(skip).sort({ category: -1 });

            res.status(200).json(getAll);
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getAllFavoritedData(req: AuthRequest, res: Response) {
    try {
        const getUserId = req.user?.user_id;
        const searched = req.query.search as string | undefined;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        if (searched === undefined) {
            const getAll = await Data.find({ 
                is_favorited: true,
                parent_folder_id: { $exists: false },
                user_id: getUserId 
            }).limit(limit).skip(skip).sort({ category: -1 });

            res.status(200).json(getAll);
        } else {
            const getAll = await Data.find({ 
                is_favorited: true,
                $or: [
                    { file_name: { $regex: new RegExp(searched, 'i') } }, 
                    { folder_name: { $regex: new RegExp(searched, 'i') } }
                ], 
                parent_folder_id: { $exists: false },
                user_id: getUserId 
            }).limit(limit).skip(skip).sort({ category: -1 });

            res.status(200).json(getAll);
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getChildFoldersAndFiles(req: AuthRequest, res: Response) {
    try {
        const getUserId = req.user?.user_id;
        const getParentFolderId = req.params.parent_folder_id;
        const searched = req.query.search as string | undefined;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        if (searched === undefined || searched === "") {
            const getAll = await Data.find({ 
                $or: [
                    { folder_id: { $eq: getParentFolderId, $exists: true } },
                    { parent_folder_id: { $eq: getParentFolderId, $exists: true } }
                ],
                user_id: getUserId 
            }).limit(limit).skip(skip).sort({ category: -1 });

            res.status(200).json(getAll);
        } else {
            const getAll = await Data.find({ 
                $or: [ 
                    { file_name: { $regex: new RegExp(searched, 'i') } }, 
                    { folder_id: { $eq: getParentFolderId, $exists: true } },
                    { folder_name: { $regex: new RegExp(searched, 'i') } },
                    { parent_folder_id: { $eq: getParentFolderId, $exists: true } }
                ], 
                user_id: getUserId 
            }).limit(limit).skip(skip).sort({ category: -1 });

            res.status(200).json(getAll);
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function isFavorited(req: Request, res: Response) {
    try {
        const dataTarget = await Data.find({ _id: req.params._id, is_favorited: true });
        res.status(200).json(!!dataTarget.length);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function removeFromFavorite(req: Request, res: Response) {
    try {
        await Data.updateOne({ _id: req.params._id }, {
            $set: { is_favorited: false }
        });
        res.status(200).json({ message: 'remove from favorited' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}