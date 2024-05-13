import {jwtDecode, JwtPayload} from "jwt-decode";
import {Token} from "../contexts/AuthContext.tsx";

interface DecodedToken extends JwtPayload {
    email : string;
    given_name: string;
    family_name : string;
    full_name : string;
    picture : string;
}

export default class User {
    private givenName : string | undefined;
    private familyName : string | undefined;
    private fullName : string | undefined;
    private picture : string | undefined;
    private email : string | undefined;

    constructor(token : Token) {
        if (token != null) {
            let user : DecodedToken = jwtDecode(token);
            this.givenName = user.given_name;
            this.familyName = user.family_name;
            this.fullName = user.family_name;
            this.picture = user.picture;
            this.email = user.email;
        }
    }


    get getGivenName(): string | undefined {
        return this.givenName;
    }

    get getFamilyName(): string | undefined {
        return this.familyName;
    }

    get getFullName(): string | undefined {
        return this.fullName;
    }

    get getPicture(): string | undefined {
        return this.picture;
    }

    get getEmail(): string | undefined {
        return this.email;
    }
}
