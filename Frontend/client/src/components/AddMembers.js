import { Avatar, Box, Button, Container, IconButton, Typography } from '@mui/material'

import ClearIcon from '@mui/icons-material/Clear';
import Drawer from './Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import Cookies from "js-cookie"
import { addMembers, sendMessages, SocketMessages } from '../Slices/ChatSlice';
import { useSocket } from '../Context/socketContext';




const AddMembers = ({ onClick }) => {
    const [groupMembers, setGroupMembers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([])
    const { socket } = useSocket()

    const { chatingUser, error, loading,messages } = useSelector(state => state.chat)
    const dispatch = useDispatch()
    const jwt = Cookies.get("jwToken")






    const onClickUser = (user) => {
        const isUser = chatingUser.users.find(u => u._id === user._id)
        if (isUser) {
            return
        }
        if (!(groupMembers?.includes(user._id))) {
            setGroupMembers(prev => {
                return [...prev, user._id]
            })
            setSelectedUsers(prev => {
                return [...prev, user]
            })

        }
    }

    const handleRemove = (user) => {
        setGroupMembers(prev => {
            const updateMembers = prev.filter(x => {
                return (x !== user._id)
            })
            return updateMembers
        })
        setSelectedUsers(prev => {
            const updateMembers = prev.filter(x => {
                return (x._id !== user._id)
            })
            return updateMembers
        })

    }
    const handleAdd = (selectedUsers) => {
        if (!groupMembers) {
            return
        }
        const users = { id: chatingUser._id, newUsers: groupMembers }
        dispatch(addMembers({ jwt, users }))
            .unwrap()
            .then(() => {

                const messageData = { context: `${chatingUser.groupAdmin.username} added ${(selectedUsers?.map(user=>{return user.username})).join(",")}`, chatId: chatingUser._id, left: true }
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
                console.log(error.message)
            )
        setGroupMembers([])
        setSelectedUsers([])
        onClick(false)
    }


    return (
        <Container sx={{ width: { xs: "100vw", sm: "50vw", md: "35vw" } }}>
            <IconButton sx={{ marginLeft:"auto", display: 'flex', justifyContent: 'end' }}>
                <ClearIcon onClick={() => onClick(false)} sx={{ width: "35px", height: "35px" }} />
            </IconButton>

            <Typography sx={{ fontSize: { xs: "20px", md: "24px" } }} marginBottom="20px">
                Add Memebers
            </Typography>
            <Box sx={{ display: 'flex' }}>
                {selectedUsers?.map(user => {
                    return (

                        <Box onClick={() => handleRemove(user)} component="div" key={user._id} sx={{ cursor: 'pointer', color: "purple", margin: "0 5px 10px 10px ", }}>

                            <Avatar src={user.pic} alt='user pic' />

                            <Typography>{user.username}</Typography>

                        </Box>

                    )
                })}
            </Box>
            <Drawer onClickUser={onClickUser} />
            {selectedUsers?.length > 0 &&
                <Button sx={{ position: 'fixed', bottom: "10px", right: 0 }} disabled={loading} onClick={() => handleAdd(selectedUsers)} variant='contained' type="submit">ADD</Button>
            }
            <p>
                {}
            </p>


        </Container>
    )
}

export default AddMembers