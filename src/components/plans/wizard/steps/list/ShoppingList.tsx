import {Card, Divider, Stack, Typography} from "@mui/material";
import {motion} from "framer-motion";
import Box from "@mui/material/Box";
import MealPlan from "../../../../../domain/MealPlan.ts";
import {ContentCopy} from "@mui/icons-material";
import Button from "@mui/material-next/Button";

export default function ShoppingList({mealPlan} : {mealPlan: MealPlan}) {
    const items = mealPlan.plans
        .flatMap(plan => plan.shoppingListItems)
        .filter(item => item?.ingredient != null)
        .filter(item => item.checked)
        .map(item => <><Typography key={item.id}>{item.ingredient.name}</Typography><Divider variant='fullWidth'/></>);

    const onCopy = () => {
        navigator.clipboard.writeText(
            mealPlan.plans
                .flatMap(plan => plan.shoppingListItems)
                .filter(item => item?.ingredient != null)
                .filter(item => item.checked)
                .map(item => item.ingredient.name)
                .join(", ")
        );
    }

    return (
        <Card component={motion.div}
              initial={{x:200, opacity: 0 }}
              animate={{x:0, opacity: 1 }}
              exit={{x: -200, opacity: 0 }}>
            <Box sx={{padding: 3}} component={motion.div} layout>
                <Stack direction='row' justifyContent='space-between' spacing={2} component={motion.div} layout>
                    <Typography variant='h6'>Shopping List</Typography>
                    <Button startIcon={<ContentCopy/>} onClick={onCopy}>Copy</Button>
                </Stack>
                {items}
            </Box>
        </Card>
    );
}