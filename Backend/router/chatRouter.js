import express from "express";
import { AuthMiddleware } from "../middleware/authMiddleware.js";
import { createChat ,fetchChats, groupChat, renameGroup,addNewMember,removeMember } from "../controllers/chatController.js";
import { fetchMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router()

router.post('/',AuthMiddleware,createChat)
router.get('/',AuthMiddleware,fetchChats)
router.post('/group',AuthMiddleware,groupChat)
router.put('/rename',AuthMiddleware,renameGroup)
router.post('/group/addMember',AuthMiddleware,addNewMember)
router.post('/group/removeMember',AuthMiddleware,removeMember)


router.post('/message',AuthMiddleware,sendMessage)
router.get('/:id/message',AuthMiddleware,fetchMessages)



export default router