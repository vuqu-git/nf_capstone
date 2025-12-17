import FilmDTOFormPlus from "./FilmDTOFormPlus.ts";
import TerminDTOScreeningdetails from "./TerminDTOScreeningdetails.ts";

// this one mirrors the Java class TerminDTOWithFilmsDTOFormPlus
// for entries on the ScreeningDetails component
export default interface TerminDTOWithFilmsDTOFormPlus {
    termin: TerminDTOScreeningdetails;
    mainfilms: FilmDTOFormPlus[];
    vorfilms: FilmDTOFormPlus[];
    terminGesamtlaufzeit: number;
    isCanceled: boolean | null
}
