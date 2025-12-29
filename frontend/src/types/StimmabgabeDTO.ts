// types/StimmabgabeDTO.ts
export interface StimmabgabeDTO {
    snr?: number;
    datum: string | null;             // ISO string
    isSessionDuplicate: boolean | null;
    isUserDuplicate: boolean | null;

    onr: number;                      // required
    unr: number;                      // required

    umfrageAnlass?: string;
    auswahloptionTitel?: string;
    auswahloptionDetails?: string;
    auswahloptionLink?: string;
}