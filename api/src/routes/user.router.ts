import { Router } from "express";
import { getUserData, signIn, signUp } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";

const userRoutes = Router();

userRoutes.post('/sign-in', signIn);
userRoutes.post('/sign-up', signUp);
userRoutes.get('/user-data/:id', verifyToken, getUserData);

export default userRoutes;