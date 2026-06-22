import { Router } from "express";
import { verifyToken } from '../middleware/auth.middleware';
import { 
    changeFolderName, deleteAllChildFolders, deleteAllFolders, deleteOneFolder, getCurrentUserFolder, 
    getParentFolderOnly, makeChildFolder, makeNewFolder,
    moveInsideParentFolder,
    moveOutsideParentFolder, 
} from '../controllers/folder.controller';

const folderRoutes = Router();

folderRoutes.delete('/rm/:_id', verifyToken, deleteOneFolder);
folderRoutes.delete('/rm-all', verifyToken, deleteAllFolders);
folderRoutes.delete('/rm-all-childs/:parent_folder_id', verifyToken, deleteAllChildFolders);

folderRoutes.get('/all', verifyToken, getCurrentUserFolder);
folderRoutes.get('/parent-folder-only', verifyToken, getParentFolderOnly);

folderRoutes.post('/make', verifyToken, makeNewFolder);
folderRoutes.post('/make-child/:parent_folder_id', verifyToken, makeChildFolder);

folderRoutes.put('/remake/:_id', verifyToken, changeFolderName);
folderRoutes.put('/move-inside/:_id', verifyToken, moveInsideParentFolder);
folderRoutes.put('/move-outside/:_id', verifyToken, moveOutsideParentFolder);

export default folderRoutes;