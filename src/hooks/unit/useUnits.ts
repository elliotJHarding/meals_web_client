import {useEffect, useState} from "react";
import UnitRepository from "../../repository/UnitRepository.ts";
import {Unit} from "../../domain/Unit.ts";

export const useUnits = () : {units : Unit[], setUnits : any, loading : boolean} => {

    const repository = new UnitRepository();

    const [loading, setLoading] = useState(true);

    const [units, setUnits] : [units : Unit[], any] = useState([]);

    useEffect(() => {
        repository.getUnits((fetchedUnits) => {
            setUnits(fetchedUnits)
            setLoading(false)
        });
    }, []);

    return {units, setUnits, loading} ;
}