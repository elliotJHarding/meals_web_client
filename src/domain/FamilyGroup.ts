import User from "./User.ts";

export default interface FamilyGroup {
    uuid?: string;
    users: User[];
}
