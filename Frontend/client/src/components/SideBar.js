import { Avatar, Badge, Box, IconButton, InputAdornment, List, ListItem, OutlinedInput, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { createChatBoard, fetchChatUsers, removeMessNotification } from '../Slices/ChatSlice';
import Cookies from "js-cookie"

import DialogBox from './DialogBox';

const SideBar = () => {
    const { chatUsers, chatingUser, messages, notifications } = useSelector(state => state.chat)

    const dispatch = useDispatch()
    const id = Cookies.get("userId")
    const jwt = Cookies.get("jwToken")

    useEffect(() => {
        dispatch(fetchChatUsers(jwt))
    }, [dispatch, chatingUser, jwt, messages, notifications])

    const handleMyChat = (user, notifications) => {
        if (notifications) {
            dispatch(removeMessNotification({ chatId: user._id, notifications }))

        }
        dispatch(createChatBoard(user))
    }



    return (
        <>
            <Box component="div" sx={{ minHeight: "86vh", width: { xs: "100%", md: "33%" }, display: { xs: `${chatingUser ? "none" : "inline"}`, md: "inline" }, boxShadow: 5, padding: "10px", marginRight: "10px" }}>

                {/* my chat name & create group dialog box */}

                <Box sx={{ display: 'flex', justifyContent: "space-between", marginBottom: "20px" }}>
                    <Typography sx={{ fontSize: "30px" }}>
                        My chat
                    </Typography>

                    <DialogBox />
                </Box>

                {/* search chat friends */}

                <OutlinedInput
                    placeholder='Search ..'
                    fullWidth
                    endAdornment={

                        <InputAdornment position='end'>
                            <IconButton edge="end">
                                <SearchIcon fontSize='large' sx={{ display: { xs: 'none', sm: "inline" } }} />

                            </IconButton>
                        </InputAdornment>
                    }

                />

                {/* normal chats and group chats display */}
                <List sx={{ overflow: 'auto' }}>
                    {chatUsers.map(user => {
                        return (
                            <ListItem onClick={() => handleMyChat(user, notifications)} key={user._id} sx={{ width: "100%", color: "black", ":hover": { backgroundColor: "purple", color: "white" }, backgroundColor: 'lightgray', marginTop: "4px", borderRadius: "5px", cursor: 'pointer' }}  >
                                

                                {/* chat Avatar */}

                                {(user?.isGroup === false) ? <>
                                    <Avatar sx={{ marginRight: '10px' }} src={user.users.find(user => (user._id !== id)
                                    ).pic} alt='profile' />
                                </> : <>
                                    <Avatar sx={{ marginRight: '10px' }} src={user.pic} alt='profile' />
                                </>
                                }

                                {/* name , last message & notifications*/}
                                <Box sx={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                                    <Box>


                                        <Box sx={{ marginLeft: "10px", overflowX: 'auto' }}>

                                            <Typography sx={{ fontWeight: "600", textTransform: 'capitalize' }}>
                                                {user?.isGroup ? user.chatName : user.users.filter(user => (user._id !== id))[0].username}

                                            </Typography>
                                            {user.latestMessage &&


                                                <Typography >
                                                    {user.latestMessage.sender._id !== id ? <strong>{user.latestMessage.sender.username}: </strong> : ""}
                                                    {user.latestMessage.message}
                                                </Typography>
                                            }

                                        </Box>
                                    </Box>
                                    {/* notifications */}
                                    <Box>
                                        {notifications.map(notify => {
                                            if (notify.chatId === user._id) {

                                                return <Badge sx={{ marginRight: "20px" }} key={notify.chatId} badgeContent={notify.len} color='success'>
                                                </Badge>
                                            }
                                            return <></>
                                        })}
                                    </Box>
                                </Box>
                            </ListItem>
                        )
                    })}
                </List>

            </Box>
        </>
    )
}

export default SideBar