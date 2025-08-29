import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {useAuth} from "../../hooks/useAuth.ts";

export default function GoogleAuth({variant} : {variant : "small" | "large" | "medium" }) {

    const {login} = useAuth(false);

    const handleAuthSuccess = (credentialResponse : CredentialResponse) : void => {
        if (credentialResponse.credential != null) {
            console.log(credentialResponse);
            login(credentialResponse.credential);
        } else {
            console.log("JWT Token not present")
        }
    }

    const handleAuthFailure = () : void => {
        console.log("Google Authentication error")
    }

    return (
        <GoogleLogin
            size={variant}
            shape={"pill"}
            onSuccess={handleAuthSuccess}
            onError={handleAuthFailure}
        />
    )
}