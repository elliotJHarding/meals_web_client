import {Stack, Typography} from "@mui/material";
import {motion} from "framer-motion";

export default function Error({ message, icon }: { message: string , icon: React.ReactNode }) {
    return (
        <Stack direction='column' gap={1} sx={{height: '100%', width: '100%', opacity: 0.6}} alignItems='center' justifyContent='center'
               component={motion.div}
               initial={{y:100, opacity: 0 }}
               animate={{y:0, opacity: 0.6 }}
               exit={{y: 100, opacity: 0 }}>
            {icon}
            <Typography variant='h5'>{message}</Typography>
        </Stack>
    )
}