import { Form } from "react-bootstrap";
import React, {useEffect, useMemo, useState} from "react";
import {FilmDTOSelection} from "../../types/FilmDTOSelection.ts";
import {formatFilmDetailsInFilmSelectOption} from "../../utils/formatFilmDetailsInFilmSelectOption.ts";
import Select, {ActionMeta, SingleValue} from "react-select";
import {formSelectionWithSearchStyles} from "../styles/formSelectionWithSearchStyles.ts";

interface FilmSelectionWithSearchProps {
    allFilms: FilmDTOSelection[];
    selectedFilmId: number | undefined;
    onSelectFilm: (id: number  | undefined) => void;
    textForDefaultOption: string | undefined;
}

interface FilmOption {
    value: number;  // value of select option
    label: React.ReactNode; // label of select option; if using JSX (i.e. HTML tags used), otherwise string
}

export default function FilmSelectionWithSearch({
                                          allFilms,
                                          selectedFilmId,
                                          onSelectFilm, // this handle steers two state variables in the caller FilmForm
                                          textForDefaultOption = "Select/search a film to edit (or leave empty to add new)",
                                      }: Readonly<FilmSelectionWithSearchProps>) {
    const [isClearable] = useState(true);
    const [isSearchable] = useState(true);

    const [selectedOption, setSelectedOption] = useState<FilmOption | null>(null); // contains the currently selected option

    const filmOptions = useMemo(() =>
        allFilms.map(f => ({
            value: f.fnr,
            label: `${formatFilmDetailsInFilmSelectOption(f.titel, f.regie, f.jahr)} | #${f.fnr}`
        })), [allFilms]
    );

    const handleReactSelectChange = (
        newValue: SingleValue<FilmOption>,
        actionMeta: ActionMeta<FilmOption>
    ) => {
        setSelectedOption(newValue);
        onSelectFilm(newValue?.value);
    };

    // this effect ensures that when the parent component changes selectedFilmId, your React Select component updates accordingly,
    // value={selectedOption} is the React Select equivalent of value={selectedFilmId ?? ""}, but you need the additional useEffect to keep them synchronized.
    useEffect(() => {
        if (selectedFilmId) {
            const option = filmOptions.find(opt => opt.value === selectedFilmId);
            setSelectedOption(option || null);
        } else {
            setSelectedOption(null);
        }
    }, [selectedFilmId]);

    return (
        <div>
            <Form.Label htmlFor="film-selection">Film selection/search</Form.Label>

            <Select
                options={filmOptions}

                value={selectedOption}  // equivalent of value={selectedFilmId ?? ""} in HTML select
                                        // here value expects the entire option object, while in an HTML select value expects a primitive value (string, number)
                onChange={handleReactSelectChange}

                isClearable={isClearable}
                isSearchable={isSearchable}
                placeholder={textForDefaultOption}
                noOptionsMessage={() => "Keine Filme gefunden"}

                styles={formSelectionWithSearchStyles}
                maxMenuHeight={500}
                inputId="film-selection" // React Select's built-in inputId prop; connects to the actual input element
            />
        </div>
    );
};