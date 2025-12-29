// types/StimmabgabeByUmfrageDTO.ts
export interface StimmabgabeByUmfrageDTO {
    snr?: number;
    datum: string | null;
    isSessionDuplicate: boolean | null;
    isUserDuplicate: boolean | null;

    onr: number;

    umfrageAnlass?: string;
    auswahloptionLink?: string;
    auswahloptionTitel?: string;
    auswahloptionDetails?: string;
}