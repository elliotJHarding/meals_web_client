
export function formatPrepTime(prepTimeMinutes : number) : string {
    let hours : number = Math.floor(prepTimeMinutes / 60);
    let minutes : number = prepTimeMinutes % 60;

    let hh = hours < 10 ? `0${hours}` : hours;
    let mm = minutes < 10 ? `0${minutes}` : minutes;

    return `${hh}:${mm}`;
}