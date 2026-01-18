import CalendarRepository from "../../repository/CalendarRepository.ts";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export const useLinkCalendar = () => {
    const repository : CalendarRepository = new CalendarRepository();
    const navigate = useNavigate();
    const [authorizing, setAuthorizing] = useState(false);

    const authorizeCalendar = () => {
        setAuthorizing(true);
        repository.authorizeCalendar(url => window.location.href = url);
    }

    const linkCalendar = (token: string) => {
        repository.linkCalendar(token, () =>{
            navigate("/plans");
        })
    }

    return {authorizeCalendar, linkCalendar, authorizing};
}