import {UnitDto} from "@harding/meals-api";

export function parseUnit(units: UnitDto[], input: string): UnitDto | null {
    let matchingUnit = units.find((unit) => {
        let matchers: string[] = [
            unit.longStem ?? '',
            unit.shortStem ?? '',
        ];

        if (unit.longPluralise && unit.longStem) {
            matchers.push(`${unit.longStem}s`);
        }
        if (unit.shortPluralise && unit.shortStem) {
            matchers.push(`${unit.shortStem}s`);
        }

        return matchers.includes(input);
    });

    return matchingUnit == null ? null : matchingUnit;
}
