// types/StimmabgabeByUmfrageDTO.ts
export interface StimmabgabeByUmfrageDTO {
    snr?: number;
    datum: string | null;
    isSessionDuplicate: boolean | null;
    isUserDuplicate: boolean | null;

    onr: number;
    auswahloptionTitel?: string;
    auswahloptionDetails?: string;
    umfrageAnlass?: string;
}