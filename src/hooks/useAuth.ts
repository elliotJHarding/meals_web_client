import {useContext} from "react";
import {AuthContext} from "../contexts/AuthContext.tsx";
import Auth from "../repository/Auth.ts";
// import UserRepository from "../repository/UserRepository.ts";

export const useAuth = () => {
    const {auth, setAuth} : {auth : Auth, setAuth : any} = useContext(AuthContext);

    // const repository = new UserRepository(auth);

    return {auth, setAuth}

}