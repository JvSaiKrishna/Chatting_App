import express from "express";
import { fetchAllUser, Login, profile, profileUpdate, Registration } from "../controllers/userController.js";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router()

router.post('/',Registration)
router.post('/login',Login)
router.get('/',AuthMiddleware,fetchAllUser)
router.get("/:id",AuthMiddleware,profile)
router.put("/:id",AuthMiddleware,profileUpdate)
export default router