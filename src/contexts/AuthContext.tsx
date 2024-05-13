import React, {createContext,  useState} from "react";
import Auth from "../repository/Auth.ts";

export type Token = string | null

export interface AuthContext {
    auth : Auth;
    setAuth: (auth : Auth) => void;
}

export const AuthContext = createContext<AuthContext>({
    auth: new Auth(null),
    setAuth: () => {}
});

export function AuthProvider({children} : {children : React.ReactNode}) {
    const [auth, setAuth] = useState(new Auth(null));

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}
