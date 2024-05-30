import * as React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import {userOptions} from "./Options.tsx";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import {motion} from "framer-motion";

export default function NavBarAvatar({onClick, anchorEl, onClose, avatarUrl}: {
    onClick: (event: React.MouseEvent<HTMLElement>) => void,
    anchorEl: HTMLElement | null,
    onClose: () => void,
    avatarUrl: string,
}) {
    return <Box sx={{flexGrow: 0}}>
        <Tooltip title="Open settings">
            <IconButton onClick={onClick} sx={{p: 0}}>
                <Avatar alt="Remy Sharp" src={avatarUrl}
                        component={motion.div}
                        initial={{scale: 0, opacity: 0 }}
                        animate={{scale: 1, opacity: 1 }}
                        exit={{scale: 0, opacity: 0 }}
                />
            </IconButton>
        </Tooltip>
        <Menu
            sx={{mt: "45px"}}
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            keepMounted
            elevation={0}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={onClose}
        >
            {userOptions.map((option) => (
                <MenuItem key={option.title} onClick={onClose}>
                    <Box>
                        {option.icon}
                    </Box>
                    <Typography textAlign="center">{option.title}</Typography>
                </MenuItem>
            ))}
        </Menu>
    </Box>;
}
