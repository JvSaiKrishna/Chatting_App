import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true,
        minlength: 3,
        maxlenght: 15
    },
    email: {
        type: String,
        required: true,
        unique:true,
        minlength: 5,

    },
    password:{
        type:String,
        required: true,
        minlength: 6
    },
    pic:{
        type:String,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
},{timestamps:true})

const user = mongoose.model("user",userSchema)
export default user