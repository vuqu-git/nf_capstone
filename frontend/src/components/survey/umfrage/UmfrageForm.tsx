import React, { useState, useEffect } from "react";
import { Button, Form, Table, Card } from "react-bootstrap";
import axios from "axios";

import styles from "../../contact/Forms.module.css";
import surveyStyles from "../Survey.module.css";

import UmfrageSelectionWithSearch from "./UmfrageSelectionWithSearch.tsx";
import {UmfrageDTO} from "../../../types/UmfrageDTO.ts";
import {AuswahloptionNestedDTO} from "../../../types/AuswahloptionNestedDTO.ts";
import AdminNav from "../../structural_components/AdminNav.tsx";
import AdminLeftBar from "../../structural_components/AdminLeftBar.tsx";
import {UmfrageSelectionDTO} from "../../../types/UmfrageSelectionDTO.ts";

const baseURL = "/api/survey/umfragen";

const emptyUmfrageForForm: UmfrageDTO = {
    unr: -1,
    anlass: '',
    endDatum: '',
    beschreibung: '',
    auswahloptionendtos: []
};

export default function UmfrageForm() {
    const [allUmfragen, setAllUmfragen] = useState<UmfrageSelectionDTO[]>([]);

    // Using 'unr' as the ID
    const [selectedUmfrageId, setSelectedUmfrageId] = useState<number | undefined>(undefined);
    const [selectedUmfrage, setSelectedUmfrage] = useState<UmfrageDTO>(emptyUmfrageForForm);

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGetLoading, setIsGetLoading] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [selectionChanged, setSelectionChanged] = useState(false);

    // --- Data Fetching ---
    const getAllUmfragen = () => {
        setErrorMessage("");
        axios.get(`${baseURL}`)
            .then((response) => setAllUmfragen(response.data))
            .catch((error) => {
                setErrorMessage(error instanceof Error ? error.message : "Error fetching data");
            });
    };

    useEffect(() => {
        getAllUmfragen();
    }, []);

    useEffect(() => {
        if (selectionChanged) {
            setSuccessMessage("");
            setSelectionChanged(false);
        }

        if (selectedUmfrageId) {
            setIsGetLoading(true);
            setErrorMessage("");

            axios.get(`${baseURL}/${selectedUmfrageId}`)
                .then((response) => setSelectedUmfrage(response.data))
                .catch((error) => {
                    setErrorMessage(error instanceof Error ? error.message : "Error loading details");
                })
                .finally(() => setIsGetLoading(false));
        } else {
            setSelectedUmfrage(emptyUmfrageForForm);
        }
    }, [selectedUmfrageId]);



    // --- Handlers for Main Fields ---
    const handleSelectionChange = (id: number | undefined) => {
        setSelectedUmfrageId(id);
        setSelectionChanged(true);
    };

    const handleMainFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedUmfrage((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // --- Handlers for Nested Auswahloptionen ---
    const handleOptionChange = (index: number, field: keyof AuswahloptionNestedDTO, value: string) => {
        const updatedOptions = [...selectedUmfrage.auswahloptionendtos];
        updatedOptions[index] = {
            ...updatedOptions[index],
            [field]: value
        };
        setSelectedUmfrage(prev => ({ ...prev, auswahloptionendtos: updatedOptions }));
    };

    const addOption = () => {
        const newOption: AuswahloptionNestedDTO = { titel: "", details: "", link: "" };
        setSelectedUmfrage(prev => ({
            ...prev,
            auswahloptionendtos: [...prev.auswahloptionendtos, newOption]
        }));
    };

    const removeOption = (index: number) => {
        const updatedOptions = selectedUmfrage.auswahloptionendtos.filter((_, i) => i !== index);
        setSelectedUmfrage(prev => ({ ...prev, auswahloptionendtos: updatedOptions }));
    };

    // --- CRUD Submissions ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(true);

        const payload = selectedUmfrage;

        // Determine request type
        const request = selectedUmfrageId
            ? axios.put(`${baseURL}/${selectedUmfrageId}`, payload)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            : axios.post(`${baseURL}`, (({ unr, ...rest }) => rest)(payload)); // remove 'unr' for POST if backend needs it

        request
            .then(() => {
                setSuccessMessage(selectedUmfrageId ? "Updated successfully!" : "Created successfully!");
                getAllUmfragen();
                if (!selectedUmfrageId) setSelectedUmfrage(emptyUmfrageForForm);
            })
            .catch((error) => {
                setErrorMessage(error instanceof Error ? error.message : "Operation failed");
            })
            .finally(() => setIsLoading(false));
    };

    const handleDelete = () => {
        if (!selectedUmfrageId) return;

        axios.delete(`${baseURL}/${selectedUmfrageId}`)
            .then(() => {
                setSuccessMessage("Deleted successfully!");
                getAllUmfragen();
                setConfirmDeleteOpen(false);
                setSelectedUmfrageId(undefined);
            })
            .catch((error) => {
                setErrorMessage(error instanceof Error ? error.message : "Deletion failed");
                setConfirmDeleteOpen(false);
            });
    };

    return (
        <main data-bs-theme="dark">

            <AdminLeftBar
                message={["<p>", "</p>", "\n", "<br>", "\n", "<em>", "</em>", "\n", "<strong>", "</strong>"]}
                threshold={150}
            />

            <AdminNav />

            <div className={surveyStyles.alertContainerStyle}>
                {errorMessage && (
                    <div className={`alert alert-danger ${surveyStyles.alertStyle}`}>
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className={`alert alert-success ${surveyStyles.alertStyle}`}>
                        {successMessage}
                    </div>
                )}
                {isGetLoading && (
                    <div className={`alert alert-info ${surveyStyles.alertStyle}`}>
                        Loading data...
                    </div>
                )}
            </div>

            <h3 className="mt-3">{selectedUmfrageId ? "Edit or Delete" : "Add New"} Umfrage and its Auswahloptionen</h3>

            <UmfrageSelectionWithSearch
                allUmfragen={allUmfragen}
                selectedUmfrageId={selectedUmfrageId}
                onSelectUmfrage={handleSelectionChange}
            />

            <Form onSubmit={handleSubmit} className={styles.formContainer}>

                {/* ID Field */}
                {/*<Form.Group className="mb-3">*/}
                {/*    <Form.Label>UNR (ID)</Form.Label>*/}
                {/*    <Form.Control type="text" value={selectedUmfrage.unr || ""} disabled readOnly />*/}
                {/*</Form.Group>*/}

                {/* Anlass */}
                <Form.Group controlId="anlass" className="mb-3">
                    <Form.Label>Titel bzw. Anlass (kein HTML) *</Form.Label>
                    <Form.Control
                        type="text"
                        name="anlass"
                        value={selectedUmfrage.anlass}
                        onChange={handleMainFieldChange}
                        placeholder=""
                        required
                    />
                </Form.Group>

                {/* Beschreibung */}
                <Form.Group controlId="beschreibung" className="mb-3">
                    <Form.Label>Beschreibung (HTML) *</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="beschreibung"
                        value={selectedUmfrage.beschreibung || ""}
                        onChange={handleMainFieldChange}
                        required
                    />
                </Form.Group>

                {/* endDatum */}
                <Form.Group controlId="endDatum" className="mb-3">
                    <Form.Label>Ende-Datum *</Form.Label>
                    <Form.Control
                        type="date"
                        name="endDatum"
                        value={selectedUmfrage.endDatum ? selectedUmfrage.endDatum.slice(0, 16) : ""}
                        onChange={handleMainFieldChange}
                        required
                    />
                    <Form.Text className="text-muted">
                        <ul className="tight-list">
                            <li>gilt bis zum Ende des eingetragenen Tages um 23:59:59 Uhr</li>
                        </ul>
                    </Form.Text>
                </Form.Group>

                {/* Nested Options List */}
                <Card className="mb-4 bg-secondary bg-opacity-10">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <span>Auswahloptionen (kein HTML in dessen Feldern unten)</span>
                        <Button variant="sm btn-primary" size="sm" onClick={addOption} type="button">
                            + Add Option
                        </Button>
                    </Card.Header>
                    <Card.Body className="p-2">
                        {selectedUmfrage.auswahloptionendtos.length === 0 ? (
                            <div className="text-center text-muted">No options added yet.</div>
                        ) : (
                            <div className="table-responsive">
                                {/*<Table striped hover size="sm" variant="dark">*/}
                                <Table
                                    size="sm"
                                    variant="dark"
                                    borderless
                                >
                                    <thead>
                                    <tr>
                                        {/*<th style={{width: "5%"}}>#</th>*/}
                                        <th style={{width: "35%", paddingLeft: "13px"}}>Option</th>
                                        <th style={{width: "35%", paddingLeft: "13px"}}>Details</th>
                                        <th style={{width: "25%", paddingLeft: "13px"}}>Link</th>
                                        <th style={{width: "5%"}}>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedUmfrage.auswahloptionendtos.map((opt, index) => (
                                        <tr key={opt.onr}>
                                            {/*<td style={{ verticalAlign: "middle" }}>{index + 1}</td>*/}
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    size="sm"
                                                    value={opt.titel}
                                                    onChange={(e) => handleOptionChange(index, "titel", e.target.value)}
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    size="sm"
                                                    value={opt.details || ""}
                                                    onChange={(e) => handleOptionChange(index, "details", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    size="sm"
                                                    value={opt.link || ""}
                                                    onChange={(e) => handleOptionChange(index, "link", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => removeOption(index)}
                                                    title="Remove Option"
                                                >
                                                    🗑️
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* Main Action Buttons */}
                <div className="d-flex gap-2 mt-4">
                    <Button variant="success" type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : (selectedUmfrageId ? "Update Umfrage" : "Create Umfrage")}
                    </Button>

                    {selectedUmfrageId && (
                        <>
                            {!confirmDeleteOpen ? (
                                <Button variant="danger" onClick={() => setConfirmDeleteOpen(true)}>
                                    Delete Umfrage
                                </Button>
                            ) : (
                                <div className="border p-2 rounded border-danger d-flex align-items-center gap-2">
                                    <span className="text-danger fw-bold">Confirm delete?</span>
                                    <Button variant="danger" size="sm" onClick={handleDelete}>Yes</Button>
                                    <Button variant="secondary" size="sm" onClick={() => setConfirmDeleteOpen(false)}>No</Button>
                                </div>
                            )}

                            <Button variant="secondary" onClick={() => {
                                setSelectedUmfrageId(undefined);
                                setSelectedUmfrage(emptyUmfrageForForm);
                            }}>
                                Cancel
                            </Button>
                        </>
                    )}
                </div>
                <div><sub className={styles.formSubtext}>*Pflichtfeld</sub></div>
            </Form>
        </main>
    );
}
