import { Router } from "express";
import { deleteAllFiles, deleteSelectedFile, getAllFiles, insertNewFile } from "../controllers/file.controller";

const fileRoutes = Router();

fileRoutes.delete('/erase-all', deleteAllFiles);

fileRoutes.delete('/erase/:id', deleteSelectedFile);

fileRoutes.get('/get-all/:user_id', getAllFiles);

fileRoutes.post('/add', insertNewFile);

export default fileRoutes;