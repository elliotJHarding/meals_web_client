import {PlanDto} from "@elliotJHarding/meals-api";

export default class MealPlan {
    plans: PlanDto[];

    static formatDate(date: Date) {
        return `${date.getUTCFullYear()}-${date.toLocaleDateString('en-gb', {month: '2-digit'})}-${date.toLocaleDateString('en-gb', {day: '2-digit'})}`;
    }

    findPlan(date: string | null): PlanDto | undefined {
        if (date == null) {
            return undefined;
        }
        const parsedDate = new Date(Date.parse(date));
        return this.plans.find((plan) => {
            const planDate = new Date(plan.date!);
            return planDate.getUTCFullYear() === parsedDate.getUTCFullYear() &&
                planDate.getUTCMonth() === parsedDate.getUTCMonth() &&
                planDate.getUTCDate() === parsedDate.getUTCDate();
        });
    }

    constructor(plans: PlanDto[]) {
        this.plans = plans?.sort((a, b) => {
            const dateA = new Date(a.date!);
            const dateB = new Date(b.date!);
            return dateA.getTime() - dateB.getTime();
        }) ?? [];
    }

    isEmpty(): boolean {
        return this.plans.find(plan => (plan.planMeals || []).length > 0) == null;
    }

    from(): string {
        if (this.plans.length === 0) return '';
        const firstDate = new Date(this.plans[0].date!);
        return MealPlan.formatDate(firstDate);
    }

    to(): string {
        if (this.plans.length === 0) return '';
        const lastDate = new Date(this.plans[this.plans.length - 1].date!);
        return MealPlan.formatDate(lastDate);
    }

    getAdjacentDates(date: Date): { next: Date | null, prev: Date | null } {
        const index = this.plans.findIndex(p => {
            const planDate = new Date(p.date!);
            return planDate.getTime() === date.getTime();
        });

        if (index === -1) return { next: null, prev: null };

        return {
            next: this.plans[index + 1]?.date ? new Date(this.plans[index + 1].date!) : null,
            prev: this.plans[index - 1]?.date ? new Date(this.plans[index - 1].date!) : null
        };
    }

    // Helper method to filter out a plan by both date and ID to prevent duplicates
    static filterOutPlan(plans: PlanDto[], planToRemove: PlanDto): PlanDto[] {
        return plans.filter(p => {
            // If both plans have IDs, compare by ID
            if (p.id && planToRemove.id) {
                return p.id !== planToRemove.id;
            }
            // If either plan lacks an ID, compare by date
            const pDate = new Date(p.date!);
            const removeDate = new Date(planToRemove.date!);
            return !(pDate.getUTCFullYear() === removeDate.getUTCFullYear() &&
                pDate.getUTCMonth() === removeDate.getUTCMonth() &&
                pDate.getUTCDate() === removeDate.getUTCDate());
        });
    }
}