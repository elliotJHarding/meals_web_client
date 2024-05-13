import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
import {motion} from "framer-motion";
import Button from "@mui/material-next/Button";
import {Cancel, Check} from "@mui/icons-material";

export default function ConfirmCancelButtons({handleConfirm, handleCancel} : {handleConfirm : () => void, handleCancel : () => void}) {
    return (
        <Stack direction='row' component={motion.div} layout>
            <Box sx={{flexGrow: 1}}/>
            <Stack direction='row' gap={1}>
                <Button startIcon={<Check/>} onClick={handleConfirm} variant='filled'
                        component={motion.div}
                        initial={{x:100, opacity: 0 }}
                        animate={{x:0, opacity: 1 }}
                        exit={{x: 100, opacity: 0 }}>
                    Confirm
                </Button>
                <Button startIcon={<Cancel/>} onClick={handleCancel}
                        component={motion.div}
                        initial={{x:100, opacity: 0 }}
                        animate={{x:0, opacity: 1 }}
                        exit={{x: 100, opacity: 0 }}>
                    Cancel
                </Button>
            </Stack>
        </Stack>
    )
}
