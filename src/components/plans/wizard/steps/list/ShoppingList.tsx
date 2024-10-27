import {Card} from "@mui/material";
import {motion} from "framer-motion";
import Box from "@mui/material/Box";

export default function ShoppingList() {
    return (
        <Card component={motion.div}
              initial={{x:200, opacity: 0 }}
              animate={{x:0, opacity: 1 }}
              exit={{x: -200, opacity: 0 }}>
            <Box sx={{padding: 3}}>

            </Box>
        </Card>
    );
}