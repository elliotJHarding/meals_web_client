import {useEffect, useState} from "react";
import MealTag from "../../domain/MealTag.ts";
import TagsService from "../../services/TagsService.ts";

export const useTags = () : {
    tags : MealTag[],
    setTags : any,
    findTag: (id: number) => MealTag | undefined,
    loading : boolean,
    refreshTags: () => void
} => {

    const tagsService = TagsService.getInstance();

    const [loading, setLoading] = useState(!tagsService.isCached());
    const [tags, setTags] : [tags : MealTag[], any] = useState(tagsService.getCachedTags() || []);

    const findTag = (id: number) : MealTag | undefined => tags.find(tag => tag.id == id)

    const refreshTags = () => {
        setLoading(true);
        tagsService.refreshTags((fetchedTags) => {
            setTags(fetchedTags);
            setLoading(false);
        });
    };

    useEffect(() => {
        // If tags are already cached, use them immediately
        if (tagsService.isCached()) {
            const cached = tagsService.getCachedTags();
            if (cached) {
                setTags(cached);
                setLoading(false);
            }
            return;
        }

        // Otherwise, fetch from the service (which will cache them)
        tagsService.getTags((fetchedTags) => {
            setTags(fetchedTags);
            setLoading(false);
        });
    }, []);

    return {
        tags,
        setTags,
        findTag,
        loading,
        refreshTags
    } ;
}