import FilmDTOGallery from "./FilmDTOGallery.ts";
import ReiheDTOGallery from "./ReiheDTOGallery.ts";

// this one mirrors TerminDTOWithFilmAndReiheDTOGallery
interface TerminDTOWithFilmAndReiheDTOGallery {
    tnr: number;
    vorstellungsbeginn?: string;
    titel?: string | null;
    kurztext?: string | null;
    besonderheit?: string| null;
    bild?: string| null;
    offsetImageInGallery?: string| null;
    sonderfarbe?: string | null;
    veroeffentlichen?: number | null;
    isCanceled?: boolean | null;
    mainfilms: FilmDTOGallery[];
    reihen: ReiheDTOGallery[];
}

export default TerminDTOWithFilmAndReiheDTOGallery;