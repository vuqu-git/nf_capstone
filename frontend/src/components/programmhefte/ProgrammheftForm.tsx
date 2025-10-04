import React, { useState, useEffect } from "react";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import {preprocessFormData} from "../../utils/preprocessFormData.ts";
import AdminNav from "../AdminNav.tsx";
import ProgrammheftDTOSelection from "../../types/ProgrammheftDTOSelection.ts";
import {Programmheft} from "../../types/Programmheft.ts";
import ProgrammheftSelection from "./ProgrammheftSelection.tsx";
import {useDateStartBeforeEndValidation} from "../../hooks/useDateStartBeforeEndValidation.ts";
import styles from "../contact/Forms.module.css";
import {trimAllStringsInObjectShallow} from "../../utils/trimAllStringsInObjectShallow.ts";

const baseURL = "/api/programmheft";

const emptyProgrammheftForForm = {
    pnr: undefined,
    titel: '',
    bild: '',
    pdf: '',
    gueltigVon: '',
    gueltigBis: ''
}

export default function ProgrammheftForm() {
    const [allProgrammhefte, setAllProgrammhefte] = useState<ProgrammheftDTOSelection[]>([]); // All Programmhefte fetched from the server

    const [selectedProgrammheftId, setSelectedProgrammheftId] = useState<number | undefined>(undefined); // Selected TVId (as concatenated string) for editing or deleting
    const [selectedProgrammheft, setSelectedProgrammheft] = useState<Programmheft>(emptyProgrammheftForForm); // Programmheft data for the form

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>(""); // for POST, PUT, DELETE requests

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const [isLoadingAllProgrammhefte, setIsLoadingAllProgrammhefte] = useState(false); // Get all Programmhefte
    const [isGetLoading, setIsGetLoading] = useState(false); // for GET a specific Programmheft
    const [isLoading, setIsLoading] = useState(false); // for POST, PUT of one Programmheft

    const [selectionChanged, setSelectionChanged] = useState(false); // to track if a new selection has been made manually by the user

    const dateOrderErrorMessage = useDateStartBeforeEndValidation(
        selectedProgrammheft.gueltigVon,
        selectedProgrammheft.gueltigBis
    );

    // GET all Programmhefte
    const getAllProgrammhefte = () => {
        setIsLoadingAllProgrammhefte(true);
        setErrorMessage("");

        axios.get(`${baseURL}`)
            .then((response) => setAllProgrammhefte(response.data))
            .catch((error) => {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                setErrorMessage(errorMessage);
            })
            .finally(() => setIsLoadingAllProgrammhefte(false));
    };

    // Fetch all Programmhefte for the dropdown selection
    useEffect(() => {
        getAllProgrammhefte();
    }, []);

    // Fetch the selected Programmheft details only if we are editing or deleting
    useEffect(() => {

        if (selectionChanged) {
            // Reset the success message when the selected Programmheft changes
            setSuccessMessage("");
            setSelectionChanged(false); // Reset the flag
        }

        if (selectedProgrammheftId) {
            // GET single Programmheft (details)
            const getSingleProgrammheft = () => {

                setIsGetLoading(true);
                setErrorMessage("");

                axios.get(`${baseURL}/${selectedProgrammheftId}`)
                    .then((response) => setSelectedProgrammheft(response.data))
                    .catch((error) => {
                        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                        setErrorMessage(errorMessage);
                    })
                    .finally(() => setIsGetLoading(false));
            };

            getSingleProgrammheft();

        } else {
            setSelectedProgrammheft(emptyProgrammheftForForm); // Reset the form for further adding/editing/deleting
        }
    }, [selectedProgrammheftId]);


    // Handle the form submission (PUT or POST)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(true);

        // Check if we're adding or editing a Programmheft
        if (selectedProgrammheftId) {
            // Editing an existing Programmheft (PUT request)

            axios.put(`${baseURL}/${selectedProgrammheftId}`, trimAllStringsInObjectShallow( preprocessFormData(selectedProgrammheft) ))
                .then(() => {
                    setSuccessMessage("Programmheft/Flyer updated successfully!");

                    getAllProgrammhefte();
                    setSelectedProgrammheftId(undefined); // Reset the selection
                    setSelectedProgrammheft(emptyProgrammheftForForm); // Reset the form for further adding/editing/deleting
                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "Update failed";
                    setErrorMessage(errorMessage);
                })
                .finally(() => setIsLoading(false));
        } else {

            // #####################################################
            // ignoring pnr when posting via this form
            const { pnr, ...programmheftInFormWithoutPnr } = selectedProgrammheft;
            // #####################################################

            // axios.post(`${baseURL}`, selectedProgrammheft)
            axios.post(`${baseURL}`, trimAllStringsInObjectShallow( preprocessFormData(programmheftInFormWithoutPnr) ))
                .then(() => {
                    setSuccessMessage("Programmheft/Flyer saved successfully!");

                    getAllProgrammhefte();
                    // setSelectedProgrammheftId(undefined); // Reset the selection, not required for POST because selection is unchanged
                    setSelectedProgrammheft(emptyProgrammheftForForm); // Reset the form for further adding/editing/deleting
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
        if (selectedProgrammheftId) {

            axios.delete(`${baseURL}/${selectedProgrammheftId}`)
                .then(() => {
                    setSuccessMessage("Programmheft/Flyer deleted successfully!");

                    getAllProgrammhefte();
                    setConfirmDeleteOpen(false);

                    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    // => I need to set it to remove the delete button from display after deletion!!
                    setSelectedProgrammheftId(undefined);

                    setSelectedProgrammheft(emptyProgrammheftForForm); // Reset the form for further adding/editing/deleting
                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "Deletion failed";
                    setErrorMessage(errorMessage);
                    setConfirmDeleteOpen(false);
                });
        }
    };

    // Handle Programmheft form field changes
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSelectedProgrammheft((prevData: Programmheft) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle selection changes
    const handleSelectionChange = (id: number | undefined) => {
        setSelectedProgrammheftId(id);
        setSelectionChanged(true); // Set flag when selection changes
    };

    return (
        <main data-bs-theme="dark">
            <AdminNav />

            <h3 className="mt-3">{selectedProgrammheftId ? "Edit or delete " : "Add new "} Programmheft/Flyer</h3>

            <ProgrammheftSelection
                allProgrammhefte={allProgrammhefte}
                selectedPnr={selectedProgrammheftId}
                onSelectProgrammheft={handleSelectionChange}
                textForDefaultOption={undefined}
            />

            {/*<div className="loadingSpacer"> /!* this css class approach does NOT work somehow compared to inline style*!/*/}
            <div style={{ minHeight: '30px' }}>
                {isLoadingAllProgrammhefte && <div className="text-warning mb-3" role="status">&#x1f504; Loading all Programmheft entries... Please wait!</div>}
                {isGetLoading && <div className="text-warning mb-3" role="status">&#x1f504; Loading details of selected Programmheft... Please wait!</div>}
            </div>

            <Form onSubmit={handleSubmit}>

                <h3 className="mt-3">Programmheft/Flyer details</h3>

                <Form.Group controlId="titel" className="mt-3">
                    <Form.Label>Titel *</Form.Label>
                    <Form.Control
                        type="text"
                        name="titel"
                        value={selectedProgrammheft.titel || ""}
                        onChange={handleFormChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="bild" className="mt-3">
                    <Form.Label>vollständiger Bilddateiname</Form.Label>
                    <Form.Control
                        type="text"
                        name="bild"
                        value={selectedProgrammheft.bild || ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        {/*Bilddatei muss unter https://pupille.org/bilder/programmheftbilder/ abgelegt sein.*/}
                        <ul className="tight-list">
                            <li>Bilddatei muss unter /var/www/vhosts/epic-hypatia.212-227-48-226.plesk.page/pupille-website/external-static-container/static-files/bilder/programmheftbilder abgelegt sein
                                → plesk file manager nutzen! Achtung: Hier wird dieser Pfad aber als nur als /pupille-website/external-static-container/static-files/bilder/programmheftbilder dargestellt, weil der plesk file manager /var/www/vhosts/epic-hypatia.212-227-48-226.plesk.page
                                als Stammverzeichnis hat.</li>
                        </ul>
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="pdf" className="mt-3">
                    <Form.Label>vollständiger PDF-Dateiname *</Form.Label>
                    <Form.Control
                        type="text"
                        name="pdf"
                        value={selectedProgrammheft.pdf || ""}
                        onChange={handleFormChange}
                        required
                    />
                    <Form.Text className="text-muted">
                        {/*PDF-Datei muss unter https://pupille.org/programmheft/ abgelegt sein.*/}
                        <ul className="tight-list">
                            <li>PDF-Datei muss unter /var/www/vhosts/epic-hypatia.212-227-48-226.plesk.page/pupille-website/external-static-container/static-files/programmhefte abgelegt sein
                                → plesk file manager nutzen! Achtung: Hier wird dieser Pfad aber als nur als /pupille-website/external-static-container/static-files/programmhefte dargestellt, weil der plesk file manager /var/www/vhosts/epic-hypatia.212-227-48-226.plesk.page
                                als Stammverzeichnis hat.</li>
                        </ul>
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="gueltigVon" className="mt-3">
                    <Form.Label>Gültig von (inkl.) *</Form.Label>
                    <Form.Control
                        type="date"
                        name="gueltigVon"
                        value={selectedProgrammheft.gueltigVon || ""}
                        onChange={handleFormChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="gueltigBis" className="mt-3">
                    <Form.Label>Gültig bis (inkl.) *</Form.Label>
                    <Form.Control
                        type="date"
                        name="gueltigBis"
                        value={selectedProgrammheft.gueltigBis || ""}
                        onChange={handleFormChange}
                        required
                    />
                </Form.Group>

                <div>
                    {dateOrderErrorMessage && <p className={styles.statusError + " m-0"}>{dateOrderErrorMessage}</p>}
                </div>

                <Button
                    variant={selectedProgrammheftId ? "success" : "primary"}
                    type="submit"
                    className="mt-4"
                    disabled={!!dateOrderErrorMessage}
                >
                    {selectedProgrammheftId ? "Update " : "Add "} Programmheft/Flyer entry
                </Button>
                <div><sub className={styles.formSubtext}>*Pflichtfelder</sub></div>
            </Form>

            {selectedProgrammheftId && !confirmDeleteOpen && (
                <Button
                    variant="danger"
                    type="submit"
                    className="mt-4"
                    onClick={() => setConfirmDeleteOpen(true)}
                >
                    Delete Programmheft/Flyer entry
                </Button>
            )}

            {confirmDeleteOpen && (
                <div className="mt-3">
                    <p>Are you sure you want to delete this Programmheft entry?</p>
                    <Button variant="secondary" onClick={() => setConfirmDeleteOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="outline-danger" onClick={handleDelete} className="ms-2">
                        Confirm Delete
                    </Button>
                </div>
            )}

            {isLoading && <div className="text-warning mb-3" role="status">&#x1f504; Perform {selectedProgrammheftId ? "updating " : "saving "} Programmheft entry... Please wait!</div>}
            {errorMessage && <div className="text-danger mb-3" role="alert">{errorMessage}</div>}
            {successMessage && <div className="text-success mb-3" role="status">&#x2705; {successMessage}</div>}

        </main>
    );
}