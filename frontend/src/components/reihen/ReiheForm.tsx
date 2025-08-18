import React, { useState, useEffect } from "react";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import {preprocessFormData} from "../../utils/preprocessFormData.ts";
import AdminNav from "../AdminNav.tsx";
import ReiheDTOFormWithTermineAndFilme from "../../types/ReiheDTOFormWithTermineAndFilme.ts";
import ReiheDTOSelection from "../../types/ReiheDTOSelection.ts";
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";
import {formatDateInTerminSelectOption} from "../../utils/formatDateInTerminSelectOption.ts";
import {trimAllStringsInObjectShallow} from "../../utils/trimAllStringsInObjectShallow.ts";
import styles from "../contact/Forms.module.css";
import ReiheSelectionWithSearch from "./ReiheSelectionWithSearch.tsx";

const baseURL = "/api/reihe";

const emptyReiheForForm = {
    rnr: undefined,
    titel: '',
    text: '',
    sonderfarbe: '',
    termine:[]
}

export default function ReiheForm() {
    const [allReihen, setAllReihen] = useState<ReiheDTOSelection[]>([]); // All Reihen fetched from the server

    const [selectedReiheId, setSelectedReiheId] = useState<number | undefined>(undefined); // Selected TVId (as concatenated string) for editing or deleting
    const [selectedReihe, setSelectedReihe] = useState<ReiheDTOFormWithTermineAndFilme>(emptyReiheForForm); // Reihe data for the form

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>(""); // for POST, PUT, DELETE requests

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const [isLoadingAllReihen, setIsLoadingAllReihen] = useState(false); // Get all Reihen
    const [isGetLoading, setIsGetLoading] = useState(false); // for GET a specific Reihe
    const [isLoading, setIsLoading] = useState(false); // for POST, PUT of one Reihe

    const [selectionChanged, setSelectionChanged] = useState(false); // to track if a new selection has been made manually by the user

    // GET all Reihen
    const getAllReihen = () => {
        setIsLoadingAllReihen(true);
        setErrorMessage("");

        axios.get(`${baseURL}`)
            .then((response) => setAllReihen(response.data))
            .catch((error) => {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                setErrorMessage(errorMessage);
            })
        .finally(() => setIsLoadingAllReihen(false));
    };

    // Fetch all Reihen for the dropdown selection
    useEffect(() => {
        getAllReihen();
    }, []);

    // Fetch the selected Reihe details only if we are editing or deleting
    useEffect(() => {

        if (selectionChanged) {
            // Reset the success message when the selected Reihe changes
            setSuccessMessage("");
            setSelectionChanged(false); // Reset the flag
        }

        if (selectedReiheId) {
            // GET single Reihe (details)
            const getSingleReihe = () => {

                setIsGetLoading(true);
                setErrorMessage("");

                axios.get(`${baseURL}/${selectedReiheId}`)
                    .then((response) => setSelectedReihe(response.data))
                    .catch((error) => {
                        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                        setErrorMessage(errorMessage);
                    })
                    .finally(() => setIsGetLoading(false));
            };

            getSingleReihe();

        } else {
            setSelectedReihe(emptyReiheForForm); // Reset the form for further adding/editing/deleting
        }
    }, [selectedReiheId]);


    // Handle the form submission (PUT or POST)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(true);

        // Check if we're adding or editing a Reihe
        if (selectedReiheId) {
            // Editing an existing Reihe (PUT request)

            axios.put(`${baseURL}/${selectedReiheId}`, trimAllStringsInObjectShallow( preprocessFormData(selectedReihe) ))
                .then(() => {
                    setSuccessMessage("Reihe updated successfully!");

                    getAllReihen();
                    setSelectedReiheId(undefined); // Reset the selection
                    setSelectedReihe(emptyReiheForForm); // Reset the form for further adding/editing/deleting
                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "Update failed";
                    setErrorMessage(errorMessage);
                })
                .finally(() => setIsLoading(false));
        } else {

            // #####################################################
            // ignoring rnr when posting via this form
            const { rnr, ...reiheInFormWithoutRnr } = selectedReihe;
            // #####################################################

            // axios.post(`${baseURL}`, selectedReihe)
            axios.post(`${baseURL}`, trimAllStringsInObjectShallow( preprocessFormData(reiheInFormWithoutRnr) ))
                .then(() => {
                    setSuccessMessage("Reihe saved successfully!");

                    getAllReihen();
                    // setSelectedReiheId(undefined); // Reset the selection, not required for POST because selection is unchanged
                    setSelectedReihe(emptyReiheForForm); // Reset the form for further adding/editing/deleting
                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "Saving failed";
                    setErrorMessage(errorMessage);
                })
                .finally(() => setIsLoading(false));

        }
    };

    // Handle DELETE
    const handleDelete = () => {
        setErrorMessage("");
        setSuccessMessage("");
        if (selectedReiheId) {

            axios.delete(`${baseURL}/${selectedReiheId}`)
                .then(() => {
                    setSuccessMessage("Reihe deleted successfully!");

                    getAllReihen();
                    setConfirmDeleteOpen(false);

                    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    // => I need to set it to remove the delete button from display after deletion!!
                    setSelectedReiheId(undefined);

                    setSelectedReihe(emptyReiheForForm); // Reset the form for further adding/editing/deleting
                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "Deletion failed";
                    setErrorMessage(errorMessage);
                    setConfirmDeleteOpen(false);
                });
        }
    };

    // Handle Reihe form field changes
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSelectedReihe((prevData: ReiheDTOFormWithTermineAndFilme) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle selection changes
    const handleSelectionChange = (id: number | undefined) => {
        setSelectedReiheId(id);
        setSelectionChanged(true); // Set flag when selection changes
    };

    return (
        <main data-bs-theme="dark">
            <AdminNav />

            <h3 className="mt-3">{selectedReiheId ? "Edit or delete " : "Add new "} Reihe</h3>

            <ReiheSelectionWithSearch
                allReihen={allReihen}
                selectedReiheId={selectedReiheId}
                onSelectReihe={handleSelectionChange}
                textForDefaultOption={undefined}
            />

            {/*<div className="loadingSpacer"> /!* this css class approach does NOT work somehow compared to inline style*!/*/}
            <div style={{ minHeight: '30px' }}>
                {isLoadingAllReihen && <div className="text-warning mb-3" role="status">&#x1f504; Loading all Reihe entries... Please wait!</div>}
                {isGetLoading && <div className="text-warning mb-3" role="status">&#x1f504; Loading details of selected Reihe... Please wait!</div>}
            </div>

            {/*display corresponding Termine incl. Filme*/}
            {/*******************************************/}
            {selectedReiheId && (
                <div className={styles.correspondingItems}>
                    <p>currently corresponding screenings (Termine with each Film(e)) of the above selected Reihe:</p>
                    <ul>
                        {selectedReihe.termine && selectedReihe.termine.length > 0 ? (
                            selectedReihe.termine.map(t => (
                                <li key={t.tnr}>
                                    {formatDateInTerminSelectOption(t.vorstellungsbeginn)} | tnr: #{t.tnr} | {t.titel ?? "---"}
                                    {/* Nested sub-list for mainfilms */}
                                    {t.mainfilms && t.mainfilms.length > 0 && (
                                        <ul>
                                            {t.mainfilms.map(f => (
                                                <li key={f.fnr}>
                                                    {renderHtmlText(f.titel)}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li>[no screenings assigned yet]</li> // Display "none" as a list item
                        )}
                    </ul>
                </div>
            )}

            <Form onSubmit={handleSubmit}>

                <h3 className="mt-3">Reihe details</h3>

                <Form.Group controlId="titel" className="mt-3">
                    <Form.Label>Titel *</Form.Label>
                    <Form.Control
                        type="text"
                        name="titel"
                        value={selectedReihe.titel || ""}
                        onChange={handleFormChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="text" className="mt-3">
                    <Form.Label>Text</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        name="text"
                        value={selectedReihe.text || ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        styled tag template → {'<span style="color: blue; font-weight: bold;">highlighted part</span>'}
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="sonderfarbe" className="mt-3">
                    <Form.Label>Sonderfarbe (für Glow-Effekt in der Gallery)</Form.Label>
                    <Form.Control
                        type="text"
                        name="sonderfarbe"
                        value={selectedReihe.sonderfarbe || ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        zulässige Werte: pupille-glow (=default; Feld bitte leer lassen), teal-glow, red-glow, orange-glow, yellow-glow, green-glow, blue-glow, indigo-glow, pink-glow <br/>
                        Wenn 1 Termin mehrere Reihen hat, erfolgt automatische, zufällige Auswahl der Farbe. <br/>
                        Wenn im Termineintrag eine Sonderfarbe festgelegt wurde, hat dieser <b>Vorrang</b> ggü. der Sonderfarbe hier.
                    </Form.Text>
                </Form.Group>

                <Button variant={selectedReiheId ? "success" : "primary"} type="submit" className="mt-4">
                    {selectedReiheId ? "Update " : "Add "} Reihe entry
                </Button>
                <div><sub className={styles.formSubtext}>*Pflichtfeld</sub></div>
            </Form>

            {selectedReiheId && !confirmDeleteOpen && (
                <Button
                    variant="danger"
                    type="submit"
                    className="mt-4"
                    onClick={() => setConfirmDeleteOpen(true)}
                >
                    Delete Reihe entry
                </Button>
            )}

            {confirmDeleteOpen && (
                <div className="mt-3">
                    <p>Are you sure you want to delete this Reihe entry?</p>
                    <Button variant="secondary" onClick={() => setConfirmDeleteOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="outline-danger" onClick={handleDelete} className="ms-2">
                        Confirm Delete
                    </Button>
                </div>
            )}

            {( (selectedReiheId && !confirmDeleteOpen) || confirmDeleteOpen ) && (
            <div><sub className={styles.formSubtext}>If a certain Reihe entry is deleted, also the <u>connections</u> (Reiheverknuepfungen) to its Termin entities are removed, but not the Termin entities themselves. These entities, along with their assigned Film entities, remain unaffected.</sub></div>
            )}

            {isLoading && <div className="text-warning mb-3" role="status">&#x1f504; Perform {selectedReiheId ? "updating " : "saving "} Reihe entry... Please wait!</div>}
            {errorMessage && <div className="text-danger mb-3" role="alert">{errorMessage}</div>}
            {successMessage && <div className="text-success mb-3" role="status">&#x2705; {successMessage}</div>}

        </main>
    );
}