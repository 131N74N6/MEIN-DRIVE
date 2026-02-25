import { Request, response, Response } from 'express';
import { Favorited } from '../models/favorited.model';
import { File } from '../models/file.model';

export async function addToFavorite(req: Request, res: Response) {
    try {
        const newData = new Favorited(req.body);
        await newData.save();
        res.status(201).json({ message: 'successfully added to favorited' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getCurrentUserFavorite(req: Request, res: Response) {
    try {
        const getCurrentUserId = req.params.user_id;
        const searched = req.query.search as string | undefined;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit

        if (searched === undefined) {
            const getAllData = await Favorited.find({ user_id: getCurrentUserId }).limit(limit).skip(skip);
            res.json(getAllData);
        } else {
            const getAllData = await Favorited.find({ 
                file_name: { $regex: new RegExp(searched, 'i') }, 
                user_id: getCurrentUserId 
            }).limit(limit).skip(skip);
            
            res.json(getAllData);
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllFavoriteFiles(req: Request, res: Response) {
    try {
        const favoriteFiles = await File.find({ user_id: req.params.user_id });
        if (favoriteFiles.length < 1) return response.status(400).json({ message: 'no files added' });

        await Favorited.deleteMany({ user_id: req.params.user_id });
        res.status(200).json({ message: 'erase from favorited' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteFavoriteFile(req: Request, res: Response) {
    try {
        await Favorited.deleteOne({ file_id: req.params.id });
        res.status(200).json({ message: 'erase from favorited' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function isInFavorite(req: Request, res: Response) {
    try {
        const { user_id, file_id } = req.query;
        const isFavorite = await Favorited.find({ user_id: user_id, file_id:file_id });
        res.json(!!isFavorite.length);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}