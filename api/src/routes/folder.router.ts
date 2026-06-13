import express from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { 
    addToFavorite, changeFolderName, deleteAllChildFolders, deleteAllFolders, deleteOneChildFolder, deleteOneFolder, 
    geFavoritedFolders, getChildFolders, getCurrentUserFolder, getParentFolderOnly, isFolderFavorited, makeChildFolder, 
    makeNewFolder, moveInsideParentFolder, moveOutsideParentFolder, removeFromFavorite 
} from '../controllers/folder.controller';

const folderRoutes = express.Router();

folderRoutes.delete('/rm/:_id', verifyToken, deleteOneFolder);
folderRoutes.delete('/rm-all', verifyToken, deleteAllFolders);
folderRoutes.delete('/rm-child/:_id', verifyToken, deleteOneChildFolder);
folderRoutes.delete('/rm-all-childs/:parent_folder_id', verifyToken, deleteAllChildFolders);

folderRoutes.get('/all', verifyToken, getCurrentUserFolder);
folderRoutes.get('/parent-folder-only', verifyToken, getParentFolderOnly);
folderRoutes.get('/all-child-folder/:parent_folder_id', verifyToken, getChildFolders);
folderRoutes.get('/favorited', verifyToken, geFavoritedFolders);
folderRoutes.get('/is-favorited/:_id', verifyToken, isFolderFavorited);

folderRoutes.post('/make', verifyToken, makeNewFolder);
folderRoutes.post('/make-child/:parent_folder_id', verifyToken, makeChildFolder);

folderRoutes.put('/change/:_id', verifyToken, changeFolderName);
folderRoutes.put('/add-to-favorited/:_id', verifyToken, addToFavorite);
folderRoutes.put('/remove-from-favorited/:_id', verifyToken, removeFromFavorite);
folderRoutes.put('/move-inside/:_id', verifyToken, moveInsideParentFolder);
folderRoutes.put('/move-outside/:_id', verifyToken, moveOutsideParentFolder);

export default folderRoutes;