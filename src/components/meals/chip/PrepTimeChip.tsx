import {Chip} from "@mui/material-next";
import {Timer} from "@mui/icons-material";
import {formatPrepTime} from "../../common/Utils.ts";
import {ChipPropsSizeOverrides} from "@mui/material-next/Chip/Chip.types";
import {OverridableStringUnion} from "@mui/types";

export default function PrepTimeChip({prepTimeMinutes, size} : {prepTimeMinutes : number, size : OverridableStringUnion<"small" | "medium", ChipPropsSizeOverrides> | undefined}) {

    const prepTimeFormatted = formatPrepTime(prepTimeMinutes);

    return prepTimeMinutes == null ? null : (
        <Chip variant="outlined" size={size} label={prepTimeFormatted} icon={<Timer/>}/>
    );
}
