import express from "express";
import { subscribe } from "../controllers/emailController.js";

const emailRouter = express.Router();

emailRouter.post('/subscribe', subscribe);

export default emailRouter;

