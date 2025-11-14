import { Avatar, Box, Button, Link, Typography } from '@mui/material'
import React from 'react'

export default function NotFound() {
  return (
    <Box>
      <Avatar sx={{width:{xs:"90%",md:"70%",lg:"58%",xl:"50%"},height:{xs:"90%",md:"70%",lg:"58%",xl:"50%"},margin:{md:"0 auto"}}} src="https://assets.ccbp.in/frontend/react-js/not-found-blog-img.png" alt="not found" />
      <Typography component={Link} sx={{textDecoration:"none",display:'flex',justifyContent:"center",margin:"0",padding:'0'}}  to="/dashboard">
        <Button variant='contained' sx={{width:{md:"200px"},height:{md:"40px"},fontSize:{md:"20px"},textTransform:'capitalize'}}  type="button">Dashboard</Button>
      </Typography>
    </Box>
  )
}