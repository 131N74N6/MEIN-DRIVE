import { Router } from "express";
import { getUserData, signIn, signUp } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post('/sign-in', signIn);

userRoutes.post('/sign-up', signUp);

userRoutes.get('/user-data/:id', getUserData);

export default userRoutes;