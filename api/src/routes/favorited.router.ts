import { Router } from 'express';
import { deleteAllFavoriteFiles, deleteFavoriteFile, getCurrentUserFavorite } from '../controllers/favorited.controller';
import { checkOwnership, verifyToken } from '../middleware/auth.middleware';

const favoriteRouter = Router();
favoriteRouter.use(verifyToken);

favoriteRouter.get('/get-all/:user_id', checkOwnership, getCurrentUserFavorite);
favoriteRouter.delete('/erase-all/:user_id', deleteAllFavoriteFiles);
favoriteRouter.delete('/erase/:id', checkOwnership, deleteFavoriteFile);

export default favoriteRouter;