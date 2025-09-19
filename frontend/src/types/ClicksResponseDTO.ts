export type ClicksResponseDTO = {
    vorstellungsbeginn: string; // ISO 8601 format (e.g., "2025-09-16T12:00:00")
    titel: string;
    sessionTerminClicks: number;
    userTerminClicks: number;
    sessionCalendarClicks: number;
    userCalendarClicks: number;

    visitors?: number;
    outsideProgrammheft?: boolean;
    onlineSince: string; // ISO 8601 date format (e.g., "2025-09-16")
}