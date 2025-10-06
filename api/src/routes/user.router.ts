import { Router } from "express";
import { signIn, signUp } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post('/sign-in', signIn);

userRoutes.post('/sign-up', signUp);

export default userRoutes;