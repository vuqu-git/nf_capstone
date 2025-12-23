// UmfrageDTO
import {AuswahloptionNestedDTO} from "./AuswahloptionNestedDTO.ts";

export interface UmfrageDTO {
    unr: number;       // ID of the survey (null/undefined for new ones)
    anlass: string;
    endDatum: string | null; // ISO Date String 'YYYY-MM-DD'
    beschreibung: string;
    auswahloptionendtos: AuswahloptionNestedDTO[];
}
