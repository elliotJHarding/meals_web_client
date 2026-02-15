import {Card, Checkbox, Stack, Typography} from "@mui/material";
import {IngredientDto, Longevity} from "@elliotJHarding/meals-api";
import {motion} from "framer-motion";
import {KitchenOutlined, DoorSlidingOutlined} from "@mui/icons-material";

const longevityIcon: Record<string, React.ReactNode> = {
    [Longevity.FRESH]: <KitchenOutlined sx={{fontSize: 18, opacity: 0.55}}/>,
    [Longevity.CUPBOARD]: <DoorSlidingOutlined sx={{fontSize: 18, opacity: 0.55}}/>,
};

export default function IngredientCheck({ingredient, checked, onToggle}: {
    ingredient: IngredientDto | undefined,
    checked: boolean | undefined,
    onToggle: () => void,
}) {
    const icon = ingredient?.metadata?.longevity ? longevityIcon[ingredient.metadata.longevity] : null;

    return (
        <Card sx={{padding: 1, cursor: 'pointer'}} onClick={onToggle} component={motion.div}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}>
            <Stack direction='row' gap={1} alignItems='center'>
                <Checkbox checked={checked}/>
                <Typography>{ingredient?.amount}{ingredient?.unit?.shortStem}</Typography>
                <Typography sx={{flex: 1}}>{ingredient?.name}</Typography>
                {icon}
            </Stack>
        </Card>
    )
}
