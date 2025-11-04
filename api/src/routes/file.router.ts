import { Router } from "express";
import { deleteAllFiles, deleteSelectedFile, getAllFiles, insertNewFile } from "../controllers/file.controller";
import { checkOwnership, verifyToken } from "../middleware/auth.middleware";

const fileRoutes = Router();
fileRoutes.use(verifyToken);

fileRoutes.delete('/erase-all/:user_id', checkOwnership, deleteAllFiles);
fileRoutes.delete('/erase/:id', deleteSelectedFile);
fileRoutes.get('/get-all/:user_id', checkOwnership, getAllFiles);
fileRoutes.post('/add', checkOwnership, insertNewFile);

export default fileRoutes;