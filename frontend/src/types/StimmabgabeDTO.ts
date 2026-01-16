// types/StimmabgabeDTO.ts
export interface StimmabgabeDTO {
    snr?: number;
    datum: string | null;             // ISO string
    isd: boolean | null;
    iud: boolean | null;

    onr: number;                      // required
    unr: string;                      // required

    umfrageAnlass?: string;
    auswahloptionTitel?: string;
    auswahloptionDetails?: string;
    auswahloptionLink?: string;
}