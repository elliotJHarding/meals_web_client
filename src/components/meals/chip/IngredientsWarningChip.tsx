import {Chip} from "@mui/material-next";
import {WarningAmber, WarningAmberRounded} from "@mui/icons-material";
import {OverridableStringUnion} from "@mui/types";
import {ChipPropsSizeOverrides} from "@mui/material-next/Chip/Chip.types";
import Meal from "../../../domain/Meal.ts";

export default function IngredientsWarningChip({meal, size} : {
    meal: Meal | undefined,
    size: OverridableStringUnion<"small" | "medium", ChipPropsSizeOverrides> | undefined
}) {

    if (!meal || meal.ingredients?.length > 0) {
        return null;
    }

    return (
        <Chip
            variant="elevated"
            size={size}
            color='error'
            label="No ingredients"
            icon={<WarningAmberRounded/>}
        />
    );
}
