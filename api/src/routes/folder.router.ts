import express from 'express';
import { checkOwnership, verifyToken } from '../middleware/auth.middleware';
import { 
    addToFavorite, changeFolderName, deleteAllFolders, deleteOneFolder, 
    geFavoritedFolders, getCurrentUserFolder, isFolderFavorited, makeNewFolder, removeFromFavorite 
} from '../controllers/folder.controller';

const folderRouter = express.Router();

folderRouter.delete('/delete/:user_id/:folder_name', verifyToken, deleteOneFolder);
folderRouter.delete('/deletes/:user_id', verifyToken, checkOwnership, deleteAllFolders);

folderRouter.get('/get/:user_id', verifyToken, checkOwnership, getCurrentUserFolder);
folderRouter.get('/favorited/:user_id', verifyToken, checkOwnership, geFavoritedFolders);
folderRouter.get('/is-favorited/:_id/:is_favorited', verifyToken, isFolderFavorited);

folderRouter.post('/make', verifyToken, makeNewFolder);

folderRouter.put('/change/:_id', verifyToken, changeFolderName);
folderRouter.put('/add-to-favorited/:_id', verifyToken, addToFavorite);
folderRouter.put('/remove-from-favorited/:_id', verifyToken, removeFromFavorite);

export default folderRouter;