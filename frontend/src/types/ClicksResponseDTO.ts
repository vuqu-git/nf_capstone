export type ClicksResponseDTO = {
    tnr: number;
    vorstellungsbeginn: string; // ISO 8601 format (e.g., "2025-09-16T12:00:00")
    titel?: string;
    sessionScreeningClicks: number;
    userScreeningClicks: number;
    sessionCalendarClicks: number;
    userCalendarClicks: number;
    visitors?: number;
    insideProgrammheft?: boolean;
    withTerminbesonderheit?: boolean;
    inNumberReihen?: number;
    onlineSince: string; // ISO 8601 date format (e.g., "2025-09-16")
    isCanceled?: boolean;
}