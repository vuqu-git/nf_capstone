import FilmDTOOverviewArchive from "./FilmDTOOverviewArchive.ts";

// this one mirrors TerminDTOWithFilmDTOOverviewArchive
interface TerminDTOWithFilmDTOOverviewArchive{
    tnr: number;
    vorstellungsbeginn?: string;
    semester?: string;
    titel?: string | null;
    mainfilms: FilmDTOOverviewArchive[];
    finalVeroeffentlichen: boolean;
    isCanceled?: boolean | null;
}

export default TerminDTOWithFilmDTOOverviewArchive;