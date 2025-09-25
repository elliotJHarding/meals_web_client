import {Chip} from "@mui/material-next";
import {
    DoneAll,
    Inventory,
    InventoryOutlined,
    PlaylistAddCheck,
    PlaylistRemove,
    ReceiptLong,
    RemoveDone
} from "@mui/icons-material";
import {OverridableStringUnion} from "@mui/types";
import {ChipPropsSizeOverrides} from "@mui/material-next/Chip/Chip.types";
import Meal from "../../../domain/Meal.ts";

export default function IngredientsStatusChip({meal, size}: {meal: Meal, size?: OverridableStringUnion<"small" | "medium", ChipPropsSizeOverrides>}) {
    
    const hasIngredients = meal.ingredients && meal.ingredients.length > 0;
    
    return (
        <Chip 
            variant={"outlined"}
            size={size}
            color={hasIngredients ? 'none' : "warning"}
            label={hasIngredients ? undefined : "Ingredients"}
            icon={hasIngredients ? <PlaylistAddCheck/> : <PlaylistRemove/>}
        />
    );
}