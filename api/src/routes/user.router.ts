import { Router } from "express";
import { changeUserInfo, deleteCurrentUser, getUserData } from "../controllers/user.controller";
import { checkOwnership, verifyToken } from "../middleware/auth.middleware";

const userRoutes = Router();

userRoutes.delete('/delete-myself/:user_id', verifyToken, checkOwnership, deleteCurrentUser);
userRoutes.get('/user-data/:user_id', verifyToken, checkOwnership, getUserData);
userRoutes.put('/change/:user_id', verifyToken, checkOwnership, changeUserInfo);

export default userRoutes;