import express from 'express';
import { checkOwnership, verifyToken } from '../middleware/auth.middleware';
import { changeFolderName, deleteAllFolders, deleteOneFolder, getCurrentUserFolder, insertFileToFolder, makeNewFolder } from '../controllers/folder.controller';

const folderRouter = express.Router();

folderRouter.delete('/delete/:_id', verifyToken, deleteOneFolder);
folderRouter.delete('/deletes/:user_id', verifyToken, checkOwnership, deleteAllFolders);
folderRouter.get('/get/:user_id', verifyToken, checkOwnership, getCurrentUserFolder);
folderRouter.post('/make', verifyToken, makeNewFolder);
folderRouter.put('/change/:_id', verifyToken, changeFolderName);
folderRouter.put('/insert-to/:_id', verifyToken, insertFileToFolder);

export default folderRouter;