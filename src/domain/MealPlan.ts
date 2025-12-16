import Plan from "./Plan.ts";

export default class MealPlan {
    plans: Plan[];

    static formatDate(date : Date) {
        return `${date.getUTCFullYear()}-${date.toLocaleDateString('en-gb', {month: '2-digit'})}-${date.toLocaleDateString('en-gb', {day: '2-digit'})}`
    }

    findPlan(date: string | null) {
        if (date == null) {
            return undefined;
        }
        const parsedDate = new Date(Date.parse(date))
        return this.plans.find((plan) =>
            plan.date.getUTCFullYear() === parsedDate.getUTCFullYear() &&
            plan.date.getUTCMonth() === parsedDate.getUTCMonth() &&
            plan.date.getUTCDate() === parsedDate.getUTCDate()
        )
    }

    constructor(plans: Plan[]) {
        this.plans = plans?.sort((a, b) => a.date.getTime() - b.date.getTime()) ?? [];
    }

    isEmpty() {
        return this.plans.find(plan => (plan.planMeals || []).length > 0) == null;
    }

    from() {
        return MealPlan.formatDate(this.plans[0].date);
    }

    to() {
        return MealPlan.formatDate(this.plans[this.plans.length - 1].date);
    }

    getAdjacentDates(date: Date): { next: Date | null, prev: Date | null } {
        const index = this.plans.findIndex(p =>
            p.date.getTime() === date.getTime()
        );

        if (index === -1) return { next: null, prev: null };

        return {
            next: this.plans[index + 1]?.date || null,
            prev: this.plans[index - 1]?.date || null
        };
    }

    // Helper method to filter out a plan by both date and ID to prevent duplicates
    static filterOutPlan(plans: Plan[], planToRemove: Plan): Plan[] {
        return plans.filter(p => {
            // If both plans have IDs, compare by ID
            if (p.id && planToRemove.id) {
                return p.id !== planToRemove.id;
            }
            // If either plan lacks an ID, compare by date
            const pDate = p.date;
            const removeDate = planToRemove.date;
            return !(pDate.getUTCFullYear() === removeDate.getUTCFullYear() &&
                     pDate.getUTCMonth() === removeDate.getUTCMonth() &&
                     pDate.getUTCDate() === removeDate.getUTCDate());
        });
    }
}