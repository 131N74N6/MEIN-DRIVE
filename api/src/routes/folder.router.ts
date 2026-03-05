import express from 'express';
import { checkOwnership, verifyToken } from '../middleware/auth.middleware';
import { 
    addToFavorite, changeFolderName, deleteAllFolders, deleteOneFolder, 
    geFavoritedFolders, getCurrentUserFolder, isFolderFavorited, makeNewFolder, removeFromFavorite 
} from '../controllers/folder.controller';

const folderRouters = express.Router();

folderRouters.delete('/delete/:user_id/:folder_name', verifyToken, deleteOneFolder);
folderRouters.delete('/deletes/:user_id', verifyToken, checkOwnership, deleteAllFolders);

folderRouters.get('/get/:user_id', verifyToken, checkOwnership, getCurrentUserFolder);
folderRouters.get('/favorited/:user_id', verifyToken, checkOwnership, geFavoritedFolders);
folderRouters.get('/is-favorited/:_id', verifyToken, isFolderFavorited);

folderRouters.post('/make', verifyToken, makeNewFolder);

folderRouters.put('/change/:_id', verifyToken, changeFolderName);
folderRouters.put('/add-to-favorited/:_id', verifyToken, addToFavorite);
folderRouters.put('/remove-from-favorited/:_id', verifyToken, removeFromFavorite);

export default folderRouters;