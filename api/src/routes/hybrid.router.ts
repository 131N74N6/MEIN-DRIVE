import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { addToFavorite, getAllData, getAllFavoritedData, getChildFoldersAndFiles, isFavorited, removeFromFavorite } from "../controllers/hybrid.controller";

const hybridRoutes = Router();

hybridRoutes.get("/all", verifyToken, getAllData);
hybridRoutes.get("/favorited", verifyToken, getAllFavoritedData);
hybridRoutes.get('/is-favorited/:_id', verifyToken, isFavorited);
hybridRoutes.get("/fi-and-cfo/:parent_folder_id", verifyToken, getChildFoldersAndFiles);

hybridRoutes.put('/add-to-favorited/:_id', verifyToken, addToFavorite);
hybridRoutes.put('/remove-from-favorited/:_id', verifyToken, removeFromFavorite);

export default hybridRoutes;