import mongoose from "mongoose";

const messageSchma = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    message:{
        type:String,
        required:true
    },
    chat:{type:mongoose.Schema.Types.ObjectId,
        ref:"chat",
        
    },
    left:{type:Boolean,required:true}

},{ timestamps: true })

const message = mongoose.model("message",messageSchma)

export default message
