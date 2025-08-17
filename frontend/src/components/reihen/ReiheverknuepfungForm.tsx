import React, { useState, useEffect } from "react";
import {Button, Form} from "react-bootstrap";
import styles from "../contact/Forms.module.css";
import axios from "axios";
import AdminNav from "../AdminNav.tsx";
import ReiheDTOFormWithTermineAndFilme from "../../types/ReiheDTOFormWithTermineAndFilme.ts";
import ReiheDTOSelection from "../../types/ReiheDTOSelection.ts";
import TerminDTOWithMainfilms from "../../types/TerminDTOWithMainfilms.ts";
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";
import {formatDateInTerminSelectOption} from "../../utils/formatDateInTerminSelectOption.ts";
import ReiheSelectionWithSearch from "./ReiheSelectionWithSearch.tsx";

const baseURL = "/api/reihe";

// this one is not for the form fields, but for the selection to see/edit the corresponding screenings via termine field
const emptyReihe = {
    rnr: undefined,
    titel: '',
    text: '',
    farbe: '',
    termine:[]
}

export default function ReiheverknuepfungForm() {
    const [allReihen, setAllReihen] = useState<ReiheDTOSelection[]>([]); // All Reihen fetched from the server
    const [selectedReiheId, setSelectedReiheId] = useState<number | undefined>(undefined); // Selected ReiheId (as concatenated string) for editing or deleting
    const [selectedReihe, setSelectedReihe] = useState<ReiheDTOFormWithTermineAndFilme>(emptyReihe); // Reihe data for the form
    const [selectionChanged, setSelectionChanged] = useState(false); // to track if a new Reihe selection has been made manually by the user

    const [allTermineWithMainfilme, setAllTermineWithMainfilme] = useState<TerminDTOWithMainfilms[]>([]);
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
            setSelectedReihe(emptyReihe); // Reset the form for further adding/editing/deleting
        }
    }, [selectedReiheId]);


    // Handle selection changes
    const handleSelectionChange = (id: number | undefined) => {
        setSelectedReiheId(id);
        setSelectionChanged(true); // Set flag when Reihe selection changes
    };

    return (
        <main data-bs-theme="dark">
            <AdminNav />

            <h3 className="mt-3">Add/delete Termin (incl. its Film(e)) to/from Reihe</h3>

             <ReiheSelectionWithSearch
                allReihen={allReihen}
                selectedReiheId={selectedReiheId}
                onSelectReihe={handleSelectionChange}
                textForDefaultOption={"Select a Reihe to edit the Reiheverknuepfungen"}
            />

            {/*<div className="loadingSpacer"> /!* this css class approach does NOT work somehow compared to inline style*!/*/}
            <div style={{ minHeight: '30px' }}>
                {isLoadingAllReihen && <div className="text-warning mb-3" role="status">&#x1f504; Loading all Reihe entries... Please wait!</div>}
                {isLoadingOneReihe && <div className="text-warning mb-3" role="status">&#x1f504; Loading Reihe's Termine and Filme... Please wait!</div>}
            </div>

            {/*display corresponding Termine incl. Filme + delete feature of Reihe-Termin-Connections*/}
            {/****************************************************************************************/}
            {selectedReihe.titel && !isLoadingAllReihen && (
                // <div className={styles.correspondingItems}>
                <div className={styles.correspondingItemsInReiheVerknuepfungForm + " " + styles.terminList}>
                    <p className="mb-0">currently assigned Termine (displayed with its Film(e)) to the above selected Reihe:</p>

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
                                                Delete (rnr, tnr)={`(#${selectedReiheId}, #${t.tnr})`}
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

                                {t.mainfilms && t.mainfilms.length > 0 && (
                                    <div className={styles.filmList}>
                                        {t.mainfilms.map((f) => (
                                            <div key={f.fnr} className={styles.filmItem}>
                                                {renderHtmlText(f.titel)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={styles.terminRow}>[no screenings assigned yet]</div>
                    )}

                    {selectedReihe.termine && selectedReihe.termine.length > 0 ? <div><sub className={styles.formSubtext}><span className="text-danger">"Delete (rnr, tnr)=..."</span> removes the <u>connection</u>  between the selected Reihe (above) and the chosen Termin. The both associated Reihe and Termin entities are preserved.</sub></div> : null}
                </div>
            )}

            <div className="loadingSpacer">
                {isLoadingForAddDelete && <div className="text-warning mb-3" role="status">&#x1f504; Processing... Please wait!</div>}
                {errorMessage && <div className="text-danger mb-3" role="alert">{errorMessage}</div>}
                {successMessage && <div className="text-success mb-3" role="status">&#x2705; {successMessage}</div>}
            </div>

            {/*establish reihe-terminverknuepfung by adding Termin to the chosen Reihe*/}
            {/*#######################################################################*/}

            { selectedReiheId && (
                <>
                    <h3 className="mt-3">Add Termin to Reihe #{selectedReiheId}</h3>

                    <p>Add a Termin (displayed here with Termin title <u>or</u> the corresponding films) to the selected Reihe above:</p>

                    <Form.Label htmlFor="termin-selection" className="mt-0">Termin selection</Form.Label>
                    <Form.Select
                        id="termin-selection" // Add id to connect to the label
                        value={selectedTerminId ?? ""}
                        onChange={handleTerminSelectionChange}
                    >
                        <option value="">Select a Termin</option>
                        {allTermineWithMainfilme.map((t: TerminDTOWithMainfilms) => (
                            <option key={t.tnr} value={t.tnr}>
                                {
                                    `${formatDateInTerminSelectOption(t.vorstellungsbeginn)} | tnr: #${t.tnr}
                                → ${t.titel ?? t.mainfilms.map(film =>  film.titel).join('+')
                                    }`
                                }
                            </option>
                        ))}
                    </Form.Select>
                    <div><sub className={styles.formSubtext}>Pflichtfelder: Reihen- und Terminauswahl</sub></div>

                    {selectedReiheId && selectedTerminId && (
                        <Button
                            variant="success"
                            className="mt-4"
                            onClick={handleAddTerminToReihe}
                        >
                            Add selected Termin #{selectedTerminId} to chosen Reihe #{selectedReiheId}
                        </Button>
                    )}
                </>
            )}
        </main>
    );
}