import {Chip} from "@mui/material-next";
import {
    PlaylistAddCheck,
    PlaylistRemove
} from "@mui/icons-material";
import {OverridableStringUnion} from "@mui/types";
import {ChipPropsSizeOverrides} from "@mui/material-next/Chip/Chip.types";
import {MealDto} from "@harding/meals-api";

export default function IngredientsStatusChip({meal, size}: {meal: MealDto, size?: OverridableStringUnion<"small" | "medium", ChipPropsSizeOverrides>}) {
    
    const hasIngredients = meal.ingredients && meal.ingredients.length > 0;
    
    return (
        <Chip
            variant={"filled"}
            size={size}
            color={hasIngredients ? 'success' : 'error'}
            icon={hasIngredients ? <PlaylistAddCheck/> : <PlaylistRemove/>}
        />
    );
}

