import { Form } from "react-bootstrap";
import React, {useMemo} from "react";
import ReiheDTOSelection from "../../types/ReiheDTOSelection.ts";
import Select, {SingleValue} from "react-select";
import {formSelectionWithSearchStyles} from "../styles/formSelectionWithSearchStyles.ts";

interface ReiheSelectionWithSearchProps {
    allReihen: ReiheDTOSelection[];
    selectedReiheId: number | undefined;
    onSelectReihe: (id: number | undefined) => void;
    textForDefaultOption: string | undefined;
}

interface ReiheOption {
    value: number;  // value of select option
    label: React.ReactNode; // label of select option; if using JSX (i.e. HTML tags used), otherwise string
}

export default function ReiheSelectionWithSearch({
                                           allReihen,
                                           selectedReiheId,
                                           onSelectReihe,
                                           textForDefaultOption  = "Select a Reihe to edit (or leave unselected to add a new Reihe)",
                                       }: Readonly<ReiheSelectionWithSearchProps>) {

    // 1. Transform raw data into Select options
    const reiheOptions = useMemo(() =>
        allReihen.map(r => ({
            value: r.rnr,
            label: `${r.titel} | #${r.rnr}`
        })), [allReihen]
    );

    // 2. Derive the currently selected object directly from props
    const currentSelection = reiheOptions.find(opt => opt.value === selectedReiheId) || null;

    const handleReactSelectChange = (
        newValue: SingleValue<ReiheOption>,
        // actionMeta: ActionMeta<ReiheOption>
    ) => {
        onSelectReihe(newValue?.value);
    };


    return (
        <div>
            <Form.Label htmlFor="reihe-selection">Reihe selection/search</Form.Label>

            <Select
                options={reiheOptions}

                value={currentSelection} // Controlled directly by props
                onChange={handleReactSelectChange}

                isClearable={true}
                isSearchable={true}
                placeholder={textForDefaultOption}
                noOptionsMessage={() => "Keine Reihen gefunden"}

                styles={formSelectionWithSearchStyles}
                maxMenuHeight={500}
                inputId="reihe-selection" // React Select's built-in inputId prop; connects to the actual input element
            />
        </div>
    );
};