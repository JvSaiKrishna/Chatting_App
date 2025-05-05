import { Box, Container, IconButton, InputAdornment, List, OutlinedInput, Skeleton, Typography } from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../Slices/ChatSlice';
import UsersData from './UsersData.js';
import Cookies from "js-cookie"

const SideDrawer = ({ toggleDrawer }) => {
    const [search, setSearch] = useState("")
    const { loading, newUsers } = useSelector(state => state.chat)

    const dispatch = useDispatch()
    const jwt = Cookies.get("jwToken")




    const handleSearch = (e) => {
        if (e.key === "Enter") {
            dispatch(fetchUser({jwt,search}))
        }
    }
    const handleIcon = () => {
        dispatch(fetchUser({jwt, search}))

    }
    return (
        <>
            <Container sx={{ width: { xs: "60vw", sm: "47vw", md: "35vw", lg: "30vw" }, marginTop: '20px', display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }} >
                <Typography sx={{ fontSize: { xs: "20px", md: "24px" } }} marginBottom="20px">
                    Search New Users
                </Typography>
                <Box component='div' sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'

                }}>
                    <OutlinedInput
                        placeholder='Search ..'
                        fullWidth
                        onChange={(e) =>
                            setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        endAdornment={

                            <InputAdornment position='end'>
                                <IconButton onClick={handleIcon} edge="end">
                                    <SearchIcon fontSize='large' sx={{ display: { xs: 'none', sm: "inline" } }} />

                                </IconButton>
                            </InputAdornment>
                        }

                    />
                </Box>
                {loading ?
                    <>
                        <Skeleton animation="wave" sx={{ height: "70px" }} />
                        <Skeleton animation="wave" sx={{ height: "70px" }} />
                        <Skeleton animation="wave" sx={{ height: "70px" }} />
                        <Skeleton animation="wave" sx={{ height: "70px" }} />
                        <Skeleton animation="wave" sx={{ height: "70px" }} />
                        <Skeleton animation="wave" sx={{ height: "70px" }} />
                        <Skeleton animation="wave" sx={{ height: "70px" }} />
                    </>
                    :
                    <>
                        <List>

                            {newUsers.map(user => {
                                //  return <p>{JSON.stringify(user)}</p>
                                return <UsersData toggleDrawer={toggleDrawer} user={user} key={user._id} />
                            })}
                        </List>
                    </>}

            </Container>
        </>
    )
}

export default SideDrawer