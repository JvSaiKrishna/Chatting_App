import React, { useEffect } from 'react'
import Appbar from '../components/AppBar'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import SideBar from '../components/SideBar'
import ChatBoard from '../components/ChatBoard'
import { SocketProvider } from '../Context/socketContext'


const Dashboard = () => {
  const { isAuthorized } = useSelector(state => state.auth)

  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login")
    }

  }, [isAuthorized, navigate])
  return (
    <>

      <SocketProvider>
      <Appbar />
        <Box component="div" sx={{ display: 'flex', marginTop: "80px", width: "100vw", }}>
          <SideBar />
          <ChatBoard />
        </Box>
      </SocketProvider>
    </>
  )
}

export default Dashboard