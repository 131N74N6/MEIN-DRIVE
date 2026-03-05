import express from 'express';
import { checkOwnership, verifyToken } from '../middleware/auth.middleware';
import { 
    addToFavorite, changeFolderName, deleteAllFolders, deleteOneFolder, 
    geFavoritedFolders, getCurrentUserFolder, isFolderFavorited, makeNewFolder, removeFromFavorite 
} from '../controllers/folder.controller';

const folderRoutes = express.Router();

folderRoutes.delete('/delete/:user_id/:folder_name', verifyToken, deleteOneFolder);
folderRoutes.delete('/deletes/:user_id', verifyToken, checkOwnership, deleteAllFolders);

folderRoutes.get('/get/:user_id', verifyToken, checkOwnership, getCurrentUserFolder);
folderRoutes.get('/favorited/:user_id', verifyToken, checkOwnership, geFavoritedFolders);
folderRoutes.get('/is-favorited/:_id', verifyToken, isFolderFavorited);

folderRoutes.post('/make', verifyToken, makeNewFolder);

folderRoutes.put('/change/:_id', verifyToken, changeFolderName);
folderRoutes.put('/add-to-favorited/:_id', verifyToken, addToFavorite);
folderRoutes.put('/remove-from-favorited/:_id', verifyToken, removeFromFavorite);

export default folderRoutes;