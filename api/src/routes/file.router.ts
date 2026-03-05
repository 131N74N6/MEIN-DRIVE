import { Router } from "express";
import { 
    deleteAllFiles, deleteSelectedFile, getAllFiles, addNewFile, getFavoritedFiles,
    addToFavorite, removeFromFavorite, addToFolder, getFilesInFolder, isFileFavorited,
    deleteAllFilesInFolder, moveOutsideFolder
} from "../controllers/file.controller";
import { checkOwnership, verifyToken } from "../middleware/auth.middleware";

const fileRoutes = Router();

fileRoutes.delete('/erase-all/:user_id', verifyToken, checkOwnership, deleteAllFiles);
fileRoutes.delete('/erase/:_id', verifyToken, deleteSelectedFile);
fileRoutes.delete('/erase-all-in-folder/:folder_name', verifyToken, deleteAllFilesInFolder)

fileRoutes.get('/get-all/:user_id', verifyToken, checkOwnership, getAllFiles);
fileRoutes.get('/favorited/:user_id', verifyToken, checkOwnership, getFavoritedFiles);
fileRoutes.get('/is-favorited/:_id', verifyToken, isFileFavorited);
fileRoutes.get('/files-in-folder/:folder_name/:user_id', verifyToken, checkOwnership, getFilesInFolder);

fileRoutes.post('/add', verifyToken, addNewFile);

fileRoutes.put('/add-to-favorited/:_id', verifyToken, addToFavorite);
fileRoutes.put('/remove-from-favorited/:_id', verifyToken, removeFromFavorite);
fileRoutes.put('/add-to-folder/:_id', verifyToken, addToFolder);
fileRoutes.put('/remove-from-folder/:_id', verifyToken, moveOutsideFolder);

export default fileRoutes;