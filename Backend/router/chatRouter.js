import express from "express";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import { createChat ,fetchChats, groupChat, renameGroup,addNewMember,removeMember, groupPicUpdate } from "../controllers/chatController.js";
import { fetchMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router()

router.post('/',AuthMiddleware,createChat)
router.get('/',AuthMiddleware,fetchChats)
router.post('/group',AuthMiddleware,groupChat)
router.put('/rename',AuthMiddleware,renameGroup)
router.put('/group/addMember',AuthMiddleware,addNewMember)
router.put('/group/removeMember',AuthMiddleware,removeMember)
router.put("/group/:id",AuthMiddleware,groupPicUpdate)

router.post('/message',AuthMiddleware,sendMessage)
router.get('/:id/message',AuthMiddleware,fetchMessages)



export default router