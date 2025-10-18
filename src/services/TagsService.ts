import MealTagRepository from "../repository/MealTagRepository.ts";
import MealTag from "../domain/MealTag.ts";

/**
 * Singleton service for managing meal tags with in-memory caching.
 * Ensures tags are fetched from the API only once and shared across all components.
 */
class TagsService {
    private static instance: TagsService;
    private repository: MealTagRepository;
    private cachedTags: MealTag[] | null = null;
    private loading: boolean = false;
    private fetchPromise: Promise<MealTag[]> | null = null;

    private constructor() {
        this.repository = new MealTagRepository();
    }

    /**
     * Get the singleton instance of TagsService
     */
    public static getInstance(): TagsService {
        if (!TagsService.instance) {
            TagsService.instance = new TagsService();
        }
        return TagsService.instance;
    }

    /**
     * Get tags from cache or fetch from API if not cached
     * @param onSuccess Callback with tags array
     */
    public getTags(onSuccess: (tags: MealTag[]) => void): void {
        // If we have cached tags, return them immediately
        if (this.cachedTags !== null) {
            onSuccess(this.cachedTags);
            return;
        }

        // If a fetch is already in progress, wait for it
        if (this.fetchPromise) {
            this.fetchPromise.then(onSuccess);
            return;
        }

        // Start a new fetch
        this.loading = true;
        this.fetchPromise = new Promise<MealTag[]>((resolve) => {
            this.repository.getTags((fetchedTags) => {
                this.cachedTags = fetchedTags;
                this.loading = false;
                this.fetchPromise = null;
                resolve(fetchedTags);
                onSuccess(fetchedTags);
            });
        });
    }

    /**
     * Check if tags are currently being loaded
     */
    public isLoading(): boolean {
        return this.loading;
    }

    /**
     * Check if tags are cached
     */
    public isCached(): boolean {
        return this.cachedTags !== null;
    }

    /**
     * Clear the cache and fetch fresh tags from the API
     * Use this when tags have been modified (created, updated, or deleted)
     * @param onSuccess Callback with refreshed tags array
     */
    public refreshTags(onSuccess: (tags: MealTag[]) => void): void {
        this.cachedTags = null;
        this.fetchPromise = null;
        this.getTags(onSuccess);
    }

    /**
     * Get cached tags synchronously (returns null if not cached)
     * Prefer getTags() for async fetching with callback
     */
    public getCachedTags(): MealTag[] | null {
        return this.cachedTags;
    }
}

export default TagsService;
