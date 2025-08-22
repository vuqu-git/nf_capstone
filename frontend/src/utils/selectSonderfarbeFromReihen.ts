import ReiheDTOGallery from "../types/ReiheDTOGallery.ts";
import ReiheDTOFormWithTermineAndFilme from "../types/ReiheDTOFormWithTermineAndFilme.ts";

export function selectSonderfarbeFromReihen(
    reihen: ReiheDTOGallery[] | ReiheDTOFormWithTermineAndFilme[]
): string | null {

    if (reihen.length > 0) {
        const sonderfarbeList = reihen.map(r => r.sonderfarbe);
        const length = sonderfarbeList.length;
        if (length > 0) {
            const randomIndex = Math.floor(Math.random() * length);
            const selectedSonderfarbe = sonderfarbeList[randomIndex]?.trim() || null;

            // explicit
            // const selectedSonderfarbe = sonderfarbeList[randomIndex]
            //     ? sonderfarbeList[randomIndex].trim()
            //     : null;

            return selectedSonderfarbe;
        }
    }
    return null;
}