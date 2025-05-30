import React, { useEffect } from 'react'
import Appbar from '../components/AppBar'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import SideBar from '../components/SideBar'
import ChatBoard from '../components/ChatBoard'
import { useSocket } from '../Context/socketContext'
import { io } from "socket.io-client"
import Cookies from "js-cookie"



const Dashboard = () => {
  const { isAuthorized } = useSelector(state => state.auth)
  const { setSocket, socket } = useSocket()

  const navigate = useNavigate()
  const url = process.env.REACT_APP_BACKEND_URL
  const id = Cookies.get("userId")



  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login")
    }

  }, [isAuthorized, navigate])
  useEffect(() => {
    const Socket = io(url)
    setSocket(Socket)
    if(!Socket.connected){
      Socket.connect()
    }

  }, [setSocket, url])
  useEffect(() => {
    if (!socket) {
      return
    }
    socket.emit("user setup", (id))


  }, [socket, id])
  return (
    <>

      <Appbar />
      <Box component="div" sx={{ display: 'flex', marginTop: "80px", width: "100vw", }}>
        <SideBar />
        <ChatBoard />
      </Box>
    </>
  )
}

export default Dashboard