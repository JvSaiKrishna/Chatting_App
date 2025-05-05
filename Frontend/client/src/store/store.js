import {configureStore} from "@reduxjs/toolkit"
import AuthReducer from "../Slices/AuthSlice.js"
import chatReducer from "../Slices/ChatSlice.js"
import socketReducer from "../Slices/SocketSlice.js"

export const store = configureStore({
    reducer:{
        auth:AuthReducer,
        chat:chatReducer,
        socket:socketReducer
    }
})