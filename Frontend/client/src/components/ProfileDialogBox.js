import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, Box, IconButton, InputLabel, Tooltip, Typography } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useDispatch, useSelector } from "react-redux"
import { UpdateProfile } from '../Slices/AuthSlice';
import Cookies from "js-cookie"



export default function ProfileDialogBox() {
    const [open, setOpen] = React.useState(false);
    const { profile,loading } = useSelector(state => state.auth)
    const [pic, setPic] = React.useState("");
    const dispatch = useDispatch()
    const jwt = Cookies.get("jwToken")
    const id = Cookies.get("userId")

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setPic("")
        setOpen(false);
    };

    const handlePic = (e) => {
        const file = e.target.files[0]
        let reader = new FileReader();
        reader.onloadend = () => {
            setPic(reader.result)

        };
        reader.readAsDataURL(file)

    }
    const handleUpdate = (e) => {
        if (pic === "") {
            return handleClose()
        }
        const userPic = {pic}
        dispatch(UpdateProfile({ jwt, id, userPic }))


    }


    return (
        <React.Fragment >
            <Tooltip title="Profile">
                <IconButton onClick={handleClickOpen} sx={{ color: "white" }}>
                    <AccountCircleIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <Dialog
                fullWidth

                open={open}
                onClose={handleClose}

            >
                <DialogTitle sx={{ textAlign: 'center' }}>My Profile</DialogTitle>
                <DialogContent>
                    {/* user pic */}

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        <Avatar sx={{
                            width: "100px", height: "100px"
                        }} src={pic ? pic : profile?.pic} alt='owner pic' />
                        <InputLabel htmlFor="photo" onChange={handlePic} sx={{ cursor: 'pointer', position: 'relative', top: "-6px", left: "20px" }}>
                            <PhotoCameraIcon />
                            <TextField id='photo' sx={{ display: 'none' }}
                                type="file"
                            />
                        </InputLabel>
                    </Box>

                    {/* user details */}

                    <Typography sx={{ width: "90%", height: "40px", fontSize: "20px", display: 'flex', alignItems: 'center', border: "1px solid blue", borderRadius: "10px", marginBottom: '20px', paddingLeft: "20px" }}>Name: {profile?.username}</Typography>
                    <Typography sx={{ width: "90%", height: "40px", fontSize: "20px", display: 'flex', alignItems: 'center', border: "1px solid blue", borderRadius: "10px", paddingLeft: "20px" }}>Email: {profile?.email}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button  onClick={handleClose}>Cancel</Button>
                    <Button disabled ={loading} type="submit" onClick={handleUpdate}>Update</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}