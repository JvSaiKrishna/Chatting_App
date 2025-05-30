import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ClearIcon from '@mui/icons-material/Clear';
import UsersData from './UsersData';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Input, InputLabel, List, Skeleton, TextField, Tooltip, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup, fetchUser } from '../Slices/ChatSlice';
import Cookies from "js-cookie"



const DialogBox = () => {
    const [pic, setPic] = useState("");
    const [groupName, setGroupName] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([])
    const [open, setOpen] = useState(false);
    const { loading, newUsers } = useSelector(state => state.chat)

    const jwt = Cookies.get("jwToken")
    const dispatch = useDispatch()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleGroupPic = (e) => {
        const file = e.target.files[0]
        let reader = new FileReader();
        reader.onloadend = () => {
            setPic(reader.result)

        };
        reader.readAsDataURL(file)

    }

    const onClickUser = (user) => {
        if (!(groupMembers?.includes(user._id))) {
            setGroupMembers(prev => {
                return [...prev, user._id]
            })
            setSelectedUsers(prev => {
                return [...prev, user]
            })

        }
    }


    const handleSrchFriends = (e) => {
        let search = e.target.value
        if (search === '') {
            search = null
        }
        dispatch(fetchUser({ jwt, search }))
    }

    const handleRemove = (user) => {
        setGroupMembers(prev => {
            const updateMembers = prev.filter(x => {
                return (x !== user._id)
            })
            return updateMembers
        })
        setSelectedUsers(prev => {
            const updateMembers = prev.filter(x => {
                return (x._id !== user._id)
            })
            return updateMembers
        })

    }

    const handleAdd = () => {
        if (!groupName || !groupMembers) {
            return
        }
        const groupData = { groupPic: pic, groupName, groupMembers }
        dispatch(createGroup({ jwt, groupData }))
        setGroupName("")
        setGroupMembers('')
        handleClose()


    }


    return (
        <>
            {/* Icon code */}

            <Tooltip title="Create group">
                <IconButton variant="outlined" onClick={handleClickOpen}>
                    <AddIcon sx={{ width: "30px", height: "30px" }} />

                </IconButton>
            </Tooltip>

            <Dialog
                fullWidth={true}
                maxWidth={'xs'}
                open={open}
                onClose={handleClose}

            >
                <DialogTitle sx={{ textAlign: 'center' }}>Create Group</DialogTitle>
                <DialogContent>

                    {/* Add pic */}

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        <Avatar sx={{
                            width: "100px", height: "100px"
                        }} src={pic ? pic : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} alt='Group pic' />
                        <InputLabel htmlFor="photo" sx={{ cursor: 'pointer', position: 'relative', top: "-6px", left: "20px" }}>
                            <PhotoCameraIcon />
                            <TextField id='photo' onChange={handleGroupPic} sx={{ display: 'none' }}
                                type="file"
                            />
                        </InputLabel>
                    </Box>

                    {/* group Name */}

                    <Input
                        sx={{ marginBottom: "30px", width: "100%" }}
                        type='text'
                        placeholder='Group Name'
                        required
                        onChange={(e) => setGroupName(e.target.value)}

                    />
                    <br />

                    {/* display friends names after add */}

                    <Box sx={{ display: 'flex' }}>
                        {selectedUsers?.map(user => {
                            return (

                                <Box component="div" key={user._id} sx={{ backgroundColor: "purple", display: 'flex', alignItems: 'center', margin: "0 5px 5px 0 ", paddingLeft: "5px", color: "white" }}>

                                    <Typography>{user.username}</Typography>
                                    <IconButton onClick={() => handleRemove(user)}>
                                        <ClearIcon sx={{ color: 'white' }} />
                                    </IconButton>
                                </Box>

                            )
                        })}
                    </Box>

                    {/* Search friends */}

                    <Input
                        sx={{ width: "100%" }}
                        placeholder='Search friends'
                        type='search'
                        onChange={handleSrchFriends}
                        required

                    />

                    {/* display friends list after search */}

                    {loading ?
                        <>
                            <Skeleton animation="wave" sx={{ height: "70px" }} />
                            <Skeleton animation="wave" sx={{ height: "70px" }} />
                            <Skeleton animation="wave" sx={{ height: "70px" }} />
                        </>
                        :
                        <>
                            <List>

                                {newUsers?.map(user => {
                                    //  return <p>{JSON.stringify(user)}</p>
                                    return <UsersData onClickUser={onClickUser} user={user} key={user._id} />
                                })}
                            </List>
                        </>}
                </DialogContent>
                <DialogActions>
                    <Button disabled={loading} onClick={() => handleAdd()} variant='contained' type="submit">ADD</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}


export default DialogBox