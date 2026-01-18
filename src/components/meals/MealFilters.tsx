import {Select, Stack} from "@mui/material";
import {FormControl, InputLabel} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import MealFilter from "../../filter/MealFilter.ts";
import {Effort} from "@harding/meals-api";
import Box from "@mui/material/Box";
import {Chip} from "@mui/material-next";

export default function MealFilters({filter, setFilter} : {filter : MealFilter, setFilter : any, open : boolean, setOpen : any}) {

    const handleEffortOnChange = (effort : Effort[]) => setFilter(new MealFilter({...filter.criteria, effort: effort}))

    return (
            <Stack gap={1} sx={{mt: 1}} position='sticky'>
                <FormControl fullWidth>
                    <InputLabel id="effort-filter-label">Effort</InputLabel>
                    <Select
                        labelId="effort-filter-label"
                        label="Effort"
                        multiple
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        value={filter.criteria.effort}
                        onChange={(event) => handleEffortOnChange(event.target.value as Effort[])}
                    >
                        <MenuItem value="LOW">Low Effort</MenuItem>
                        <MenuItem value="MEDIUM">Medium Effort</MenuItem>
                        <MenuItem value="HIGH">High Effort</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
    )
}