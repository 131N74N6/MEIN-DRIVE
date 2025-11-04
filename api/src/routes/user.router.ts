import { Router } from "express";
import { getUserData, signIn, signUp } from "../controllers/user.controller";
import { checkOwnership, verifyToken } from "../middleware/auth.middleware";

const userRoutes = Router();

userRoutes.post('/sign-in', signIn);
userRoutes.post('/sign-up', signUp);
userRoutes.get('/user-data/:user_id', verifyToken, checkOwnership, getUserData);

export default userRoutes;