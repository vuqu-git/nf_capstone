// UmfrageDTO
import {AuswahloptionNestedDTO} from "./AuswahloptionNestedDTO.ts";

export interface UmfrageDTO {
    unr: string;       // ID of the survey (null/undefined for new ones)
    anlass: string;
    endDatum: string; // ISO Date String 'YYYY-MM-DD'
    beschreibung: string;
    auswahloptionendtos: AuswahloptionNestedDTO[];
}
