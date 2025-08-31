import CalendarRepository from "../../repository/CalendarRepository.ts";
import {useNavigate} from "react-router-dom";

export const useLinkCalendar = () => {
    const repository : CalendarRepository = new CalendarRepository();

    const navigate = useNavigate();

    const authorizeCalendar = () => {
         repository.authorizeCalendar(url => window.location.href = url);
    }

    const linkCalendar = (token: string) => {
        repository.linkCalendar(token, () =>{
            navigate("/plans");
        })
    }

    return {authorizeCalendar, linkCalendar};
}