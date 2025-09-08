import { Avatar, Box, Drawer, IconButton, InputAdornment, OutlinedInput, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { clearChatBoard, fetchMessages, messageNotification, sendMessages, SocketMessages } from '../Slices/ChatSlice';
import SendIcon from '@mui/icons-material/Send';
import Cookies from "js-cookie"
import { useSocket } from '../Context/socketContext';
import GroupUserDetails from './GroupUserDetails';



const ChatBoard = () => {
  const [sendMessage, setSendMessage] = useState("")
  const [typing, setTyping] = useState(false)
  const [userTyping, setUserTyping] = useState("")
  const [typingTimeout, setTypingTimeout] = useState("")
  const [open, setOpen] = useState(false)

  const { chatingUser, messages, notifications } = useSelector(state => state.chat)
  const messageRef = useRef(null)
  const { socket } = useSocket()
  const dispatch = useDispatch()

  const id = Cookies.get("userId")
  const jwt = Cookies.get("jwToken")


  useEffect(() => {
    if (chatingUser)
      dispatch(fetchMessages({ jwt, id: chatingUser._id }))
  }, [dispatch, jwt, chatingUser])
  useEffect(() => {
    if (!socket) {
      return
    }
    if (chatingUser) {
      socket.emit("join room", (chatingUser._id));

    }

  }, [socket, id, chatingUser])

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.on("recived message", (message) => {
      if (chatingUser && chatingUser?._id === message?.chat._id) {

        dispatch(SocketMessages({ message, messages }));
      } else {
        dispatch(messageNotification({ message, notifications }))
      }

    })
    socket.on("typing on", ({ typing, chatId, userId }) => {
      if (chatingUser && chatingUser?._id === chatId) {

        setTyping(typing)
        setUserTyping(userId)
      }
    })
    socket.on("typing off", ({ typing, chatId }) => {
      if (chatingUser && chatingUser?._id === chatId)
        setTyping(typing)
    })

    return () => {
      socket.off("recived message")
      socket.off("typing on")
      socket.off("typing off")
    }

  }, [socket, chatingUser, dispatch, messages, notifications])

  useEffect(() => {
    messageRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages])


  const toggleDrawer = (bool) => {
    setOpen(bool)

  }

  const handleMessage = (e) => {
    setSendMessage(e.target.value)
    socket.emit("typing", ({ typing: true, chatId: chatingUser._id, userId: id }))
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      socket.emit("stop typing", ({ typing: false, chatId: chatingUser._id }));

    }, 1100);

    setTypingTimeout(timeout);


  }


  const handleSend = (e) => {
    e.preventDefault()
    if (sendMessage === "") {
      return
    }
    const messageData = { context: sendMessage, chatId: chatingUser._id }
    dispatch(sendMessages({ jwt, messageData }))
      .unwrap()
      .then((message) => {
        dispatch(SocketMessages({ message, messages }));
        socket.emit("send message", (message));
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
    if (i === messages.length - 1) {
      return true
    }
    return (messages[i + 1]?.sender._id !== u._id)
  }
  const displayUserName = (messages, m, i) => {
    if (i === messages.length - 1) {
      return true
    }
    return (messages[i + 1]?.sender.username !== m.sender.username)
  }

  return (
    <>
      <Box component="div" sx={{ position: 'relative', height: "86vh", width: { xs: "100%", md: "67%" }, display: { xs: `${chatingUser ? "inline" : "none"}`, md: 'inline' }, }}>
        {chatingUser ? <>

          {/* chat Navbar */}

          <Box sx={{ boxShadow: 3, padding: { xs: "10px", md: "10px 10px 10px 20px" }, display: 'flex', alignItems: 'center', gap: "10px" }}>
            <IconButton onClick={handleArrowBtn} sx={{ display: { md: "none" } }}><ArrowBackIcon /></IconButton>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>

              <Box onClick={() => toggleDrawer(true)} sx={{ display: 'flex', alignItems: 'center', gap: "15px", cursor: 'pointer' }}>

                <Avatar src={chatingUser.isGroup ? chatingUser.pic : chatingUser.users.find(user => (user._id !== id)
                ).pic} alt='chat pic' />
                <Typography fontSize="20px" sx={{ textTransform: 'capitalize' }}>{chatingUser.isGroup ? chatingUser.chatName : chatingUser.users.filter(user => (user._id !== id))[0].username}</Typography>
              </Box>
              {chatingUser.isGroup &&
                <Drawer anchor='right' open={open} onClose={() => toggleDrawer(false)}>
                  <GroupUserDetails onClick={toggleDrawer} />
                </Drawer>}

              {/* Typing show */}

              <Box sx={{ marginLeft: "50px" }}>
                {typing && <>
                  {chatingUser.isGroup ?
                    chatingUser.users.map(user => {
                      if (user._id === userTyping) {
                        return <Typography key={user._id}>{user.username} typing...</Typography>
                      }
                      return <Typography key={user._id}></Typography>
                    })
                    :
                    <Typography>Typing...</Typography>
                  }
                </>}
              </Box>
            </Box>
          </Box>

          {/* messages dispaly */}

          <Box
            sx={{ height: "70vh", marginTop: "2px", overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', marginRight: "10px" }}>

            {/* <p>{JSON.stringify(messages[messages.length-1])}</p> */}


            {messages && <>
              {messages?.map((message, i) => (
                <Box key={message._id}
                  component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Dates display logic */}

                  {dateLogic(messages, message.updatedAt.split("T")[0], i) &&
                    <Typography sx={{ marginLeft:"auto",marginRight:"auto",mt:'10px',padding:"6px",backgroundColor:"#EFEEEA",borderRadius:"20px" }}>
                      {message.updatedAt.split("T")[0]}
                    </Typography>
                  }

                  {/* Single message details display */}

                  {message.left === false ?

                    <Box sx={{ alignSelf: `${message.sender._id === id ? 'end' : "start"}`, display: 'flex' }}>

                      {/* users pic display */}

                      {message.chat.isGroup &&
                        <>
                          {message.sender._id !== id &&
                            <>
                              {message.chat.users.map((user) => {
                                if (user._id === message.sender._id) {

                                  return (
                                    <Box component="div" key={user._id}>

                                      {displayUserPic(messages, user, i) ?
                                        <>
                                          <Avatar sx={{ width: "30px", height: "30px" }} src={user.pic} alt='user pic' />
                                        </>
                                        :
                                        <Box component="div" sx={{ width: "30px", height: "30px" }}></Box>
                                      }
                                    </Box>
                                  )
                                }
                                else {
                                  return (<Box key={user._id}></Box>)
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

                        <Box sx={{ minHeight: "40px", gap: "5px", maxWidth: { xs: "60vw", md: "30vw" }, color: `${message.sender._id === id ? "white" : "#000000"}`, backgroundColor: `${message.sender._id === id ? "purple" : "#d9fdd3"}`, marginBottom: "10px", display: 'flex', padding: "0px 5px 0px 5px", borderRadius: "10px" }}>

                          {/* Message */}


                          <Typography sx={{ alignSelf: 'center',fontSize:"19px" }}>
                            {message.message}
                          </Typography>

                          {/* Time */}

                          <Typography sx={{ fontSize: "10px", alignSelf: "end" }}>{new Date(message.updatedAt).toString().split(" ")[4].slice(0, -3)}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    :

                    //  users remove or left message

                    <Box component="span" sx={{marginLeft:"auto",marginRight:"auto",marginTop:"10px",marginRight:"auto", padding: "8px",display:'flex',justifyContent:'center',fontSize:"19px",backgroundColor:"#EFEEEA",borderRadius:"20px" }}>{message.message}

                    </Box>}
                </Box>

              ))}
            </>}
            <Box
              ref={messageRef}></Box>

          </Box>


          {/* send Messages */}

          <Box component="form" onSubmit={handleSend}>
            <OutlinedInput
              sx={{ position: 'fixed', backgroundColor: 'white', width: { xs: "96%", md: "63%" }, bottom: 0, margin: { xs: "10px" } }}
              placeholder='Chat ...'
              value={sendMessage}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton onClick={handleSend}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              }
              onChange={handleMessage}
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