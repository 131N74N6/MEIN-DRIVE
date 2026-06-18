import { Router } from "express";
import { changeUserInfo, deleteCurrentUser, getUserData } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";

const userRoutes = Router();

userRoutes.delete('/rm-myself', verifyToken, deleteCurrentUser);
userRoutes.get('/user-data', verifyToken, getUserData);
userRoutes.put('/change', verifyToken, changeUserInfo);

export default userRoutes;