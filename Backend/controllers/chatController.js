import chat from "../models/chatModel.js"
import message from "../models/messageModel.js"
import user from "../models/userModel.js"
import { v2 as cloudinary } from "cloudinary"
import dotEnv from "dotenv"

dotEnv.config()

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME
})

const createChat = async (req, res) => {
    try {
        const { id } = req.body

        let isChat = await chat.findOne({
            isGroup: false,
            $and: [
                { users: { $elemMatch: { $eq: req.id } } },
                { users: { $elemMatch: { $eq: id } } },
            ]
        }).populate("users", "-password").populate("latestMessage")

        isChat = await user.populate(isChat, {
            path: "latestMessage.sender",
            select: "username pic email"
        })

        if (isChat) {
            res.status(200).json({ chat: isChat })
            return
        }
        else {
            const existingUsers = await user.findOne({ _id: id });
            if (!existingUsers) {
                return res.status(404).json({ message: "ID not found." });
            }
            else {

                const newChat = new chat({
                    chatName: "sender",
                    isGroup: false,
                    users: [req.id, id]
                })
                let getChat = await newChat.save()
                getChat = await getChat.populate("users", "-password")
                res.status(200).json({ chat: getChat })
                return
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server problem" })
    }
}


const fetchChats = async (req, res) => {
    try {
        let getChats = await chat.find({
            users: { $elemMatch: { $eq: req.id } }
        }).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({ updatedAt: "desc" })
        getChats = await user.populate(getChats, {
            path: "latestMessage.sender",
            select: "username pic email"
        })
        if (getChats) {
            res.status(200).json({ userChats: getChats })
            return
        }
        else {
            throw new Error("No chats present")
        }
    } catch (error) {
        return res.status(error.message ? 400 : 500).json({ message: error?.message || "Internal Server problem" })
    }

}

const groupChat = async (req, res) => {
    try {
        let { groupName, groupMembers,groupPic } = req.body
        const existingUsers = await user.find({ _id: { $in: groupMembers } });
        if (existingUsers.length !== groupMembers.length) {
            return res.status(404).json({ message: "Some users not found." });
        }
        const cloudinaryUpload = groupPic ? await cloudinary.uploader.upload(groupPic, {
            folder: "/Chat App"
        }) : ''

        const newGroup = new chat({
            chatName: groupName,
            isGroup: true,
            users: [...groupMembers, req.id],
            groupAdmin: req.id,
            pic: cloudinaryUpload?.url
        })
        let getGroup = await newGroup.save()
        getGroup = await chat.findOne({ _id: getGroup._id }).populate("users", "-password").populate("groupAdmin", "-password")
        res.status(200).json({ group: getGroup })
        return
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server problem" })
    }
}

const renameGroup = async (req, res) => {
    try {
        const { id, groupName } = req.body
        const isChat = await chat.findOne({ _id: id })
        if (isChat) {
            const updateName = await chat.findByIdAndUpdate(id, { chatName: groupName }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password")
            return res.status(201).json({ updateName })
        }

        else {
            throw new Error("Chat not ound")

        }

    } catch (error) {
        return res.status(error.message ? 400 : 500).json({ message: error?.message || "Internal Server problem" })
    }

}

const addNewMember = async (req, res) => {
    try {
        let { id, newUsers } = req.body
        const isAdmin = await chat.findOne({
            $and: [
                { _id: id },
                { groupAdmin: req.id }
            ]
        })
        if (!(isAdmin)) {
            throw new Error("Only Admin can make changes")
        }
        const isUserpresent = await chat.findOne({
            $and: [
                { _id: id },
                { users: { $in: newUsers } }
            ]

        })
        if (isUserpresent) {
            throw new Error("User Already exist in Group")
        }
        else {
            isAdmin.users.push(...newUsers)
            let afterAddMember = await isAdmin.save()
            afterAddMember = await chat.findOne({ _id: afterAddMember._id }).populate("users", "-password").populate("groupAdmin", "-password")
            res.status(201).json({ group: afterAddMember })
            return
        }
    } catch (error) {
        console.log(error)
        return res.status(error.message ? 400 : 500).json({ message: error?.message || "Internal Server problem" })
    }

}

const removeMember = async (req, res) => {
    try {
        const { id, newUser } = req.body
        const isAdmin = await chat.findOne({
            $and: [
                { _id: id },
                { groupAdmin: req.id }
            ]
        })
        if (!(isAdmin)) {
            throw new Error("Only Admin can make changes")
        }
        const isUserpresent = await chat.findOne({
            $and: [
                { _id: id },
                { users: { $elemMatch: { $eq: newUser } } }
            ]
            
        })
        if (!isUserpresent) {
            throw new Error("User not in Group")
        }
        else {
            const afterRemoveMember = await chat.findByIdAndUpdate(
                id,
                {$pull:{users:newUser}},
                {new:true}
            ).populate("users", "-password").populate("groupAdmin", "-password")
            
            res.status(201).json({ group: afterRemoveMember })
            return

        }



    } catch (error) {
        console.log(error)
        return res.status(error.message ? 400 : 500).json({ message: error?.message || "Internal Server problem" })
    }
}

const groupPicUpdate = async (req, res) => {
    try {
        const { id } = req.params
        const { pic } = req.body
        const cloudinaryUpload = await cloudinary.uploader.upload(pic, { folder: "/Chat App" })
        await chat.findOneAndUpdate({ _id: id }, { pic: cloudinaryUpload.url })
        const profile = await chat.findOne({ _id: id }).populate("users", "-password").populate("groupAdmin", "-password")
        res.status(200).json({ profile })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server problem" })

    }
}
export { createChat, fetchChats, groupChat, renameGroup, addNewMember, removeMember,groupPicUpdate }