import { Request, Response } from "express";
import { Folder } from "../models/folder.model";
import { File } from "../models/file.model";
import { v2 } from "cloudinary";
import { AuthRequest } from "../middleware/auth.middleware";
import mongoose from "mongoose";

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

export async function changeFolderName(req: AuthRequest, res: Response) {
    try {
        const isFolderNameExist = await Folder.findOne({ folder_name: req.body.folder_name, user_id: req.user?.user_id });
        if (isFolderNameExist) return res.status(409).json({ message: 'folder name already exist' });
        
        if (!req.body.folder_name) return res.status(400).json({ message: 'folder name required' });

        await Folder.updateOne({ _id: req.params._id }, {
            $set: { folder_name: req.body.folder_name }
        });
        
        res.status(200).json({ message: 'folder name changed' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllFolders(req: AuthRequest, res: Response) {
    try {
        const getCurrentUserId = req.user?.user_id;

        const getAllFolders = await Folder.find({ user_id: getCurrentUserId });
        if (getAllFolders.length === 0) return res.status(404).json({ message: 'no folders found' });
        
        const folderIds = getAllFolders.map((folder) => folder._id);
        const getAllFiles = await File.find({ user_id: getCurrentUserId, folder_id: { $in: folderIds } });

        const deletePromise = getAllFiles.map((file) => {
            return v2.uploader.destroy(file.files.public_id, { resource_type: file.files.resource_type });
        });

        await Promise.all([
            ...deletePromise,
            File.deleteMany({ user_id: getCurrentUserId, folder_id: { $in: folderIds } }),
            Folder.deleteMany({ user_id: getCurrentUserId })
        ]);

        res.status(200).json({ message: 'all folders deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllChildFolders(req: AuthRequest, res: Response) {
    try {
        const getCurrentUserId = req.user?.user_id;
        const getParentFolderId = req.params.parent_folder_id;

        const folderTree = await Folder.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(getParentFolderId) } },
            { $graphLookup: {
                from: "folders", 
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parent_folder_id",
                as: "descendants"
            }}
        ]);

        if (folderTree.length === 0) return res.status(404).json({ message: 'folder not found' });

        const descendants = folderTree[0].descendants || [];
        const descendantIds = descendants.map((f: any) => f._id.toString());

        const getAllFiles = await File.find({ user_id: getCurrentUserId, folder_id: { $in: descendantIds } });

        const deletePromise = getAllFiles.map((file) => {
            return v2.uploader.destroy(file.files.public_id, { resource_type: file.files.resource_type });
        });

        await Promise.all([
            ...deletePromise,
            File.deleteMany({ user_id: getCurrentUserId, folder_id: { $in: descendantIds } }),
            Folder.deleteMany({ _id: { $in : descendantIds } })
        ]);

        res.status(200).json({ message: 'all folders deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteOneFolder(req: Request, res: Response) {
    try {
        const getFolderId = req.params._id;

        const folderTree = await Folder.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(getFolderId) } },
            { $graphLookup: {
                from: "folders",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parent_folder_id",
                as: "descendants"
            }}
        ]);

        const descendants = folderTree[0].descendants || [];
        const allFolderIds = [getFolderId, ...descendants.map((f: any) => f._id.toString())];

        const getAllFiles = await File.find({ folder_id: { $in: allFolderIds } });

        const deletePromise = getAllFiles.map((file) => {
            return v2.uploader.destroy(file.files.public_id, { resource_type: file.files.resource_type });
        });

        await Promise.all([
            ...deletePromise,
            File.deleteMany({ folder_id: { $in: allFolderIds } }),
            Folder.deleteMany({ _id: { $in: allFolderIds } })
        ]);

        res.status(200).json({ message: 'one folder deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getCurrentUserFolder(req: AuthRequest, res: Response) {
    try {
        const searched = req.query.search as string | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        if (searched !== undefined) {
            const getAllFolders = await Folder.find({ 
                user_id: req.user?.user_id,
                folder_name: { $regex: new RegExp(searched, 'i') }
            }).limit(limit).skip(skip);

            res.status(200).json(getAllFolders);
        } else {
            const getAllFolders = await Folder.find({ user_id: req.user?.user_id }).limit(limit).skip(skip);
            res.status(200).json(getAllFolders);
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getParentFolderOnly(req: AuthRequest, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        const getAllFolders = await Folder.find({ 
            user_id: req.user?.user_id, 
            parent_folder_id: { $exists: false } 
        }).limit(limit).skip(skip);

        res.status(200).json(getAllFolders);        
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getChildFolders(req: AuthRequest, res:Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        const getAllFolders = await Folder.find({ 
            user_id: req.user?.user_id, 
            parent_folder_id: { $eq: req.params.parent_folder_id, $exists: true } 
        }).limit(limit).skip(skip);

        res.status(200).json(getAllFolders);        
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function geFavoritedFolders(req: AuthRequest, res: Response) {
    try {
        const searched = req.query.search as string | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        if (searched !== undefined) {
            const getFavoriteFolders = await Folder.find({ 
                user_id: req.user?.user_id,
                is_favorited: true,
                folder_name: { $regex: new RegExp(searched, 'i') }
            }).limit(limit).skip(skip);
            
            res.status(200).json(getFavoriteFolders);
        } else {
            const getFavoriteFolders = await Folder.find({ user_id: req.user?.user_id, is_favorited: true }).limit(limit).skip(skip);
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

export async function makeNewFolder(req: AuthRequest, res: Response) {
    try {
        const isFolderNameExist = await Folder.findOne({ folder_name: req.body.folder_name, user_id: req.user?.user_id });
        if (isFolderNameExist) return res.status(409).json({ message: 'folder name already exist' });
        if (!req.body.folder_name) return res.status(400).json({ message: 'folder name is required' });
        
        const newFolder = new Folder(req.body);
        await newFolder.save();
        res.status(200).json({ message: 'new folder created' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function makeChildFolder(req: AuthRequest, res: Response) {
    try {
        const isFolderNameExist = await Folder.findOne({ folder_name: req.body.folder_name, user_id: req.user?.user_id, parent_folder_id: req.params.parent_folder_id });
        if (isFolderNameExist) return res.status(409).json({ message: 'folder name already exist' });
        if (!req.body.folder_name) return res.status(400).json({ message: 'folder name is required' });
        
        const newFolder = new Folder(req.body);
        await newFolder.save();
        res.status(200).json({ message: 'new folder created' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function moveInsideParentFolder(req: AuthRequest, res: Response) {
    try {
        const currentUserId = req.user?.user_id;
        const folderId = req.params._id;
        const targetParentId = req.body.parent_folder_id;

        const folderToMove = await Folder.findOne({ _id: folderId, user_id: currentUserId });
        const targetParent = await Folder.findOne({ _id: targetParentId, user_id: currentUserId });

        if (folderId === targetParentId) return res.status(400).json({ message: "Cannot move folder into itself" });

        const descendantCheck = await Folder.aggregate([
            { $match: { _id: folderToMove?._id } },
            {
                $graphLookup: {
                    from: "folders",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parent_folder_id",
                    as: "descendants",
                    restrictSearchWithMatch: { _id: targetParent?._id }
                }
            }
        ]);
        
        if (descendantCheck[0]?.descendants?.length > 0) {
            return res.status(400).json({ 
                message: "Cannot move folder into its own descendant (would create circular reference)" 
            });
        }

        const duplicateInTarget = await Folder.findOne({
            folder_name: folderToMove?.folder_name,
            parent_folder_id: targetParentId,
            user_id: currentUserId,
            _id: { $ne: folderId }
        });

        if (duplicateInTarget) {
            return res.status(409).json({ 
                message: `Folder with name "${folderToMove?.folder_name}" already exists in the target folder` 
            });
        }

        await Folder.updateOne({ _id: req.params._id }, { 
            $set: { parent_folder_id: req.body.parent_folder_id }
        });

        res.status(200).json({ message: 'file moved' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function moveOutsideParentFolder(req: AuthRequest, res: Response) {
    try {
        const currentUserId = req.user?.user_id;
        const folderId = req.params._id;

        const folderToMove = await Folder.findOne({ _id: folderId, user_id: currentUserId });

        const duplicateAtRoot = await Folder.findOne({
            folder_name: folderToMove?.folder_name,
            parent_folder_id: { $exists: false }, 
            user_id: currentUserId,
            _id: { $ne: folderId }
        });

        if (duplicateAtRoot) {
            return res.status(409).json({ 
                message: `Folder with name "${folderToMove?.folder_name}" already exists at root level` 
            });
        }
        
        await Folder.updateOne({ _id: req.params._id }, { 
            $unset: { parent_folder_id: '' }
        });
        
        res.status(200).json({ message: 'file removed' });
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