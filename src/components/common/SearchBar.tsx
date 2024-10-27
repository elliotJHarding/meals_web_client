import {InputAdornment, TextField, useTheme} from "@mui/material";
import {Search} from "@mui/icons-material";

export default function SearchBar({searchValue, onChange} : {searchValue : string | null, onChange : (newValue : string) => void}) {

    const theme = useTheme();

    return (
        <TextField
            type='search'
            color='primary'
            value={searchValue}
            onChange={(event) => onChange(event.target.value)}
            fullWidth
            InputProps={{
                startAdornment: (
                    <InputAdornment position='start'>
                        <Search/>
                    </InputAdornment>
                ),
                sx: {borderRadius: 3, backgroundColor: theme.palette.background.paper}
            }}
        />
    )
}