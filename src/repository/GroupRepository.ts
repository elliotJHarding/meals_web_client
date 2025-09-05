import axios, {AxiosResponse} from "axios";
import ResourceRepository from "./ResourceRepository.ts";
import FamilyGroup from "../domain/FamilyGroup.ts";

export default class GroupRepository extends ResourceRepository {

    getGroup(onSuccess : (group : FamilyGroup) => void, onFailure : () => void) : void {
        console.info("Fetching Group")

        this.get(
            "familyGroup",
            (response : AxiosResponse) => {
                onSuccess(response.data);
            },
            // @ts-ignore
            () => {
                onFailure();
            }
        )
    }

    createGroup(onSuccess : (id : string) => void) : void {
        console.info("Creating Group")

        this.post(
            "familyGroup",
            null,
            (response : AxiosResponse) => {
                onSuccess(response.data);
            }
        )
    }

    joinGroup(uuid: string, onSuccess: () => void, onFailure: () => void): void {
        console.info("Joining Group", uuid)

        axios
            .post(
                this.url + `familyGroup/join/${uuid}`,
                null,
                {
                    headers: this.getHeaders(),
                    withCredentials: true,
                }
            )
            .then(() => {
                onSuccess();
            })
            .catch(() => {
                onFailure();
            });
    }
}
