import { createSlice } from "@reduxjs/toolkit";


const SocketSlice = createSlice({
    name:"socket",
    initialState:{
        socket: null
    },
    reducers:{
        SocketConnection:(state,action)=>{
            state.socket = action.payload
        }
    }
})

export const {SocketConnection} = SocketSlice.actions

export default SocketSlice.reducer