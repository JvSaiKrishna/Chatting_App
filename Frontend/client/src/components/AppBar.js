import { AppBar, Box, Drawer, IconButton, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import SideDrawer from './SideDrawer.js';
import { logout, Profile } from '../Slices/AuthSlice.js';
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import SearchIcon from '@mui/icons-material/Search';
import { createNormalChat } from '../Slices/ChatSlice.js';
import Cookies from "js-cookie"
import { useSocket } from '../Context/socketContext.js';
import ProfileDialogBox from './ProfileDialogBox.js';

const Appbar = () => {
    const [open, setOpen] = useState(false)
    const { socket } = useSocket()


    const dispatch = useDispatch()
    const navigate = useNavigate()
    const jwt = Cookies.get("jwToken")
    const id = Cookies.get("userId")

    React.useEffect(() => {
        dispatch(Profile({ jwt, id }))

    }, [dispatch, jwt, id])

    const toggleDrawer = (bool, user = null) => {
        if (user) {
            const userId = { id: user._id }
            dispatch(createNormalChat({ jwt, userId }))

        }
        setOpen(bool)

    }

    const handleLogout = () => {
        if (socket.connected) {
            socket.disconnect()
        }
        dispatch(logout())
        return navigate("/login")


    }


    return (
        <>
            <AppBar sx={{ backgroundColor: "purple", height: "70px", display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                <IconButton onClick={() => toggleDrawer(true)} sx={{ color: "white" }}>
                    <MenuIcon sx={{ width: 30, height: 30, display: { xs: "inline", md: 'none' } }} />
                    <Box sx={{ display: { xs: "none", md: 'flex' }, alignItems: "center", marginLeft: "10px", color: 'white' }}>
                        <SearchIcon fontSize='inherit' sx={{ display: { xs: 'none', sm: "inline" } }} />
                        <Typography width="100%" fontSize="20px">
                            Search  Users
                        </Typography>
                    </Box>
                </IconButton>
                <Drawer open={open} onClose={() => toggleDrawer(false)}>
                    <SideDrawer toggleDrawer={toggleDrawer} />
                </Drawer>
                <Typography sx={{ fontSize: "25px" }} component="h5">
                    Chat App
                </Typography>
                <Box component="div" >
                    <ProfileDialogBox />
                    <Tooltip title="Logout">
                        <IconButton onClick={handleLogout} sx={{ display: { md: "none" }, color: "white" }}>
                            <ExitToAppOutlinedIcon fontSize='large' />
                        </IconButton>
                    </Tooltip>
                    <Typography onClick={handleLogout} sx={{ cursor: 'pointer', color: "white", display: { xs: "none", md: "inline" }, fontSize: "20px", margin: "0px 30px" }}>
                        Logout
                    </Typography>
                </Box>
            </AppBar>
        </>
    )
}

export default Appbar