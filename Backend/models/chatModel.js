import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    chatName:{
        type:String
    },
    isGroup:{
        type:Boolean,
        default:false
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"message",
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    pic:{
        type:String,
    default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
},{ timestamps: true })

const chat = mongoose.model("chat",chatSchema)

export default chat