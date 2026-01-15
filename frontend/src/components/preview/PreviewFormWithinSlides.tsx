import TerminDTOWithFilmAndReiheDTOGallery from "../../types/TerminDTOWithFilmAndReiheDTOGallery.ts";
import React, {ChangeEvent} from "react";
import {Badge, Col, Container, Form, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {formatDateInTerminSelectOption} from "../../utils/formatDateInTerminSelectOption.ts";
import BackToTopButton from "../structural_components/BackToTopButton.tsx";
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";
import Header2 from "../structural_components/Header2.tsx";

interface Props {
    semesterTermine: TerminDTOWithFilmAndReiheDTOGallery[];
    selectedTnrs: number[];
    setSelectedTnrs: (value: number[]) => void;
    slideDuration: number;
    setSlideDuration: (newSlideDuration: number) => void;
    setShowPreview: (newShowPreview: boolean) => void;
    handleBack: () => void;
}

const PreviewFormWithinSlides: React.FC<Props> = ({
                                               semesterTermine,
                                               selectedTnrs,
                                               setSelectedTnrs,
                                               slideDuration,
                                               setSlideDuration,
                                               setShowPreview,
                                               handleBack,
                                           }) => {
    const handleSlideDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSlideDuration(parseInt(e.target.value, 10));
    };

    const handleScreeningSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
        let newSelectedTnrs: number[] = [];

        if (selectedValues.includes('all')) {
            newSelectedTnrs = semesterTermine.map((termin) => termin.tnr);
        } else if (selectedValues.includes('all_except_first')) {
            newSelectedTnrs = semesterTermine.slice(1).map((termin) => termin.tnr);
        } else {
            newSelectedTnrs = selectedValues.map(Number);
        }
        setSelectedTnrs(newSelectedTnrs);
    };

    const isAllSelected = selectedTnrs.length === semesterTermine.length;
    const isAllExceptFirstSelected =
        selectedTnrs.length === semesterTermine.length - 1 &&
        semesterTermine.slice(1).every((termin) => selectedTnrs.includes(termin.tnr));

    const selectValue = isAllSelected
        ? ['all']
        : isAllExceptFirstSelected
            ? ['all_except_first']
            : selectedTnrs.map(String);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // onSubmit(semesterTermine.filter(termin => selectedTnrs.includes(termin.tnr))); // If onSubmit is still needed for other purposes
        setShowPreview(true);
    };

    return (
        <div className="app-container">
            <Header2 />

            {/*this container design if directly from OverviewAndFormLayout component*/}
            {/*######################################################################*/}
            <Container
                className="bootstrap-container-component"
                id="container"
            >
                <Row className="justify-content-center"> {/* Center the content */}
                    <Col md={12} lg={8} xl={7} className="px-0"> {/* Adjust the column widths for different screen sizes */}

                        {/*-------------------------------------------------------------------*/}
                        <button className="btn btn-outline-success" onClick={handleBack}>Zurück</button>
                        <h1>Preview</h1>
                        <h3 className="mt-3">Anmerkungen</h3>
                        <p>Für eine optimale Darstellung wird eine Bildschirmhöhe von mindestens 1080 Pixeln empfohlen.</p>

                        <h3 className="mt-3">Setup</h3>

                        <Form onSubmit={handleSubmit} data-bs-theme="dark">
                            <Form.Group controlId="duration" className="mt-3">
                                <Form.Label>Anzeigedauer pro Vorführungstermin in Sekunden</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="duration"
                                    min="5"
                                    value={slideDuration}
                                    onChange={handleSlideDurationChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="selectScreenings" className="mt-3">
                                <Form.Label>Wähle die Termine für die Preview aus</Form.Label>
                                <Form.Select
                                    multiple
                                    name="selectScreenings"
                                    htmlSize={semesterTermine.length + 2}
                                    value={selectValue}
                                    onChange={handleScreeningSelectionChange}
                                >
                                    <option key="all" value="all">
                                        Alle Vorführungstermine
                                    </option>
                                    <option key="all_except_first" value="all_except_first">
                                        Alle Vorführungstermine ohne den nächsten
                                    </option>
                                    {semesterTermine.map((termin) => (
                                        <option key={termin.tnr} value={termin.tnr}>
                                            {/*using renderHtmlText here causes a span inside an option → hydration errors*/}
                                            {/*{formatDateInTerminSelectOption( termin.vorstellungsbeginn )} | {renderHtmlText( termin.titel || termin.mainfilms[0].titel )}*/}
                                            {formatDateInTerminSelectOption( termin.vorstellungsbeginn )} {termin.isCanceled ? "🔴 " : "🟢 "} {termin.titel || termin.mainfilms[0].titel}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Text className="text-muted">
                                    <ul className="tight-list">
                                        <li>STRG (Windows) oder CMD (Mac) gedrückt halten, um mehrere, nicht zusammenhängende Vorführungstermine auszuwählen.</li>
                                        <li>🔴: Termin ist als "abgesagt" markiert; 🟢: sonst </li>
                                    </ul>
                                </Form.Text>
                            </Form.Group>
                            <Button type="submit" className="mt-3" disabled={selectValue.length === 0}>
                                Preview starten
                            </Button>
                        </Form>
                        <Badge bg="danger" className="mt-3">Hinweis:</Badge>
                        <p className="text-danger">Preview mode verlassen: Cursor zum oberen Bildrand bewegen!</p>
                        {/*-------------------------------------------------------------------*/}

                    </Col>
                </Row>
                <BackToTopButton
                    parentId="container"
                    rightPercent={0.10} // !!!!! x% inside from parent's right edge !!!!!
                />
            </Container>
        </div>
    );
};

export default PreviewFormWithinSlides;