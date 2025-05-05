import React, { useEffect, useState } from 'react'
import { Box, Button, FormControl, FormLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { Authorization, Signup } from '../Slices/AuthSlice'


const SignUp = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pic, setPic] = useState("")
  const [isShowPwd, setISShowPwd] = useState(false)
  const [isShowconfPwd, setISShowConfPwd] = useState(false)
  const { loading, isAuthorized } = useSelector(state => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(Authorization())

  }, [dispatch])

  useEffect(() => {
    if (isAuthorized) {
      navigate('/dashboard', { replace: true })
      return
    }

  }, [isAuthorized, navigate])




  const handleImg = (file) => {
    if (!file) {
      return
    }
    let reader = new FileReader();
    reader.onloadend = () => {
      setPic(reader.result)

    };
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const userData = { username, email, password, confirmPassword, pic }
    dispatch(Signup(userData))
      .unwrap()
      .then(() => {
        alert("Successfully Sign up")
        navigate("/login", { replace: true })
      })
      .catch(error =>
        alert(error.message)

      )
      .finally(() => {
        setUsername("")
        setEmail("")
        setConfirmPassword("")
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

            <FormControl variant='outlined' sx={{ width: "100%" }}>

              <TextField
                label="Name"
                required
                name="username"
                value={username}
                fullWidth
                margin="normal"
                type='text'
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <br />
            <FormControl sx={{ width: "100%" }}>
              <TextField
                label="Email"
                required
                variant="outlined"
                name="email"
                value={email}
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
                id='outlined-adornment-password'

                label="Password"
                value={password}
                required
                type={isShowPwd ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge='end'
                      sx={{ cursor: 'pointer', color: 'black' }}
                      onClick={() => setISShowPwd((isShowPwd) => !isShowPwd)}>
                      {isShowPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <br />

            <FormControl sx={{ width: "100%", marginTop: "15px" }} variant="outlined">

              <InputLabel htmlFor="outlined-adornment-Confirmpassword">Confirm Password *</InputLabel>
              <OutlinedInput
                id='outlined-adornment-Confirmpassword"'

                label="Confirm Password"
                value={confirmPassword}
                required
                type={isShowconfPwd ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge='end'
                      sx={{ cursor: 'pointer', color: 'black' }}
                      onClick={() => setISShowConfPwd((isShowconfPwd) => !isShowconfPwd)}>
                      {isShowconfPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            <br />
            <FormControl sx={{ width: "100%", marginTop:"15px" }}>
              <FormLabel sx={{ fontSize: "18px", color: "black", opacity: "65%" }}>Profile</FormLabel>
              <TextField
                sx={{ marginTop: "2px" }}
                variant="outlined"
                name="pic"
                fullWidth
                margin="normal"
                type='file'
                onChange={(e) => handleImg(e.target.files[0])}
              />

            </FormControl>

            <Box component="div" mt="10px" textAlign='center'>
              <Button loading={loading} sx={{ width: "100%", height: "50px", fontSize: '16px' }} variant='contained' type='submit'>
                Sign Up
              </Button>
            </Box>
            <Typography component={Link} to="/login" sx={{color:"blue", cursor: 'pointer', display: 'flex', justifyContent: 'center', marginTop: "20px", textDecoration: "none" }}>
              Click here for a Sign in
            </Typography>

          </Box>
        </Box>
      </Box>

    </>
  )
}

export default SignUp