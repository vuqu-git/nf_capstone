import FilmDTOOverviewSemester from "./FilmDTOOverviewSemester.ts";
import ReiheDTOGallery from "./ReiheDTOGallery.ts";

// this one mirrors TerminDTOWithFilmDTOOverviewSemester
// for entries on the OverviewSemester component
interface TerminDTOWithFilmDTOOverviewSemester{
    tnr: number;
    vorstellungsbeginn?: string;
    titel?: string | null;
    terminBesonderheit?: string | null;
    mainfilms: FilmDTOOverviewSemester[];
    reihen: ReiheDTOGallery[];
    terminGesamtlaufzeit: number;
    isCanceled?: boolean | null;
}

export default TerminDTOWithFilmDTOOverviewSemester;