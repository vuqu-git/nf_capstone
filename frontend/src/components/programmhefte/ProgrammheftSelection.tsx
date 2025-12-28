import { Form } from "react-bootstrap";
import React from "react";
import ProgrammheftDTOSelection from "../../types/ProgrammheftDTOSelection.ts";

interface ProgrammheftSelectionProps {
    allProgrammhefte: ProgrammheftDTOSelection[];
    selectedPnr: number | undefined;
    onSelectProgrammheft: (id: number | undefined) => void;
    textForDefaultOption: string | undefined;
}

export default function ProgrammheftSelection({
                                                  allProgrammhefte,
                                                  selectedPnr,
                                                  onSelectProgrammheft,
                                            textForDefaultOption  = "Select a Programmheft to edit (or leave empty to add new)",
                                        }: Readonly<ProgrammheftSelectionProps>) {

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSelectProgrammheft(Number(e.target.value) || undefined);
    }

    return (
        <div>
            <Form.Label htmlFor="programmheft-selection">Programmheft selection</Form.Label>
    <Form.Select
    id="programmheft-selection" // Add id to connect to the label
    value={selectedPnr ?? ""}
    onChange={handleSelectChange}
    >
    <option value="">{textForDefaultOption}</option>
    {allProgrammhefte.map((p: ProgrammheftDTOSelection) => (
        <option key={p.pnr} value={p.pnr}>
        {`⌛ ${p.gueltigBis} | ${p.titel}`}
        </option>
    ))}
    </Form.Select>
    </div>
    );
};