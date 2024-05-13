import MetaDataRepository, {MetaData} from "../repository/MetaDataRepository.ts";
import {useState} from "react";

export const useMetadataLookup = () => {
    const repository : MetaDataRepository = new MetaDataRepository('http://localhost:3000');

    const [loading, setLoading] = useState<boolean>(true);

    const lookupMetadata = (url : string, onSuccess : (metaData : MetaData) => void) => {
        repository.getMetadata(url, (metadata : MetaData) => {
            onSuccess(metadata);
            setLoading(false);
        });
    }

    return {lookupMetadata, loading};
}