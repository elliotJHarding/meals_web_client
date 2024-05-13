import {Chip} from "@mui/material-next";
import {Person} from "@mui/icons-material";
import {OverridableStringUnion} from "@mui/types";
import {ChipPropsSizeOverrides} from "@mui/material-next/Chip/Chip.types";

export default function ServesChip({serves, size} : {serves : number, size:  OverridableStringUnion<"small" | "medium", ChipPropsSizeOverrides> | undefined}) {

    return serves == null ? null : (
        <Chip variant="outlined" size={size} label={serves} icon={<Person/>}/>
    );
}
