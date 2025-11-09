import { Router } from "express";
import { deleteAllFiles, deleteSelectedFile, getAllFiles, insertNewFile } from "../controllers/file.controller";
// import { checkOwnership, verifyToken } from "../middleware/auth.middleware";

const fileRoutes = Router();

fileRoutes.delete('/erase-all/:user_id', deleteAllFiles);
fileRoutes.delete('/erase/:id', deleteSelectedFile);
fileRoutes.get('/get-all/:user_id', getAllFiles);
fileRoutes.post('/add', insertNewFile);

export default fileRoutes;