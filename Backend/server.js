import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import dotEnv from "dotenv"
import mongoConnection from "./config/db.js"
import userRouter from "./router/userRouter.js"
import chatRouter from "./router/chatRouter.js"

dotEnv.config()

const app = express()
app.use(express.json({ limit: "10mb" }))
app.use(cors({
    origin: "*",
    credentials: true
}))


app.get("/", (req, res) => {
    res.send("Server is Running")
})

app.use("/api/user", userRouter)
app.use("/api/chat", chatRouter)

const server = createServer(app)
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }

})

io.on("connection", (socket) => {
    console.log("Socket is connected")

    socket.on("user setup", (id) => {
        console.log(`${id} is Connected`)
        socket.join(id)
    })
    socket.on("join room", (id) => {
        console.log("room joinned:", id)
        socket.join(id)
    })
    socket.on("send message", ({message,id}) => {
        socket.to(id).emit("recived message", message)
    })


})





const main = async () => {
    mongoConnection()
    server.listen(process.env.PORT, () => {
        console.log(`Server running at port: ${process.env.PORT}`)
    })
}

main()



