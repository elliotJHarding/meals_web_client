
export type Unit = {
    id : bigint,
    code : string,
    shortStem : string,
    shortSpace : boolean,
    shortPluralise : boolean,
    longStem: string,
    longSpace : boolean,
    longPluralise : boolean,
    _links: {
        self: {
            href: string
        }
    }
}

export function parseUnit(units: Unit[], input: string) : Unit | null {
    let matchingUnit = units.find((unit) => {
        let matchers : string[] = [
            unit.longStem,
            unit.shortStem,
        ]

        unit.longPluralise && matchers.push(`${unit.longStem}s`)
        unit.shortPluralise && matchers.push(`${unit.shortStem}s`)

        return (matchers.includes(input))
    })

    return matchingUnit == null ? null :
        matchingUnit;

}
