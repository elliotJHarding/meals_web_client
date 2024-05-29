import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {useAuth} from "../../hooks/useAuth.ts";

export default function GoogleAuth() {

    const {login} = useAuth();

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
            size={"large"}
            shape={"pill"}
            onSuccess={handleAuthSuccess}
            onError={handleAuthFailure}
        />
    )
}