import { Request, Response } from 'express';
import { Favorited } from '../models/favorited.model';

async function addToFavorite(req: Request, res: Response) {
    try {
        const newData = new Favorited(req.body);
        await newData.save();
        res.status(201).json({ message: 'successfully added to favorited' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function getCurrentUserFavorite(req: Request, res: Response): Promise<void> {
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

async function deleteAllFavoriteFiles(req: Request, res: Response): Promise<void> {
    try {
        await Favorited.deleteMany({ user_id: req.params.user_id });
        res.status(200).json({ message: 'erase from favorited' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function deleteFavoriteFile(req: Request, res: Response): Promise<void> {
    try {
        await Favorited.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'erase from favorited' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export { addToFavorite, deleteAllFavoriteFiles, deleteFavoriteFile, getCurrentUserFavorite }