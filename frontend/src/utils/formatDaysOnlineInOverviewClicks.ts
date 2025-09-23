export function formatDaysOnlineInOverviewClicks(sData: string, wDate: string): number {
    const now = new Date();
    const dateS = new Date(sData);
    const dateW = new Date(wDate);

    // Reset time to 00:00:00 for all dates
    now.setHours(0, 0, 0, 0);
    dateS.setHours(0, 0, 0, 0);
    dateW.setHours(0, 0, 0, 0);

    // Calculate the difference in milliseconds
    const nowMinusW = now.getTime() - dateW.getTime();
    const sMinusW = dateS.getTime() - dateW.getTime();

    // Convert to days, rounding down
    const nowMinusWDays = Math.floor(nowMinusW / (1000 * 60 * 60 * 24));
    const sMinusWDays = Math.floor(sMinusW / (1000 * 60 * 60 * 24));

    // Return the minimum
    return Math.min(nowMinusWDays, sMinusWDays);
}