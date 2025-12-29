import FilmDTOOverviewArchive from "./FilmDTOOverviewArchive.ts";

// this one mirrors TerminDTOWithFilmDTOOverviewArchive
interface TerminDTOWithFilmDTOOverviewArchive{
    tnr: number;
    vorstellungsbeginn?: string;
    semester?: string;
    titel?: string | null;
    films: FilmDTOOverviewArchive[];
    isCanceled?: boolean | null;
}

export default TerminDTOWithFilmDTOOverviewArchive;