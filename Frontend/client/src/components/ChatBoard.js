import { Avatar, Box, IconButton, InputAdornment, OutlinedInput, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { clearChatBoard, sendMessages, SocketMessages } from '../Slices/ChatSlice';
import SendIcon from '@mui/icons-material/Send';

import Cookies from "js-cookie"
import { useSocket } from '../Context/socketContext';
import { io } from "socket.io-client"

const url = process.env.REACT_APP_BACKEND_URL

const ChatBoard = () => {
  const [sendMessage, setSendMessage] = useState("")
  const { chatingUser, messages } = useSelector(state => state.chat)
  const { socket, setSocket } = useSocket()
  const dispatch = useDispatch()

  const id = Cookies.get("userId")
  const jwt = Cookies.get("jwToken")


  useEffect(() => {
    setSocket(io(url))
  }, [setSocket])

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.emit("user setup", (id))
    if (chatingUser) {
      socket.emit("join room", (chatingUser._id));

    }
    socket.on("recived message", (message) => {
      if (chatingUser && chatingUser?._id === message?.chat._id) {
        dispatch(SocketMessages({ message, messages }))
        return
        
      }
      
    })

  }, [socket, id, chatingUser, dispatch, messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (sendMessage === "") {
      return
    }
    const messageData = { context: sendMessage, chatId: chatingUser._id }
    dispatch(sendMessages({ jwt, messageData }))
      .unwrap()
      .then((message) => {
        socket.emit("send message", ({message,id:chatingUser._id}));
      })
      .catch(error =>
        alert(error.message)

      )
    setSendMessage('')
  }


  const handleArrowBtn = () => {
    dispatch(clearChatBoard())
  }

  const dateLogic = (messages, date, i) => {
    if (i === 0) {
      return true
    }
    return (messages[i - 1]?.updatedAt.split("T")[0]
      !== date)
  }

  const displayUserPic = (messages, u, i) => {
    if (i === 0) {
      return true
    }
    return (messages[i - 1]?.sender._id !== u._id)
  }
  const displayUserName = (messages, m, i) => {
    if (i === 0) {
      return true
    }
    return (messages[i - 1]?.sender.username !== m.sender.username)
  }

  return (
    <>
      <Box component="div" sx={{ position: 'relative', height: "86vh", width: { xs: "100%", md: "67%" }, display: { xs: `${chatingUser ? "inline" : "none"}`, md: 'inline' }, }}>
        {chatingUser ? <>

          {/* chat Navbar */}

          <Box sx={{ boxShadow: 3, padding: { xs: "10px", md: "10px 10px 10px 20px" }, display: 'flex', alignItems: 'center', gap: "10px" }}>
            <IconButton onClick={handleArrowBtn} sx={{ display: { md: "none" } }}><ArrowBackIcon /></IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: "15px", cursor: 'pointer' }}>

              <Avatar src={chatingUser.isGroup ? chatingUser.pic : chatingUser.users[1].pic} alt='chat pic' />
              <Typography>{chatingUser.isGroup ? chatingUser.chatName : chatingUser.users.filter(user => (user._id !== id))[0].username}</Typography>
            </Box>
          </Box>

          {/* messages dispaly */}

          <Box sx={{ height: "68vh", marginTop: "2px", overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', marginRight: "10px" }}>

            {/* <p>{JSON.stringify(messages[0].chat._id)}</p> */}


            {messages && <>
              {messages?.map((message, i) => (
                <Box key={message._id} component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Dates display logic */}

                  {dateLogic(messages, message.updatedAt.split("T")[0], i) &&
                    <Typography sx={{ textAlign: 'center', }}>
                      {message.updatedAt.split("T")[0]}
                    </Typography>
                  }

                  {/* Single message details display */}

                  <Box sx={{ alignSelf: `${message.sender._id === id ? 'end' : "start"}`, display: 'flex' }}>

                    {/* users pic display */}

                    {message.chat.isGroup &&
                      <>
                        {message.sender._id !== id &&
                          <>
                            {message.chat.users.map((user) => {
                              if (user._id === message.sender._id) {

                                return (<>
                                  <Box component="div" key={user._id}>

                                    {displayUserPic(messages, user, i) ?
                                      <>
                                        <Avatar sx={{ width: "30px", height: "30px" }} src={user.pic} alt='user pic' />
                                      </>
                                      :
                                      <Box component="div" sx={{ width: "30px", height: "30px" }}></Box>
                                    }
                                  </Box>
                                </>)
                              }
                              else {
                                return (<></>)
                              }
                            })}
                          </>
                        }
                      </>

                    }

                    {/*Name, Message and Time display */}
                    <Box>
                      {message.chat.isGroup &&
                        <>
                          {message.sender._id !== id &&
                            <>
                              {displayUserName(messages, message, i) &&
                                <Typography sx={{ fontSize: "10px" }}>{message.sender.username}</Typography>
                              }
                            </>
                          }
                        </>
                      }

                      <Box sx={{ minHeight: "40px", gap: "5px", maxWidth: "30vw", color: `${message.sender._id === id ? "white" : "#000000"}`, backgroundColor: `${message.sender._id === id ? "purple" : "lightBlue"}`, marginBottom: "10px", display: 'flex', padding: "0px 5px 0px 5px", borderRadius: "5px" }}>

                        {/* Message */}


                        <Typography sx={{ alignSelf: 'center' }}>
                          {message.message}
                        </Typography>

                        {/* Time */}

                        <Typography sx={{ fontSize: "10px", alignSelf: "end" }}>{new Date(message.updatedAt).toString().split(" ")[4].slice(0, -3)}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </>}

          </Box>

          {/* send Messages */}

          <Box component="form" onSubmit={handleSend}>
            <OutlinedInput
              sx={{ position: 'absolute', width: { xs: "96%", md: "98%" }, bottom: 0, margin: { xs: "10px" } }}
              placeholder='Chat ...'
              value={sendMessage}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton onClick={handleSend}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              }
              onChange={(e) => setSendMessage(e.target.value)}
            />

          </Box>
        </>
          :
          <>
            <Typography sx={{ height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Make friends and increase your circle  </Typography>
          </>}
      </Box>
    </>
  )
}

export default ChatBoard