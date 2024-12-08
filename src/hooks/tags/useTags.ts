import {useEffect, useState} from "react";
import MealTagRepository from "../../repository/MealTagRepository.ts";
import MealTag from "../../domain/MealTag.ts";

export const useTags = () : {tags : MealTag[], setTags : any, findTag: (id: number) => MealTag | undefined, loading : boolean} => {

    const repository = new MealTagRepository();

    const [loading, setLoading] = useState(true);

    const [tags, setTags] : [tags : MealTag[], any] = useState([]);

    const findTag = (id: number) : MealTag | undefined => tags.find(tag => tag.id == id)

    useEffect(() => {
        repository.getTags((fetchedTags) => {
            setTags(fetchedTags)
            setLoading(false)
        });
    }, []);

    return {
        tags,
        setTags,
        findTag,
        loading
    } ;
}