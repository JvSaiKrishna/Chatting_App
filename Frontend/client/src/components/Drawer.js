import { Box, IconButton, InputAdornment, List, OutlinedInput, Skeleton } from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../Slices/ChatSlice';
import UsersData from './UsersData.js';
import Cookies from "js-cookie"

const Drawer = ({toggleDrawer,onClickUser}) => {
    const [search, setSearch] = useState("")
    const { loading, newUsers } = useSelector(state => state.chat)

    const dispatch = useDispatch()
    const jwt = Cookies.get("jwToken")




    const handleSearch = (e) => {
        if (e.key === "Enter") {
            dispatch(fetchUser({ jwt, search }))
        }
    }
    const handleIcon = () => {
        dispatch(fetchUser({ jwt, search }))

    }
    return (
        <>
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
                                return <UsersData toggleDrawer={toggleDrawer} onClickUser={onClickUser} user={user} key={user._id} />
                            })}
                        </List>
                    </>}

        </>
    )
}

export default Drawer