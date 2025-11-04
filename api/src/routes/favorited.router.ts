import { Router } from 'express';
import { deleteAllFavoriteFiles, deleteFavoriteFile, getCurrentUserFavorite } from '../controllers/favorited.controller';
import { checkOwnership, verifyToken } from '../middleware/auth.middleware';

const favoriteRoutes = Router();
favoriteRoutes.use(verifyToken);

favoriteRoutes.get('/get-all/:user_id', checkOwnership, getCurrentUserFavorite);
favoriteRoutes.delete('/erase-all/:user_id', deleteAllFavoriteFiles);
favoriteRoutes.delete('/erase/:id', checkOwnership, deleteFavoriteFile);

export default favoriteRoutes;