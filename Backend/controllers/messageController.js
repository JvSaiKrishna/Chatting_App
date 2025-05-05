
import message from "../models/messageModel.js"
import chat from "../models/chatModel.js"
import user from "../models/userModel.js"



const sendMessage = async (req, res) => {
    try {
        const { context, chatId } = req.body
        let newMessage = new message({
            sender: req.id,
            message: context,
            chat: chatId
        })
        newMessage = await newMessage.save()
        newMessage = await newMessage.populate("sender", "-password")
        newMessage = await newMessage.populate("chat")
        newMessage = await user.populate(newMessage,{
            path:"chat.users",
            select:"username pic email"
        })
        await chat.updateOne({_id:chatId},{latestMessage:newMessage})
        res.status(200).json({ newMessage })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server problem" })

    }
    
}
const fetchMessages = async (req, res) => {
    try {
        const { id } = req.params
        let allMessages = await message.find({ chat:id }).populate("sender","-password").populate("chat")
        allMessages = await user.populate(allMessages,{
            path:"chat.users",
            select:"username pic email"
        })
        res.status(200).json({ allMessages })


    } catch (error) {
        return res.status(500).json({ message: "Internal Server problem" })

    }

}

export { sendMessage, fetchMessages }