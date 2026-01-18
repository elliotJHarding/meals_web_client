import {useEffect, useState} from "react";
import UnitRepository from "../../repository/UnitRepository.ts";
import {UnitDto} from "@elliotJHarding/meals-api";

export const useUnits = (): {units: UnitDto[], setUnits: any, loading: boolean} => {

    const repository = new UnitRepository();

    const [loading, setLoading] = useState(true);

    const [units, setUnits]: [units: UnitDto[], any] = useState([]);

    useEffect(() => {
        repository.getUnits((fetchedUnits) => {
            setUnits(fetchedUnits);
            setLoading(false);
        });
    }, []);

    return {units, setUnits, loading};
}