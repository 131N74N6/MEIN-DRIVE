import { Router } from "express";
import { 
    deleteAllFiles, deleteSelectedFile, getAllFiles, addNewFile, getFavoritedFiles,
    addToFavorite, removeFromFavorite, addToFolder, getFilesInFolder, isFileFavorited,
    deleteAllFilesInFolder, moveOutsideFolder
} from "../controllers/file.controller";
import { verifyToken } from "../middleware/auth.middleware";

const fileRoutes = Router();

fileRoutes.delete('/rm-all', verifyToken, deleteAllFiles);
fileRoutes.delete('/rm/:_id', verifyToken, deleteSelectedFile);
fileRoutes.delete('/rm-all-in-folder/:folder_id', verifyToken, deleteAllFilesInFolder)

fileRoutes.get('/all', verifyToken, getAllFiles);
fileRoutes.get('/favorited', verifyToken, getFavoritedFiles);
fileRoutes.get('/is-favorited/:_id', verifyToken, isFileFavorited);
fileRoutes.get('/files-in-folder/:folder_id', verifyToken, getFilesInFolder);

fileRoutes.post('/add', verifyToken, addNewFile);

fileRoutes.put('/add-to-favorited/:_id', verifyToken, addToFavorite);
fileRoutes.put('/remove-from-favorited/:_id', verifyToken, removeFromFavorite);
fileRoutes.put('/add-to-folder/:_id', verifyToken, addToFolder);
fileRoutes.put('/remove-from-folder/:_id', verifyToken, moveOutsideFolder);

export default fileRoutes;