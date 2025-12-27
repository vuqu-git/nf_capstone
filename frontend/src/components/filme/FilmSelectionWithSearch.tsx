import { Form } from "react-bootstrap";
import React, {useMemo} from "react";
import {FilmDTOSelection} from "../../types/FilmDTOSelection.ts";
import {formatFilmDetailsInFilmSelectOption} from "../../utils/formatFilmDetailsInFilmSelectOption.ts";
import Select, {SingleValue} from "react-select";
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

    // 1. Transform raw data into Select options
    const filmOptions = useMemo(() =>
        allFilms.map(f => ({
            value: f.fnr,
            label: `${formatFilmDetailsInFilmSelectOption(f.titel, f.regie, f.jahr)} | #${f.fnr}`
        })), [allFilms]
    );

    // 2. Derive current selection directly from props
    const currentSelection = filmOptions.find(opt => opt.value === selectedFilmId) || null;

    const handleReactSelectChange = (
        newValue: SingleValue<FilmOption>,
        // actionMeta: ActionMeta<FilmOption>
    ) => {
        onSelectFilm(newValue?.value);
    };

    return (
        <div>
            <Form.Label htmlFor="film-selection">Film selection/search</Form.Label>

            <Select
                options={filmOptions}

                value={currentSelection} // Used derived variable
                onChange={handleReactSelectChange}

                isClearable={true}
                isSearchable={true}
                placeholder={textForDefaultOption}
                noOptionsMessage={() => "Keine Filme gefunden"}

                styles={formSelectionWithSearchStyles}
                maxMenuHeight={500}
                inputId="film-selection" // React Select's built-in inputId prop; connects to the actual input element
            />
        </div>
    );
};