import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const url = process.env.REACT_APP_BACKEND_URL

export const fetchUser = createAsyncThunk("user", async ({jwt,search}) => {
    try {
        const option = {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "authorization": `Bearer ${jwt}`
            },
        }
        const res = await fetch(`${url}/api/user?search=${search}`, option)
        const data = await res.json()
        if (res.ok) {
            return data.users
        }
        else {
            throw new Error(data.message)
        }
    } catch (error) {
        throw error
    }
})

export const fetchChatUsers = createAsyncThunk("chat/users", async (jwt) => {
    try {
        const option = {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "authorization": `Bearer ${jwt}`
            },
        }
        const res = await fetch(`${url}/api/chat`, option)
        const data = await res.json()
        if (res.ok) {
            return data.userChats
        }
        else {
            throw new Error(data.message)
        }
    } catch (error) {
        throw error
    }
})

export const createGroup = createAsyncThunk("chat/group", async ({jwt,groupData}) => {
    try {
        const option = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": `Bearer ${jwt}`
            },
            body: JSON.stringify(groupData)
        }
        const res = await fetch(`${url}/api/chat/group`, option)
        const data = await res.json()
        if (res.ok) {
            return data.group
        }
        else {
            throw new Error(data.message)
        }
    } catch (error) {
        throw error
    }

})

export const createNormalChat = createAsyncThunk("chat", async ({jwt,userId}) => {
    try {
        const option = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": `Bearer ${jwt}`
            },
            body: JSON.stringify(userId)
        }
        const res = await fetch(`${url}/api/chat`, option)
        const data = await res.json()
        if (res.ok) {
            return data.chat
        }
        else {
            throw new Error(data.message)
        }
    } catch (error) {
        throw error
    }
})

export const sendMessages = createAsyncThunk("chat/message", async ({jwt,messageData}) => {
    try {
        const option = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": `Bearer ${jwt}`
            },
            body: JSON.stringify(messageData)
        }
        const res = await fetch(`${url}/api/chat/message`, option)
        const data = await res.json()
        if (res.ok) {
            return data.newMessage
        }
        else {
            throw new Error(data.message)
        }
    } catch (error) {
        throw error
    }

})

export const fetchMessages = createAsyncThunk("chat/:id/message", async ({jwt,id}) => {
    try {
        const option = {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "authorization": `Bearer ${jwt}`
            }
        }
        const res = await fetch(`${url}/api/chat/${id}/message`, option)
        const data = await res.json()
        if (res.ok) {
            return data.allMessages
        }
        else {
            throw new Error(data.message)
        }
    } catch (error) {
        throw error
    }

})

const ChatSlice = createSlice({
    name: "chat",
    initialState: {
        newUsers: [],
        loading: false,
        chatUsers: [],
        chatingUser: null,
        messages: [],        

    },
    reducers: {
        clearChatBoard: (state) => {
            state.chatingUser = null
        },
        createChatBoard: (state, action) => {
            state.chatingUser = action.payload
        },
        SocketMessages:(state,action)=>{
            state.messages = [...action.payload.messages,action.payload.message]
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false
                state.newUsers = action.payload
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false
                state.newUsers = []
            })
            .addCase(fetchChatUsers.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchChatUsers.fulfilled, (state, action) => {
                state.loading = false
                state.chatUsers = action.payload

            })
            .addCase(fetchChatUsers.rejected, (state, action) => {
                state.loading = false
                state.chatUsers = []
            })
            .addCase(createGroup.pending, (state) => {
                state.loading = true
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.loading = false
                state.chatingUser = action.payload
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.loading = false
                state.chatingUser = null
            })
            .addCase(createNormalChat.pending, (state) => {
                state.loading = true

            })
            .addCase(createNormalChat.fulfilled, (state, action) => {
                state.loading = false
                state.chatingUser = action.payload
            })
            .addCase(createNormalChat.rejected, (state, action) => {
                state.loading = false
                state.chatingUser = null
            })
            .addCase(sendMessages.pending, (state) => {
                state.loading = true
                
            })
            .addCase(sendMessages.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(sendMessages.rejected, (state) => {
                state.loading = false
            })
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true

            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false
                state.messages = action.payload
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false
                state.messages = []
            })

    }
})


export const { clearChatBoard, createChatBoard ,SocketMessages} = ChatSlice.actions
export default ChatSlice.reducer