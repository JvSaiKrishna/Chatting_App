import React, { useEffect, useState } from 'react'
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, Authorization } from "../Slices/AuthSlice.js"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isShow, setIsShow] = useState(false)
  const { loading, isAuthorized } = useSelector(state => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(Authorization())

  }, [dispatch])

  useEffect(() => {
    // console.log(isAuthorized)
    if (isAuthorized) {
      return navigate('/dashboard', { replace: true })

    }

  }, [isAuthorized, navigate])


  const handleSubmit = (e) => {
    e.preventDefault()
    const userData = { email, password }
    dispatch(LogIn(userData))
      .unwrap()
      .then(() => {
        navigate("/dashboard", { replace: true })
      })
      .catch(error =>
        alert(error.message)

      )
      .finally(() => {

        setEmail("")
        setPassword("")
      })

  }

  return (
    <>
      <Box sx={{ height: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
        <Box sx={{ width: { xs: "80%", sm: "50%", md: "40%", lg: "30%" }, display: "flex", flexDirection: 'column', alignItems: 'center' }}>
          <Box component="div" sx={{ display: "flex", alignItems: 'center' }}>

            <Box component="img" sx={{
              width: 80, height: 80
            }}
              alt='logo' src="https://static.vecteezy.com/system/resources/previews/012/344/461/large_2x/logo-chatting-app-template-design-talk-logo-designed-for-chat-applications-vector.jpg" />
            <Typography variant='h4' sx={{
              fontSize: 30
            }}>
              Chat App
            </Typography>

          </Box>

          <Box sx={{ width: "100%" }} component="form" onSubmit={handleSubmit}>
            <FormControl sx={{ width: "100%" }}>
              <TextField
                label="Email"
                required
                variant="outlined"
                value={email}
                name="email"
                fullWidth
                margin="normal"
                type='email'
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <br />
            <FormControl sx={{ width: "100%", marginTop: "15px" }} variant="outlined">

              <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
              <OutlinedInput
                
                label="Password"
                value={password}
                required
                type={isShow ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge='end'
                      sx={{ cursor: 'pointer' }}
                      onClick={() => setIsShow((isShow) => !isShow)}>
                      {isShow ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Box component="div" mt="10px" textAlign='center'>
              <Button loading={loading} sx={{ width: "100%", height: "50px", fontSize: '16px' }} variant='contained' type='submit'>
                Sign in
              </Button>
            </Box>
            <Typography component={Link} to="/" sx={{color:"blue", cursor: 'pointer', display: 'flex', justifyContent: 'center', marginTop: "20px", textDecoration: "none" }}>
              Click here for a New Account
            </Typography>

          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Login