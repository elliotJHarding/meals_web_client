import {Card, Divider, FormControlLabel, Stack, Typography, useTheme} from "@mui/material";
import {motion} from "framer-motion";
import Box from "@mui/material/Box";
import MealPlan from "../../../../../domain/MealPlan.ts";
import {ContentCopy} from "@mui/icons-material";
import Button from "@mui/material-next/Button";
import {shortFormat} from "../../../../../domain/Ingredient.ts";
import {useState} from "react";
import Switch from "@mui/material-next/Switch";

export default function ShoppingList({mealPlan} : {mealPlan: MealPlan}) {
    const [showUnits, setShowUnits] = useState(true);

    const theme = useTheme();

    const formatItem = (item: any) => {
        return showUnits ? shortFormat(item.ingredient) : item.ingredient.name;
    };

    const items = mealPlan.plans
        .flatMap(plan => plan.shoppingListItems)
        .filter(item => item?.ingredient != null)
        .filter(item => item.checked)
        .map(item => <><Typography key={item.id}>{formatItem(item)}</Typography><Divider variant='fullWidth'/></>);

    const onCopy = () => {
        navigator.clipboard.writeText(
            mealPlan.plans
                .flatMap(plan => plan.shoppingListItems)
                .filter(item => item?.ingredient != null)
                .filter(item => item.checked)
                .map(item => formatItem(item))
                .join(", ")
        );
    }

    return (
        <Card component={motion.div}
              initial={{x:200, opacity: 0 }}
              animate={{x:0, opacity: 1 }}
              exit={{x: -200, opacity: 0 }}>
            <Box sx={{padding: 3}} component={motion.div} layout>
                <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={2} component={motion.div} layout>
                    <Typography variant='h6'>Shopping List</Typography>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <FormControlLabel
                            control={<Switch checked={showUnits} color={'primary'} onChange={(e) => setShowUnits(e.target.checked)} />}
                            label="Units"
                        />
                        <Button startIcon={<ContentCopy/>} onClick={onCopy}>Copy</Button>
                    </Stack>
                </Stack>
                {items}
            </Box>
        </Card>
    );
}