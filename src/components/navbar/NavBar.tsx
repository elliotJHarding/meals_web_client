import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import {useAuth} from "../../hooks/useAuth.ts";
import NavBarAvatar from "./NavBarAvatar.tsx";
import NavBarSmall from "./NavBarSmall.tsx";
import NavBarLarge from "./NavBarLarge.tsx";
import GoogleAuth from "../common/GoogleAuth.tsx";


export default function NavBar() {

    const {auth} = useAuth();

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const avatar =
        <NavBarAvatar onClick={handleOpenUserMenu} anchorEl={anchorElUser} onClose={handleCloseUserMenu}/>

    return (
        <AppBar position="sticky" color='default' elevation={0} sx={{py : {md: 0}}}>
            <Toolbar>
                <NavBarLarge/>
                <NavBarSmall/>
                <Box sx={{flexGrow: 1}}></Box>
                {auth.isAuthenticated() ? avatar : <GoogleAuth/>}
            </Toolbar>
        </AppBar>
    );
}
