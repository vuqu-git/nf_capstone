export function formatDateTime(
    isoString: string | undefined,
    withLeadingZeros: boolean = false,
    withShortYear: boolean = false
): { date: string; time: string; weekday: string } | null {
    // Check if isoString is undefined or invalid
    if (!isoString) {
        // console.warn("Invalid input: isoString is undefined.");
        return null;
    }

    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
        // console.warn("Invalid input: isoString does not represent a valid date.");
        return null;
    }

    const germanWeekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const weekday = germanWeekdays[date.getDay()];
    const day = withLeadingZeros ? String(date.getDate()).padStart(2, '0') : String(date.getDate());
    const month = withLeadingZeros ? String(date.getMonth() + 1).padStart(2, '0') : String(date.getMonth() + 1);
    const year = withShortYear
        ? String(date.getFullYear()).slice(-2)
        : String(date.getFullYear());

    const formattedDate = `${day}.${month}.${year}`;
    const formattedTime = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} Uhr`;

    return { date: formattedDate, time: formattedTime, weekday };
}
