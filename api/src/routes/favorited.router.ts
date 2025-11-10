import { Router } from 'express';
import { addToFavorite, deleteAllFavoriteFiles, deleteFavoriteFile, getCurrentUserFavorite } from '../controllers/favorited.controller';
import { checkOwnership, verifyToken } from '../middleware/auth.middleware';

const favoriteRoutes = Router();

favoriteRoutes.get('/get-all/:user_id', verifyToken, checkOwnership, getCurrentUserFavorite);
favoriteRoutes.delete('/erase-all/:user_id', verifyToken, checkOwnership, deleteAllFavoriteFiles);
favoriteRoutes.delete('/erase/:id', verifyToken, deleteFavoriteFile);
favoriteRoutes.post('/add', verifyToken, addToFavorite);

export default favoriteRoutes;