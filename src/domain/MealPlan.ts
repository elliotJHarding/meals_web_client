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
        return this.plans.find(plan => plan.planMeals.length > 0) == null;
    }

    from() {
        return MealPlan.formatDate(this.plans[0].date);
    }

    to() {
        return MealPlan.formatDate(this.plans[this.plans.length - 1].date);
    }
}