import { Form } from "react-bootstrap";
import {Film} from "../../types/Film.ts";
import React from "react";

interface FilmSelectionProps {
    films: Film[];
    selectedFilmId: number | null;
    onSelectFilm: (id: number | null) => void;
}

const formatFilmDetails = (titel: string | undefined, stab: string | null | undefined, jahr: number | null | undefined): string => {
    let details = "";
    let titleWithSpace = titel;

    const hasStab = stab && stab.trim() !== "";
    const hasJahr = jahr !== null && jahr !== undefined && String(jahr).trim() !== "";

    if (hasStab || hasJahr) {
        titleWithSpace += " "; // Add a space after the title
        details += "(";
        if (hasStab) {
            details += stab.trim();
            if (hasJahr) {
                details += ", ";
            }
        }
        if (hasJahr) {
            details += String(jahr).trim();
        }
        details += ")";
    }

    return `${titleWithSpace}${details}`;
};

export default function FilmSelection({ films, selectedFilmId, onSelectFilm }: FilmSelectionProps) {

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSelectFilm(Number(e.target.value) || null);
    }

    return (
        <div>
            <Form.Label htmlFor="film-selection">Film selection</Form.Label>
            <Form.Select
                id="film-selection" // Add id to connect to the label
                value={selectedFilmId ?? ""} // Adjust the value prop to handle null by converting it to an empty string (""):
                onChange={handleSelectChange}
                style={{ backgroundColor: 'dimgrey', color: 'whitesmoke' }}
            >
                <option value="">Select a film to edit (or leave empty to add new)</option>
                {films.map((film) => (
                        <option key={film.fnr} value={film.fnr}>
                            {formatFilmDetails(film.titel, film.stab, film.jahr)}
                        </option>
                ))}
            </Form.Select>
        </div>
    );
};