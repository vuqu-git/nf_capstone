interface TerminDTOScreeningdetails {
    tnr: number; // Primary key, auto-generated, so it might not be present when creating a new Termin
    vorstellungsbeginn: string; // LocalDateTime represented as an ISO 8601 string in JSON
    titel?: string | null;
    text?: string | null;
    besonderheit?: string | null;
    bild?: string | null;
    showImageInDetails?: boolean | null;
    startReservierung?: string | null; // LocalDate will likely be represented as an ISO 8601 string in JSON (YYYY-MM-DD)
    linkReservierung?: string | null;
    sonderfarbeTitel?: number | null;
    sonderfarbe?: string | null;
    veroeffentlichen?: number;
    isCanceled?: boolean | null;
}

export default TerminDTOScreeningdetails;