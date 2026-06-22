import { Request, Response } from "express";
import { Data } from "../models/data.model";
import { v2 } from "cloudinary";
import { AuthRequest } from "../middleware/auth.middleware";
import mongoose from "mongoose";

export async function changeFolderName(req: AuthRequest, res: Response) {
    try {
        const isFolderNameExist = await Data.findOne({ 
            category: "folders", 
            folder_name: req.body.folder_name, 
            user_id: req.user?.user_id 
        });

        if (isFolderNameExist) return res.status(409).json({ message: 'folder name already exist' });
        
        if (!req.body.folder_name) return res.status(400).json({ message: 'folder name required' });

        await Data.updateOne({ _id: req.params._id, category: "folders" }, {
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

        const getAllFolders = await Data.find({ category: "folders", user_id: getCurrentUserId });
        if (getAllFolders.length === 0) return res.status(404).json({ message: 'no folders found' });
        
        const folderIds = getAllFolders.map((folder) => folder._id);
        const getAllFiles = await Data.find({ category: "files", user_id: getCurrentUserId, folder_id: { $in: folderIds } });

        const deletePromise = getAllFiles.map((file) => {
            return v2.uploader.destroy(file.files.public_id, { resource_type: file.files.resource_type });
        });

        await Promise.all([
            ...deletePromise,
            Data.deleteMany({ category: "files", folder_id: { $in: folderIds }, user_id: getCurrentUserId }),
            Data.deleteMany({ _id: { $in: folderIds }, category: "folders", user_id: getCurrentUserId })
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

        const folderTree = await Data.aggregate([
            { $match: { 
                _id: new mongoose.Types.ObjectId(getParentFolderId), 
                category: "folders"
            }},
            { $graphLookup: {
                from: "datas", 
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parent_folder_id",
                as: "descendants"
            }}
        ]);

        if (folderTree.length === 0) return res.status(404).json({ message: 'folder not found' });

        const descendants = folderTree[0].descendants || [];
        const descendantIds = descendants.map((f: any) => f._id.toString());

        const getAllFiles = await Data.find({ category: "files", user_id: getCurrentUserId, folder_id: { $in: descendantIds } });

        const deletePromise = getAllFiles.map((file) => {
            return v2.uploader.destroy(file.files.public_id, { resource_type: file.files.resource_type });
        });

        await Promise.all([
            ...deletePromise,
            Data.deleteMany({ category: "files", user_id: getCurrentUserId, folder_id: { $in: descendantIds } }),
            Data.deleteMany({ _id: { $in : descendantIds }, category: "folders", user_id: getCurrentUserId })
        ]);

        res.status(200).json({ message: 'all folders deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteOneFolder(req: Request, res: Response) {
    try {
        const getFolderId = req.params._id;

        const folderTree = await Data.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(getFolderId) } },
            { $graphLookup: {
                from: "datas",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parent_folder_id",
                as: "descendants"
            }}
        ]);

        const descendants = folderTree[0].descendants || [];
        const allFolderIds = [getFolderId, ...descendants.map((f: any) => f._id.toString())];

        const getAllFiles = await Data.find({ category: "files", folder_id: { $in: allFolderIds } });

        const deletePromise = getAllFiles.map((file) => {
            return v2.uploader.destroy(file.files.public_id, { resource_type: file.files.resource_type });
        });

        await Promise.all([
            ...deletePromise,
            Data.deleteMany({ category: "files", folder_id: { $in: allFolderIds } }),
            Data.deleteMany({ _id: { $in: allFolderIds }, category: "folders" })
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
            const getAllFolders = await Data.find({ 
                category: "folders",
                user_id: req.user?.user_id,
                folder_name: { $regex: new RegExp(searched, 'i') }
            }).limit(limit).skip(skip);

            res.status(200).json(getAllFolders);
        } else {
            const getAllFolders = await Data.find({ 
                category: "folders",
                user_id: req.user?.user_id 
            }).limit(limit).skip(skip);

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

        const getAllFolders = await Data.find({ 
            category: "folders",
            user_id: req.user?.user_id, 
            parent_folder_id: { $exists: false } 
        }).limit(limit).skip(skip);

        res.status(200).json(getAllFolders);        
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function makeNewFolder(req: AuthRequest, res: Response) {
    try {
        const isFolderNameExist = await Data.findOne({ 
            category: "folders", 
            folder_name: req.body.folder_name, 
            user_id: req.user?.user_id 
        });

        if (isFolderNameExist) return res.status(409).json({ message: 'folder name already exist' });
        if (!req.body.folder_name) return res.status(400).json({ message: 'folder name is required' });
        
        const newFolder = new Data({
            category: "folders",
            created_at: req.body.created_at,
            folder_name: req.body.folder_name,
            user_id: req.body.user_id
        });
        
        await newFolder.save();
        res.status(200).json({ message: 'new folder created' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function makeChildFolder(req: AuthRequest, res: Response) {
    try {
        const isFolderNameExist = await Data.findOne({ 
            category: "folders", 
            folder_name: req.body.folder_name, 
            user_id: req.user?.user_id, 
            parent_folder_id: req.params.parent_folder_id 
        });

        if (isFolderNameExist) return res.status(409).json({ message: 'folder name already exist' });
        if (!req.body.folder_name) return res.status(400).json({ message: 'folder name is required' });
        
        const newFolder = new Data({
            category: "folders", 
            created_at: req.body.created_at,
            folder_name: req.body.folder_name,
            is_favorited: req.body.is_favorited,
            parent_folder_id: req.body.parent_folder_id,
            user_id: req.body.user_id
        });

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

        const folderToMove = await Data.findOne({ _id: folderId, user_id: currentUserId, category: "folders" });
        const targetParent = await Data.findOne({ _id: targetParentId, user_id: currentUserId, category: "folders" });

        if (folderId === targetParentId) return res.status(400).json({ message: "Cannot move folder into itself" });

        const descendantCheck = await Data.aggregate([
            { $match: { _id: folderToMove?._id, category: "folders" } },
            { $graphLookup: {
                from: "folders",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parent_folder_id",
                as: "descendants",
                restrictSearchWithMatch: { _id: targetParent?._id }
            }}
        ]);
        
        if (descendantCheck[0]?.descendants?.length > 0) {
            return res.status(400).json({ 
                message: "Cannot move folder into its own descendant (would create circular reference)" 
            });
        }

        const duplicateInTarget = await Data.findOne({
            category: "folders",
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

        await Data.updateOne({ _id: req.params._id, category: "folders" }, { 
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

        const folderToMove = await Data.findOne({ _id: folderId, category: "folders", user_id: currentUserId });

        const duplicateAtRoot = await Data.findOne({
            category: "folders",
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
        
        await Data.updateOne({ _id: req.params._id, category: "folders" }, { 
            $unset: { parent_folder_id: '' }
        });
        
        res.status(200).json({ message: 'file removed' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}