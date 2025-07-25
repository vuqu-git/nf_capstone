import React, { useState, useEffect } from "react";
import {Button, Form} from "react-bootstrap";
import styles from './ReiheverknuepfungForm.module.css';
import axios from "axios";
import ReiheSelection from "./ReiheSelection.tsx";
import AdminNav from "../AdminNav.tsx";
import ReiheDTOForFormWithTermineAndFilme from "../../types/ReiheDTOForFormWithTermineAndFilme.ts";
import ReiheDTOSelection from "../../types/ReiheDTOSelection.ts";
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";
import TerminDTOWithFilmDTOOverviewArchive from "../../types/TerminDTOWithFilmDTOOverviewArchive.ts";
import {formatDateInTerminSelectOption} from "../../utils/formatDateInTerminSelectOption.ts";

const baseURL = "/api/reihe";

const emptyReihe = {
    rnr: 0,
    titel: '',
    text: '',
    farbe: '',
    termine:[]
}

export default function ReiheverknuepfungForm() {
    const [allReihen, setAllReihen] = useState<ReiheDTOSelection[]>([]); // All Reihen fetched from the server
    const [selectedReiheId, setSelectedReiheId] = useState<number | undefined>(undefined); // Selected TVId (as concatenated string) for editing or deleting
    const [selectedReihe, setSelectedReihe] = useState<ReiheDTOForFormWithTermineAndFilme>(emptyReihe); // Reihe data for the form
    const [selectionChanged, setSelectionChanged] = useState(false); // to track if a new Reihe selection has been made manually by the user

    const [allTermineWithMainfilme, setAllTermineWithMainfilme] = useState<TerminDTOWithFilmDTOOverviewArchive[]>([]);
    const [selectedTerminId, setSelectedTerminId] = useState<number | undefined>(undefined);

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>(""); // for DELETE (Termin from a selected) requests

    const [confirmDeleteTnr, setConfirmDeleteTnr] = useState<number | null>(null);

    const [isLoadingAllReihen, setIsLoadingAllReihen] = useState(false); // Get all Reihen
    const [isLoadingOneReihe, setIsLoadingOneReihe] = useState(false); // for GET a specific Reihe
    const [isLoadingForAddDelete, setIsLoadingForAddDelete] = useState(false); // POST, DELETE for adding/deleting a Termin to selected Reihe

    // #####################################################################
    // #####################################################################

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

    // GET all termine
    const getAllSortedTermine = () => {
        setErrorMessage("");

        axios.get(`api/termine/withmainfilms`)
            .then((response) => setAllTermineWithMainfilme(response.data))
            .catch((error) => {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                setErrorMessage(errorMessage);
            })
    };

    // Fetch all termine for the dropdown selection
    useEffect(() => {
        getAllSortedTermine();
    }, []);

    const handleTerminSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTerminId(e.target.value === "" ? undefined : Number(e.target.value));
    };

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // Handle ADD Termin to selected Reihe
    const handleAddTerminToReihe = () => {
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoadingForAddDelete(true);

        if (selectedReiheId && selectedTerminId) {
            axios.post(`${baseURL}/${selectedReiheId}/termin/${selectedTerminId}`)
                .then(() => {
                    setSuccessMessage("Adding of Termin to Reihe was successful!");

                    // Goal: After the successful addition, the list of corresponding Termine should be up-to-date
                    // Find the added termin from allTermineWithMainfilme
                    const addedTermin = allTermineWithMainfilme.find(t => t.tnr === selectedTerminId);

                    if (addedTermin) {
                        // Update the selectedReihe state locally by adding the new termin
                        setSelectedReihe(prevReihe => ({
                            ...prevReihe,
                            termine: [...prevReihe.termine, addedTermin]
                        }));
                    }

                    setSelectedTerminId(undefined);
                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "Adding failed";
                    setErrorMessage(errorMessage);
                })
                .finally(() => setIsLoadingForAddDelete(false));
        }
    };

    // Handle DELETE
    const handleDeleteTerminFromReihe = (tnr: number) => {
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoadingForAddDelete(true);

        if (selectedReiheId) {
            axios.delete(`${baseURL}/${selectedReiheId}/termin/${tnr}`)
                .then(() => {
                    setSuccessMessage("Deleting Termin from Reihe was successful!");

                    // Goal: After the successful deletion, the list of corresponding Termine should be up-to-date
                    // Update the selectedReihe state locally by removing the deleted termin
                    setSelectedReihe(prevReihe => ({
                        ...prevReihe,
                        termine: prevReihe.termine.filter(t => t.tnr !== tnr)
                    }));

                    setConfirmDeleteTnr(null) // Reset the delete confirmation dialogue

                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "Deletion failed";
                    setErrorMessage(errorMessage);
                    setConfirmDeleteTnr(null) // Reset the delete confirmation dialogue
                })
                .finally(() => setIsLoadingForAddDelete(false));
        }
    };

    // .....................................................................

    // Fetch the selected Reihe details only if we are adding or deleting Reihe-Termin-connections
    useEffect(() => {
        if (selectionChanged) {
            // Reset the success message when the selected Reihe changes
            setSuccessMessage("");
            setSelectionChanged(false); // Reset the flag
            setConfirmDeleteTnr(null); // Reset the delete confirmation dialogue
        }

        if (selectedReiheId) {
            // GET single Reihe (details)
            const getSingleReihe = () => {

                setIsLoadingOneReihe(true);
                setErrorMessage("");

                axios.get(`${baseURL}/${selectedReiheId}`)
                    .then((response) => setSelectedReihe(response.data))
                    .catch((error) => {
                        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                        setErrorMessage(errorMessage);
                    })
                    .finally(() => setIsLoadingOneReihe(false));
            };

            getSingleReihe();

        } else {
            // Reset the form for adding a new Reihe
            setSelectedReihe(emptyReihe);
        }
    }, [selectedReiheId]);


    // Handle selection changes
    const handleSelectionChange = (id: number | undefined) => {
        setSelectedReiheId(id);
        setSelectionChanged(true); // Set flag when Reihe selection changes
    };

    return (
        <div data-bs-theme="dark">
            <AdminNav />

            {/*<h3 className="mt-3">{selectedReiheId ? "Edit or delete " : "Add new "} Reihe</h3>*/}
            <h3 className="mt-3">Add Termine (incl. its Film(e)) to Reihe</h3>

            <ReiheSelection
                reihen={allReihen}
                selectedReiheId={selectedReiheId}
                onSelectReihe={handleSelectionChange}
                textForDefaultOption={"Select a Reihe to edit the Reiheverknuepfungen"}
            />


            <div style={{ minHeight: '30px' }}>
                {isLoadingAllReihen && <div className="text-warning mb-3">&#x1f504; Loading all Reihe entries... Please wait!</div>}
                {isLoadingOneReihe && <div className="text-warning mb-3">&#x1f504; Loading Reihe's Termine and Filme... Please wait!</div>}
            </div>

            {selectedReihe.titel && !isLoadingAllReihen && (
                <div className={styles.terminList}>
                    <p className="mb-0">currently corresponding screenings (Termine with each Film(e)) of the above selected Reihe:</p>

                    {selectedReihe.termine && selectedReihe.termine.length > 0 ? (
                        selectedReihe.termine.map((t) => (
                            <div className={styles.terminRow} key={t.tnr}>
                                <div className={styles.terminHeader}>
                                    <div className={styles.terminTitel}>
                                        <span className={styles.date}>{formatDateInTerminSelectOption(t.vorstellungsbeginn)}</span>
                                        <span className={styles.tnr}>tnr: #{t.tnr}</span>
                                        <span className={styles.titel}>{t.titel}</span>
                                    </div>
                                    <div className={styles.buttonGroup}>
                                        {confirmDeleteTnr !== t.tnr ? (
                                            <button
                                                className={`${styles.button} ${styles.red}`}
                                                onClick={() => setConfirmDeleteTnr(t.tnr)}
                                            >
                                                Delete
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    className={`${styles.button} ${styles['red-outline']}`}
                                                    onClick={() => handleDeleteTerminFromReihe(t.tnr)}
                                                >
                                                    Confirm Delete
                                                </button>
                                                <button
                                                    className={`${styles.button} ${styles.grey}`}
                                                    onClick={() => setConfirmDeleteTnr(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {t.films && t.films.length > 0 && (
                                    <div className={styles.filmList}>
                                        {t.films.map((f) => (
                                            <div key={f.fnr} className={styles.filmItem}>
                                                {renderHtmlText(f.titel)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={styles.filmList}>[none]</div>
                    )}
                </div>
            )}

            <div style={{ minHeight: '30px' }}>
                {isLoadingForAddDelete && <div className="text-warning mb-3">&#x1f504; Processing... Please wait!</div>}
                {successMessage && <div className="text-success mb-3">&#x2705; {successMessage}</div>}
                {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
            </div>

            {/*Here now reihe-terminverknuepfung*/}
            {/*#################################*/}

            <h3 className="mt-3">Reihe: add screenings/films</h3>

            <p>Add a Termin (displayed here with Termin title <u>or</u> the corresponding films) to the selected Reihe above:</p>

            <Form.Label htmlFor="termin-selection" className="mt-0">Termin selection</Form.Label>
            <Form.Select
                id="termin-selection" // Add id to connect to the label
                value={selectedTerminId ?? ""}
                onChange={handleTerminSelectionChange}
                style={{ backgroundColor: 'dimgrey', color: 'whitesmoke' }}
            >
                <option value="">Select a Termin</option>
                {allTermineWithMainfilme.map((t: TerminDTOWithFilmDTOOverviewArchive) => (
                    <option key={t.tnr} value={t.tnr}>

                        {/*{`${formatDateInTerminSelectOption(t.vorstellungsbeginn)}| ${t.titel} | #${t.tnr}`}*/}
                        {
                            `${formatDateInTerminSelectOption(t.vorstellungsbeginn)} | tnr: #${t.tnr}
                            | ${t.titel ?? t.films.map(film =>  film.titel).join('+') 
                            }`
                        }
                    </option>
                ))}
            </Form.Select>

            {selectedReiheId && selectedTerminId && (
                <Button
                    variant="success"
                    className="mt-4"
                    onClick={handleAddTerminToReihe}
                >
                    Add selected Termin #{selectedTerminId} to chosen Reihe #{selectedReiheId}
                </Button>
            )}

        </div>
    );
}