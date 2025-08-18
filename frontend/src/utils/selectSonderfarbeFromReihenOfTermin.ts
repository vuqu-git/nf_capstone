import TerminDTOWithFilmAndReiheDTOGallery from "../types/TerminDTOWithFilmAndReiheDTOGallery.ts";

export function selectSonderfarbeFromReihenOfTermin(
    termin: TerminDTOWithFilmAndReiheDTOGallery
): string | null {

    if (termin.reihen.length > 0) {
        const sonderfarbeList = termin.reihen.map(r => r.sonderfarbe);
        const length = sonderfarbeList.length;
        if (length > 0) {
            const randomIndex = Math.floor(Math.random() * length);
            const selectedSonderfarbe = sonderfarbeList[randomIndex]?.trim() ?? null;

            // explicit
            // const selectedSonderfarbe = sonderfarbeList[randomIndex]
            //     ? sonderfarbeList[randomIndex].trim()
            //     : null;

            return selectedSonderfarbe;
        }
    }
    return null;
}