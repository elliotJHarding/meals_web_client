import {Stack} from "@mui/material";
import CircularProgress from "@mui/material-next/CircularProgress";
import {useEffect, useState} from "react";
import Error from "../error/Error.tsx";
import {useSearchParams} from "react-router-dom";
import {useLinkCalendar} from "../../hooks/calendar/useLinkCalendar.ts";

export default function LinkCalendar() {

    const [searchParams] = useSearchParams();

    const {linkCalendar} = useLinkCalendar();

    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const code = searchParams.get('code');
        if (code != null) {
            linkCalendar(code);
        } else {
            setError(true);
        }
    }, [])

    return (
        <Stack alignItems={'center'} justifyContent={'center'} sx={{height: '80vh'}}>
            {!error ? <CircularProgress/> : <Error message={"Could not link Calendar"}/>}
        </Stack>
    )
}