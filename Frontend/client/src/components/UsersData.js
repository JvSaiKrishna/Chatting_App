import { Avatar, Box, ListItem, Typography } from '@mui/material'
import React from 'react'

const UsersData = (props) => {
    const { user, toggleDrawer, onClickUser } = props

    const handleUserClick = () => {
        if (onClickUser) {
            onClickUser(user)
        }
        else {
            toggleDrawer(false, user)
        }

    }
    return (
        <>
            <ListItem onClick={() => { handleUserClick() }} sx={{ width: "100%", color: "black", ":hover": { backgroundColor: "purple", color: "white" }, backgroundColor: 'lightgray', marginTop: "4px", borderRadius: "5px", }}  >
                <Avatar sx={{ marginRight: '10px' }} src={user.pic} alt='profile' />
                <Box sx={{}}>

                    <Typography sx={{ marginBottom: "10px" }}>
                        {user.username}
                    </Typography>
                    <Typography sx={{}}>
                        <strong>Email:</strong> <em>{user.email}</em>
                    </Typography>
                </Box>
            </ListItem>
        </>
    )
}

export default UsersData