import { Avatar, Box, Button, Container, Drawer, IconButton, InputLabel, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ClearIcon from '@mui/icons-material/Clear';
import AddMembers from './AddMembers';
import { useDispatch, useSelector } from 'react-redux';
import { groupProfile, removeMembers, sendMessages, SocketMessages } from '../Slices/ChatSlice';
import Cookies from "js-cookie"
import { useSocket } from '../Context/socketContext';



const GroupUserDetails = ({ onClick }) => {
    const [open, setOpen] = useState(false)
    const [pic, setPic] = useState("");
    const { socket } = useSocket()

    const { chatingUser, messages, loading} = useSelector(state => state.chat)
    const dispatch = useDispatch()
    const jwt = Cookies.get("jwToken")


    const toggleDrawer = (bool) => {
        setOpen(bool)

    }
    const handlePic = (e) => {
        const file = e.target.files[0]
        let reader = new FileReader();
        reader.onloadend = () => {
            setPic(reader.result)

        };
        reader.readAsDataURL(file)

    }

    const handleUpdate = (e) => {
        if (pic === "") {
            return
        }
        const userPic = { pic }
        dispatch(groupProfile({ jwt, id:chatingUser._id, userPic }))
        setPic("")

    }
    const handleDelete = (id, adminFriend) => {
        const user = { id: chatingUser._id, newUser: id }

        dispatch(removeMembers({ jwt, user }))
            .unwrap()
            .then(() => {

                const messageData = { context: `${chatingUser.groupAdmin.username} removed ${adminFriend}`, chatId: chatingUser._id, left: true }
                dispatch(sendMessages({ jwt, messageData }))
                    .unwrap()
                    .then(message => {
                        dispatch(SocketMessages({ message, messages }));
                        socket.emit("send message", (message));
                    }
                    )
                    .catch(error =>
                        console.log(error.message)
                    )
            })
            .catch(error =>
                alert(error.message)
            )

    }

    return (
        <Container sx={{ width: { xs: "100vw", sm: "50vw", md: "35vw" } }}>
            <IconButton onClick={() => onClick(false)} sx={{ marginLeft:"auto", display: 'flex', justifyContent: 'end' }}><ClearIcon sx={{ width: "35px", height: "35px" }} /></IconButton>

            {/* group pic */}

            <Box sx={{ paddingTop: "70px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <Avatar sx={{
                    width: "100px", height: "100px"
                }} src={pic?pic: chatingUser?.pic} alt='Group pic' />
                <InputLabel htmlFor="photo" onChange={handlePic} sx={{ cursor: 'pointer', position: 'relative', top: "-6px", left: "20px" }}>
                    <PhotoCameraIcon />
                    <TextField id='photo' sx={{ display: 'none' }}
                        type="file"
                    />
                </InputLabel>

                {/* Group Name */}

                <Typography sx={{ fontSize: "22px", textTransform: 'capitalize' }}>{chatingUser.chatName}</Typography>

                {pic && <Button onClick={handleUpdate} disabled={loading} variant='contained' sx={{fontSize:"16px"}}>Save</Button>}
            </Box>

            {/* Group user */}

            <Typography sx={{ marginTop: "20px", marginBottom: "20px", fontSize: "24px", fontWeight: "600" }}>Group users</Typography>

            {/* add Members */}

            <Typography onClick={() => toggleDrawer(true)} sx={{ fontSize: "19px", marginBottom: "20px", cursor: 'pointer' }}>Add Members</Typography>
            <Drawer anchor='right' open={open} onClose={() => toggleDrawer(false)}>
                <AddMembers onClick={toggleDrawer} />
            </Drawer>

            {/* users rendering */}

            {chatingUser.users.map(user => {
                return (
                    <Box key={user._id} sx={{ width: "90%", height: "40px", fontSize: "20px", display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: "1px solid blue", borderRadius: "10px", marginBottom: '20px', paddingLeft: "20px" }}>
                        <Typography sx={{ textTransform: 'capitalize' }}>
                            {user.username}
                        </Typography>

                        {user._id === chatingUser.groupAdmin._id ?
                            <Box sx={{ marginRight: "10px", fontSize: "17px", fontWeight: "500", color: "#2e7d32" }} component="span">Admin</Box>
                            :
                            <IconButton onClick={() => handleDelete(user._id, user.username)} color='error'><ClearIcon /></IconButton>}
                    </Box>)
            })}
        </Container>
    )
}

export default GroupUserDetails