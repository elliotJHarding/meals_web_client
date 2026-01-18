import {useEffect, useState} from "react";
import GroupRepository from "../../repository/GroupRepository.ts";
import {FamilyGroupDto} from "@harding/meals-api";

export const useGroup = (): {
    group: FamilyGroupDto;
    setGroup: (group: FamilyGroupDto) => void;
    createGroup: (onSuccess: (id: string) => void) => void;
    loading: boolean;
    failed: boolean
} => {

    const repository = new GroupRepository();

    const [loading, setLoading] = useState<boolean>(true);
    const [failed, setFailed] = useState<boolean>(false);

    const [group, setGroup] = useState<FamilyGroupDto>({uuid: undefined, users: []});

    useEffect(() => {
        repository.getGroup(
            (fetchedGroup: FamilyGroupDto) => {
                setGroup(fetchedGroup);
                setLoading(false);
            },
            () => {
                setFailed(true);
            }
        );
    }, []);

    const createGroup = (onSuccess: (id: string) => void): void => {
        repository.createGroup(onSuccess);
    };

    return {group, setGroup, createGroup, loading, failed};
}