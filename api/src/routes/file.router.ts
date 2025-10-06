import { Router } from "express";
import { deleteAllFiles, deleteSelectedFile, getAllFiles } from "../controllers/file.controller";

const fileRoutes = Router();

fileRoutes.delete('/erase-all', deleteAllFiles);

fileRoutes.delete('/erase/:id', deleteSelectedFile);

fileRoutes.get('/get-all/:id', getAllFiles);

export default fileRoutes;