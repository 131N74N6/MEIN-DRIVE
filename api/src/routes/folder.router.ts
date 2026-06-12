import express from 'express';
import { checkOwnership, verifyToken } from '../middleware/auth.middleware';
import { 
    addToFavorite, changeFolderName, deleteAllChildFolders, deleteAllFolders, deleteOneChildFolder, deleteOneFolder, 
    geFavoritedFolders, getChildFolders, getCurrentUserFolder, getParentFolderOnly, isFolderFavorited, makeChildFolder, 
    makeNewFolder, removeFromFavorite 
} from '../controllers/folder.controller';

const folderRoutes = express.Router();

folderRoutes.delete('/rm/:_id', verifyToken, deleteOneFolder);
folderRoutes.delete('/rm-all/:user_id', verifyToken, checkOwnership, deleteAllFolders);
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

export default folderRoutes;