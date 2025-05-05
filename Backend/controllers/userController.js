import user from "../models/userModel.js"
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary"
import dotEnv from "dotenv"
import jwt from "jsonwebtoken"

dotEnv.config()

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME
})

const Registration = async (req, res) => {

    try {
        let { username, email, password, pic } = req.body
        if (!username || !email || !password) {
            throw new Error("Please fill all * details")
        }
        username = username.trim()
        email = email.trim()
        password = password.trim()
        const isEmail = await user.findOne({ email })
        const isUser = await user.findOne({ username })
        if (isEmail || isUser) {
            throw new Error("User already exist")

        }

        const salt = bcrypt.genSaltSync(10)
        const hashpwd = await bcrypt.hash(password, salt)

        const cloudinaryUpload = pic ? await cloudinary.uploader.upload(pic, {
            folder: "/Chat App"
        }) : ''
        const newData = new user({
            username,
            email,
            password: hashpwd,
            pic: cloudinaryUpload?.url
        })
        await newData.save()
        return res.status(200).json({ data: email })


    } catch (error) {
        return res.status(error.message ? 400 : 500).json({ message: error?.message || "Internal Server problem" })
    }
}

const Login = async (req, res) => {
    try {
        let { email, password } = req.body
        if (!email || !password) {
            throw new Error("Please fill all * details")
        }
        email = email.trim();
        password = password.trim()
        const isData = await user.findOne({ email: email })
        if (isData) {
            const ispwd = await bcrypt.compare(password, isData.password)
            const payload = {
                id: isData._id,
                User: isData.username
            }
            if (ispwd) {
                const token = jwt.sign(payload, process.env.SECRET_KEY)
                res.status(200).json({ token,id:payload.id })
                return
            }
            throw new Error("Credentials not match")

        }

        throw new Error("User not exist, please first create account")

    } catch (error) {

        return res.status(error.message ? 400 : 500).json({ message: error?.message || "Internal Server problem" })
    }
}

const fetchAllUser = async (req, res) => {
    try {
        const { search } = req.query
    const getUsers = await user.find({
        $or: [{
            username: { $regex: search, $options: "i" }
        },
        {
            email: { $regex: search, $options: "i" }
        }
    ]
    }).find({ _id: { $ne: req.id } }).select("-password")
    res.status(200).json({users:getUsers})
    } catch (error) {
        return res.status(500).json({message:  "Internal Server problem" })
        
    }
}

export { Registration, Login, fetchAllUser }