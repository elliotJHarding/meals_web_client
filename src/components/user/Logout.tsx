import {useAuth} from "../../hooks/useAuth.ts";
import {useEffect} from "react";

export default function Logout() {

    const {logout} = useAuth(false);

    useEffect(logout, []);

    return null;
}