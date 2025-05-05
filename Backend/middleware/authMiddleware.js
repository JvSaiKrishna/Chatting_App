import jwt from "jsonwebtoken"
import dotEnv from "dotenv"

dotEnv.config()

export const AuthMiddleware = async(req,res,next)=>{
    try {
        let token = req.headers["authorization"]
    if(token && token.startsWith("Bearer") ){
        token = token.split(" ")[1]
        const isToken = jwt.verify(token, process.env.SECRET_KEY)
        if(isToken){
            req.user  = isToken.user
            req.id = isToken.id
            next()
            return
        }
        else{
            throw new Error("Invalid Token")

        }
    }
    else{
        throw new Error("Please provide Token")
    }
    } catch (error) {
        return res.status(error.message? 400:500).json({ message: error?.message || "Internal Server problem" })
    }

}