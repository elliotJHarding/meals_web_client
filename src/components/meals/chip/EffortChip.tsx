import {Chip} from "@mui/material-next";
import {Effort} from "@harding/meals-api";
import {OverridableStringUnion} from "@mui/types";
import {ChipPropsColorOverrides, ChipPropsSizeOverrides} from "@mui/material-next/Chip/Chip.types";

export default function EffortChip({effort, size} : {effort : Effort | undefined, size : OverridableStringUnion<"small" | "medium", ChipPropsSizeOverrides> | undefined}) {

    const stringMap = new Map<Effort, string>([
        ['LOW', 'Easy'],
        ['MEDIUM', 'Medium'],
        ['HIGH', 'Hard'],
    ])

    const colorMap = new Map<Effort, OverridableStringUnion<'primary' | 'secondary' | 'tertiary' | 'error' | 'info' | 'success' | 'warning', ChipPropsColorOverrides>>([
        ['LOW', 'success'],
        ['MEDIUM', 'warning'],
        ['HIGH', 'error']
    ])

    return effort == null ? null : (
        <Chip variant={'elevated'} size={size} color={colorMap.get(effort)} label={stringMap.get(effort)}/>
    );
}
