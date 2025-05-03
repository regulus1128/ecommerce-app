import express from "express";
import { loginUser, registerUser, adminLogin, verifyUser, adminLogout, userLogout, checkAuth, refreshToken, getUserDetails, updateUserDetails } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/verify', verifyUser);
userRouter.post('/admin-logout', adminLogout);
userRouter.post('/logout', userLogout);
userRouter.get('/check-auth', checkAuth);
userRouter.get('/get-user-details', getUserDetails);
userRouter.post('/refresh', refreshToken);
userRouter.put('/update-user-details', updateUserDetails);

export default userRouter;
