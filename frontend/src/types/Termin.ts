interface Termin {
    tnr?: number; // Primary key, auto-generated, so it might not be present when creating a new Termin
    vorstellungsbeginn?: string; // LocalDateTime represented as an ISO 8601 string in JSON
    titel?: string | null;
    text?: string | null;
    kurztext?: string | null;
    besonderheit?: string | null;
    bild?: string | null;
    offsetImageInGallery?: string | null;
    startReservierung?: string | null; // LocalDate will likely be represented as an ISO 8601 string in JSON (YYYY-MM-DD)
    linkReservierung?: string | null;
    sonderfarbeTitel?: number | null;
    sonderfarbe?: string | null;
    veroeffentlichen?: number | null;
    patenschaft?: string | null;
}

export default Termin;