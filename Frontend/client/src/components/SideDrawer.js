import { Container, Typography } from '@mui/material'
import Drawer from './Drawer'

const SideDrawer = ({ toggleDrawer }) => {




    return (
        <>
            <Container sx={{ width: { xs: "60vw", sm: "47vw", md: "35vw", lg: "30vw" }, marginTop: '20px', display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }} >
                <Typography sx={{ fontSize: { xs: "20px", md: "24px" } }} marginBottom="20px">
                    Search New Users
                </Typography>
                <Drawer toggleDrawer={toggleDrawer}/>
               
            </Container>
        </>
    )
}

export default SideDrawer