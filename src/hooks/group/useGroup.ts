import {useEffect, useState} from "react";
import GroupRepository from "../../repository/GroupRepository.ts";
import FamilyGroup from "../../domain/FamilyGroup.ts";

export const useGroup = (): {
    group: FamilyGroup;
    setGroup: (group: FamilyGroup) => void;
    createGroup: (onSuccess: (id: string) => void) => void;
    loading: boolean;
    failed: boolean
} => {

    const repository = new GroupRepository();

    const [loading, setLoading] = useState<boolean>(true);
    const [failed, setFailed] = useState<boolean>(false);

    const [group, setGroup] = useState<FamilyGroup>({uuid: undefined, users: []});

    useEffect(() => {
            repository.getGroup(
                (fetchedGroup: FamilyGroup) => {
                    setGroup(fetchedGroup)
                    setLoading(false)
                },
                () => {
                    setFailed(true);
                }
            );
    }, [])

    const createGroup = (onSuccess : (id : string) => void) : void => {
        repository.createGroup(onSuccess);
    }

    return {group, setGroup, createGroup, loading, failed};
}