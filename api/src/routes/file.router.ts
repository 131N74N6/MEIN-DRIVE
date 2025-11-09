import { Router } from "express";
import { deleteAllFiles, deleteSelectedFile, getAllFiles, insertNewFile } from "../controllers/file.controller";
import { checkOwnership, verifyToken } from "../middleware/auth.middleware";

const fileRoutes = Router();

fileRoutes.delete('/erase-all/:user_id', verifyToken, checkOwnership, deleteAllFiles);
fileRoutes.delete('/erase/:id', verifyToken, deleteSelectedFile);
fileRoutes.get('/get-all/:user_id', verifyToken, checkOwnership, getAllFiles);
fileRoutes.post('/add', verifyToken, insertNewFile);

export default fileRoutes;