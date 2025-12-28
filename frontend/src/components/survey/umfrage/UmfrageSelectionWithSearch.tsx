import React, {useMemo} from "react";
import { Form } from "react-bootstrap";
import {UmfrageSelectionDTO} from "../../../types/UmfrageSelectionDTO.ts";
import Select, {SingleValue} from "react-select";
import {formSelectionWithSearchStyles} from "../../styles/formSelectionWithSearchStyles.ts";

interface UmfrageSelectionWithSearchProps {
    allUmfragen: UmfrageSelectionDTO[];
    selectedUmfrageId: number | undefined;
    onSelectUmfrage: (id: number | undefined) => void;
    textForDefaultOption?: string;
}

interface UmfrageOption {
    value: number;  // value of select option
    label: React.ReactNode; // label of select option; if using JSX (i.e. HTML tags used), otherwise string
}

const UmfrageSelectionWithSearch: React.FC<UmfrageSelectionWithSearchProps> = ({
                                                                                   allUmfragen,
                                                                                   selectedUmfrageId,
                                                                                   onSelectUmfrage, // this handle steers two state variables in the caller UmfrageForum
                                                                                   textForDefaultOption = "Select/search a umfrage to edit (or leave empty to add new)"
                                                                               }) => {

    // const [selectedOption, setSelectedOption] = useState<UmfrageOption | null>(null); // contains the currently selected option

    // 1. Transform raw data into Select options
    const umfrageOptions = useMemo(() =>
        allUmfragen.map(u => ({
            value: u.unr,
            label: `${u.anlass} (${u.endDatum}) | #${u.unr}`
        })), [allUmfragen]
    );

    // 2. Derive current selection from props
    //      Find the matching option object based on the ID passed from parent
    //      This ensures that if 'anlass' changes in 'allUmfragen', this label updates instantly
    //      → Calculate the current selection directly from props/memoized options
    const currentSelection = umfrageOptions.find(opt => opt.value === selectedUmfrageId) || null;

    const handleReactSelectChange = (
        newValue: SingleValue<UmfrageOption>,
        // actionMeta: ActionMeta<UmfrageOption>
    ) => {
        // We only notify the parent; we don't need to update local state here
        onSelectUmfrage(newValue?.value);
    };

    // // this effect ensures that when the parent component changes selectedFilmId, your React Select component updates accordingly,
    // // value={selectedOption} is the React Select equivalent of value={selectedFilmId ?? ""}, but you need the additional useEffect to keep them synchronized.
    // useEffect(() => {
    //     if (selectedUmfrageId) {
    //         const option = umfrageOptions.find(opt => opt.value === selectedUmfrageId);
    //         setSelectedOption(option || null);
    //     } else {
    //         setSelectedOption(null);
    //     }
    // }, [selectedUmfrageId]);
// ========>
// ========>
// ========>
    // It is not needed anymore because we shifted from Synchronized State to Derived State.
    //
    // In React, if a value can be calculated purely based on the props a component receives, you should calculate it "on the fly" during the render rather than storing it in a local state.
    //
    // Here is exactly why the useEffect is redundant now:
    // 1. The "Single Source of Truth"
    //
    //     Old way: You had two sources of truth. The parent held the id, and the child held the option object. You needed useEffect like a "glue" to keep them in sync. If the parent's data changed (like the title), the glue didn't always stick because the effect didn't know the list had updated.
    //
    //     New way: The parent is the only source of truth. The child component simply says: "I have an ID and a list of options. I will find the matching object right now, every time I render."
    //
    // 2. How the Render Cycle handles it
    //
    // Every time your parent component (UmfrageForm) updates—whether you select a new item OR update an existing title—it triggers a re-render of the child.
    //
    //     Parent updates: allUmfragen or selectedUmfrageId changes.
    //
    //     Child re-runs: The UmfrageSelectionWithSearch function executes again from top to bottom.
    //
    //     Calculation: The line const currentSelection = umfrageOptions.find(...) runs immediately with the latest data.
    //
    //     Display: React Select receives the fresh currentSelection and shows the updated title.
    //
    // Feature,     Old Way (with useEffect),                                       New Way (Derived State)
    // Logic Type,  "Imperative: ""When X happens, do Y to update Z.""",            "Declarative: ""The selection is whatever matches the ID in this list."""
    // State,       "Duplicate (ID in parent, Object in child).",                   Single (Only ID in parent).
    // Bugs,        Stale data if you forget a dependency in the array.,            Impossible to be stale; it calculates during render.
    // Performance, Slightly slower (requires a second render after the effect).,   Faster (calculated during the first render).

    // Summary
    //
    // The useEffect was a manual synchronization step. By calculating currentSelection directly in the component body, you've automated that synchronization. If the anlass (title) changes in the allUmfragen array, umfrageOptions changes, which causes currentSelection to find the object with the new title automatically.

    return (
        <div className="mb-3">
            <Form.Label htmlFor="umfrage-selection">Umfrage selection/search</Form.Label>
            <Select
                options={umfrageOptions}
                value={currentSelection} // No local state needed
                onChange={handleReactSelectChange}
                isClearable={true}
                isSearchable={true}
                placeholder={textForDefaultOption}
                styles={formSelectionWithSearchStyles}
                inputId="umfrage-selection"
            />
        </div>
    );
};

export default UmfrageSelectionWithSearch;
