import {CredentialResponse, GoogleLogin} from "@react-oauth/google";

export default function GoogleAuth() {

    const handleAuthSuccess = (credentialResponse : CredentialResponse) : void => {
        if (credentialResponse.credential != null) {
            // auth.setToken(credentialResponse.credential)
            console.log(credentialResponse);
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