import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { 
    deleteAllFiles, deleteSelectedFile, getAllFiles, addNewFile, moveFromFolder, 
    deleteAllFilesInFolder, getSelectedFiles, changeFileName, addToFolder
} from "../controllers/file.controller";

const fileRoutes = Router();

fileRoutes.delete('/rm-all', verifyToken, deleteAllFiles);
fileRoutes.delete('/rm/:_id', verifyToken, deleteSelectedFile);
fileRoutes.delete('/rm-all-in-folder/:folder_id', verifyToken, deleteAllFilesInFolder);

fileRoutes.get('/all', verifyToken, getAllFiles);
fileRoutes.get('/selected/:_id', verifyToken, getSelectedFiles);

fileRoutes.post('/add', verifyToken, addNewFile);

fileRoutes.put('/remake/:_id', verifyToken, changeFileName);
fileRoutes.put('/add-to-folder/:_id', verifyToken, addToFolder);
fileRoutes.put('/remove-from-folder/:_id', verifyToken, moveFromFolder);

export default fileRoutes;