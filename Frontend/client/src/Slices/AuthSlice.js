import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie"

const api = process.env.REACT_APP_BACKEND_URL;




export const Signup = createAsyncThunk("auth/signup", async (userData) => {
    const { username, email, password, confirmPassword } = userData
    try {
        if (!(password === confirmPassword)) {
            throw new Error("Passwords not match")

        }
        if (!username || !email || !password) {
            throw new Error("Please fill all * details")
        }
        const option = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(userData)
        }
        const res = await fetch(`${api}/api/user`, option)
        const data = await res.json()
        if (res.ok) {
            return data
        }
        throw new Error(data.message)
    } catch (error) {
        throw error

    }
})
export const LogIn = createAsyncThunk("auth/login", async (userData) => {
    const { email, password } = userData
    try {
        if (!email || !password) {
            throw new Error("Please fill all * details")
        }
        const option = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(userData)
        }
        const res = await fetch(`${api}/api/user/login`, option)
        const data = await res.json()
        if (res.ok) {
            return data
        }
        throw new Error(data.message)
    } catch (error) {
        throw error

    }
})
export const Profile = createAsyncThunk("auth/:id",async({jwt,id})=>{
    
    try {
        const option = {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "authorization": `Bearer ${jwt}`

            },
        }
        const res = await fetch(`${api}/api/user/${id}`, option)
        const data = await res.json()
        if (res.ok) {
            return data
        }
        throw new Error(data.message)
    } catch (error) {
        throw error

    }
}) 
export const UpdateProfile = createAsyncThunk("auth/updateProfile/:id",async({jwt,id,userPic})=>{
    
    try {
        const option = {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "authorization": `Bearer ${jwt}`

            },
            body:JSON.stringify(userPic)
        }
        const res = await fetch(`${api}/api/user/${id}`, option)
        const data = await res.json()
        if (res.ok) {
            return data
        }
        throw new Error(data.message)
    } catch (error) {
        throw error

    }
}) 

const AuthSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        isAuthorized: false,
        profile:null
    },
    reducers: {
        logout: (state) => {
            Cookies.remove("jwToken")
            Cookies.remove("userId")
            state.isAuthorized = false
        },
        Authorization: (state) => {
            const jwt = Cookies.get("jwToken")
            if (jwt) {
                state.isAuthorized = true
            }
            else {
                state.isAuthorized = false

            }
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(Signup.pending, (state) => {
                state.loading = true
            })
            .addCase(Signup.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(Signup.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(LogIn.pending, (state) => {
                state.loading = true
            })
            .addCase(LogIn.fulfilled, (state, action) => {
                state.loading = false
                Cookies.set("userId", action.payload.id, { expires: 1 })
                Cookies.set("jwToken", action.payload.token, { expires: 1 })
            })
            .addCase(LogIn.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(Profile.pending, (state) => {
                state.loading = true
            })
            .addCase(Profile.fulfilled, (state, action) => {
                state.loading = false
                state.profile = action.payload.profile

            })
            .addCase(Profile.rejected, (state) => {
                state.loading = false
                state.profile = null
            })
            .addCase(UpdateProfile.pending, (state) => {
                state.loading = true
            })
            .addCase(UpdateProfile.fulfilled, (state, action) => {
                state.loading = false
                state.profile = action.payload.profile

            })
            .addCase(UpdateProfile.rejected, (state) => {
                state.loading = false
                state.profile = null
            })
    }
});

export const { logout,Authorization } = AuthSlice.actions
export default AuthSlice.reducer


