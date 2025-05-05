import express from "express";
import { fetchAllUser, Login, Registration } from "../controllers/userController.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/',Registration)
router.post('/login',Login)
router.get('/',AuthMiddleware,fetchAllUser)

export default router