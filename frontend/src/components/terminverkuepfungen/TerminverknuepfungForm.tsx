import React, { useState, useEffect } from "react";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import {preprocessFormData} from "../../utils/preprocessFormData.ts";
import {TVWithFilmAndTerminDTOSelection} from "../../types/TVWithFilmAndTerminDTOSelection.ts";
import TerminverknuepfungSelection from "./TerminverknuepfungSelection.tsx";
import {FilmDTOSelection} from "../../types/FilmDTOSelection.ts";
import FilmSelection from "../filme/FilmSelection.tsx";
import TerminDTOSelection from "../../types/TerminDTOSelection.ts";
import TerminSelection from "../termine/TerminSelection.tsx";
import {formatDateInTerminSelectOption} from "../../utils/formatDateInTerminSelectOption.ts";
import AdminNav from "../AdminNav.tsx";
import {trimAllStringsInObjectShallow} from "../../utils/trimAllStringsInObjectShallow.ts";
import styles from "../contact/Forms.module.css";
import FilmSelectionWithSearch from "../filme/FilmSelectionWithSearch.tsx";

const baseURL = "/api/terminverknuepfung";

const emptyTVForForm = {
    tnr: undefined,
    fnr: undefined,
    vorfilm: undefined,
    rang: undefined,

    film: {titel: '', jahr: undefined, regie: ""},
    termin: {vorstellungsbeginn: "", titel: ""},
}

export default function TerminverknuepfungForm() {
    const [allTVs, setAllTVs] = useState<TVWithFilmAndTerminDTOSelection[]>([]); // All Termine fetched from the server

    const [selectedTVId, setSelectedTVId] = useState<string | undefined>(undefined); // Selected TVId (as concatenated string) for editing or deleting
    const [selectedTV, setSelectedTV] = useState<TVWithFilmAndTerminDTOSelection>(emptyTVForForm); // Termin data for the form

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>(""); // for POST, PUT, DELETE requests

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // for POST, PUT
    const [isGetLoading, setIsGetLoading] = useState(false); // for GET

    const [selectionChanged, setSelectionChanged] = useState(false); // to track if a new selection has been made manually by the user

    // GET all terminverknuepfung (with film and termin information)
    const getAllTVs = () => {
        // setIsLoading(true);
        setErrorMessage("");

        axios.get(`${baseURL}/terminsorted`)
            .then((response) => setAllTVs(response.data))
            .catch((error) => {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                setErrorMessage(errorMessage);
            })
        // .finally(() => setIsLoading(false));
    };

    // Fetch all terminverknuepfungen for the dropdown selection
    useEffect(() => {
        getAllTVs();
    }, []);

    // Fetch the selected terminverknuepfung details only if we are editing or deleting
    useEffect(() => {

        if (selectionChanged) {
            // Reset the success message when the selected termin changes
            setSuccessMessage("");
            setSelectionChanged(false); // Reset the flag
        }

        if (selectedTVId) {
            // GET single terminverknuepfung (details)
            const getSingleTV = () => {

                setIsGetLoading(true);
                setErrorMessage("");

                const [tnr, fnr] = selectedTVId.split(',');

                axios.get(`${baseURL}/${tnr}/${fnr}`)
                    .then((response) => setSelectedTV(response.data))
                    .catch((error) => {
                        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                        setErrorMessage(errorMessage);
                    })
                    .finally(() => setIsGetLoading(false));
            };

            getSingleTV();

        } else {
            setSelectedTV(emptyTVForForm); // Reset the form for further adding/editing/deleting
        }
    }, [selectedTVId]);


    // Handle the form submission (PUT or POST)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(true);

        // Check if we're adding or editing a terminverknuepfung
        if (selectedTVId) {
            // Editing an existing terminverknuepfung (PUT request)

            const [tnr, fnr] = selectedTVId.split(',');

            axios.put(`${baseURL}/${tnr}/${fnr}`, trimAllStringsInObjectShallow( preprocessFormData(selectedTV) ))
                .then(() => {
                    setSuccessMessage("terminverknuepfung updated successfully!");

                    getAllTVs();
                    setSelectedTVId(undefined); // Reset the selection
                    setSelectedTV(emptyTVForForm); // Reset the form for further adding/editing/deleting
                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "Update failed";
                    setErrorMessage(errorMessage);
                })
                .finally(() => setIsLoading(false));

        } else {
            axios.post(`${baseURL}/link-film-termin`, trimAllStringsInObjectShallow( preprocessFormData(selectedTV) ))
                .then(() => {
                    setSuccessMessage("terminverknuepfung saved successfully!");

                    getAllTVs();
                    // setSelectedTVId(undefined); // Reset the selection, not required for POST because selection is unchanged
                    setSelectedTV(emptyTVForForm); // Reset the form for further adding/editing/deleting
                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "Saving failed";
                    setErrorMessage(errorMessage);
                })
                .finally(() => setIsLoading(false));
        }
    };

    // Handle terminverknuepfung deletion
    const handleDelete = () => {
        setErrorMessage("");
        setSuccessMessage("");
        if (selectedTVId) {

            const [tnr, fnr] = selectedTVId.split(',');

            axios.delete(`${baseURL}/${tnr}/${fnr}`)
                .then(() => {
                    setSuccessMessage("terminverknuepfung deleted successfully!");

                    getAllTVs();
                    setConfirmDeleteOpen(false);

                    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    // => I need to set it to remove the delete button from display after deletion!!
                    setSelectedTVId(undefined);

                    setSelectedTV(emptyTVForForm); // Reset the form for further adding/editing/deleting
                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "Deletion failed";
                    setErrorMessage(errorMessage);
                    setConfirmDeleteOpen(false);
                });
        }
    };

    // Handle form field changes, with extra distinguishing between checked and value
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type } = e.target;
        setSelectedTV((prevData: TVWithFilmAndTerminDTOSelection) => ({
            ...prevData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value,
        }));
    };

    // Handle TV selection changes
    const handleTVSelectionChange = (id: string | undefined) => {
        setSelectedTVId(id);
        setSelectionChanged(true); // Set flag when selection changes
    };

    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    // GET all films
    const [allFilms, setAllFilms] = useState<FilmDTOSelection[]>([]);

    const getAllFilms = () => {
        setErrorMessage("");

        axios.get(`api/filme`)
            .then((response) => setAllFilms(response.data))
            .catch((error) => {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                setErrorMessage(errorMessage);
            })
    };

    // Fetch all films for the dropdown selection
    useEffect(() => {
        getAllFilms();
    }, []);

    const handleFilmSelectionChange = (id: number | undefined) => {
        setSelectedTV((prevData: TVWithFilmAndTerminDTOSelection) => ({
            ...prevData,
            fnr: id,
        }));
    };

    // -----------------------------------------------------------
    // GET all termine

    const [allTermine, setAllTermine] = useState<TerminDTOSelection[]>([]);

    // GET all termine
    const getAllSortedTermine = () => {
        setErrorMessage("");

        axios.get(`api/termine`)
            .then((response) => setAllTermine(response.data))
            .catch((error) => {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                setErrorMessage(errorMessage);
            })
    };

    // Fetch all termine for the dropdown selection
    useEffect(() => {
        getAllSortedTermine();
    }, []);

    const handleTerminSelectionChange = (id: number | undefined) => {
        setSelectedTV((prevData: TVWithFilmAndTerminDTOSelection) => ({
            ...prevData,
            tnr: id,
        }));
    };
    // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    return (
        <main data-bs-theme="dark">
            <AdminNav />

            <h3 className="mt-3">{selectedTVId ? "Edit or delete Terminverknuepfung" : "Add new Terminverknuepfung for existing Film and existing Termin"}</h3>

            <TerminverknuepfungSelection
                allTVsWithFilmAndTermin={allTVs}
                selectedTVId={selectedTVId}
                onSelectTV={handleTVSelectionChange}
                textForDefaultOption={undefined}
            />

            {/*<div className="loadingSpacer"> /!* this css class approach does NOT work somehow compared to inline style*!/*/}
            <div style={{ minHeight: '30px' }}>
                {isGetLoading && <div className="text-warning mb-3" role="status">&#x1f504; Loading Termin details... Please wait!</div>}
            </div>


            <Form onSubmit={handleSubmit}>

                <h3 className="mt-3">Terminverknuepfung details</h3>

                <TerminSelection
                    allTermine={allTermine}
                    selectedTnr={selectedTV.tnr}
                    onSelectTermin={handleTerminSelectionChange}
                    textForDefaultOption={"Select a Termin for the creation of a Terminverknuepfung"}
                />

                {/*<Form.Label htmlFor="termin-selection" className="mt-3">Termin selection</Form.Label>*/}
                {/*<Form.Select*/}
                {/*    id="termin-selection" // Add id to connect to the label*/}
                {/*    name="tnr" // <-- Add name attribute here, so that the generic handleChange can access it*/}
                {/*    value={selectedTV.tnr ?? ""}*/}
                {/*    onChange={handleFormChange}*/}
                {/*    style={{ backgroundColor: 'dimgrey', color: 'whitesmoke' }}*/}
                {/*>*/}
                {/*    <option value="">Select a Termin</option>*/}
                {/*    {allTermine.map((t: TerminDTOSelection) => (*/}
                {/*        <option key={t.tnr} value={t.tnr}>*/}
                {/*            /!*{`${formatDateInTerminSelectOption(t.vorstellungsbeginn)}| ${t.titel} | #${t.tnr}`}*!/*/}
                {/*            {`${formatDateInTerminSelectOption(t.vorstellungsbeginn)}| #${t.tnr}`}*/}
                {/*        </option>*/}
                {/*    ))}*/}
                {/*</Form.Select>*/}

                {/*---------------------------------------------------------------------------*/}
                {/*<FilmSelection*/}
                {/*    allFilms={allFilms}*/}
                {/*    selectedFilmId={selectedTV.fnr}*/}
                {/*    onSelectFilm={handleFilmSelectionChange}*/}
                {/*    textForDefaultOption={"Select a Film for the creation of a Terminverknuepfung"}*/}
                {/*/>*/}

                {/*<Form.Label htmlFor="film-selection" className="mt-3">Film selection</Form.Label>*/}
                {/*<Form.Select*/}
                {/*    id="film-selection" // Add id to connect to the label*/}
                {/*    name="fnr" // // <-- Add name attribute here, so that the generic handleChange can access it*/}
                {/*    value={selectedTV.fnr ?? ""}*/}
                {/*    onChange={handleFormChange}*/}
                {/*    style={{ backgroundColor: 'dimgrey', color: 'whitesmoke' }}*/}
                {/*>*/}
                {/*    <option value="">Select a Film</option>*/}
                {/*    {allFilms.map((film) => (*/}
                {/*        <option key={film.fnr} value={film.fnr}>*/}
                {/*            {`${film.titel} | #${film.fnr}`}*/}
                {/*        </option>*/}
                {/*    ))}*/}
                {/*</Form.Select>*/}

                <FilmSelectionWithSearch
                    allFilms={allFilms}
                    selectedFilmId={selectedTV.fnr}
                    onSelectFilm={handleFilmSelectionChange}
                    textForDefaultOption={undefined}
                />

                <Form.Group controlId="vorfilm" className="mt-3">
                    <Form.Check
                        type="checkbox"
                        label="Vorfilm"
                        name="vorfilm"
                        checked={selectedTV.vorfilm || false}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="rang" className="mt-3">
                    <Form.Label>Rang</Form.Label>
                    {/*coalescing operator ?? here is important to display 0 value instead of empty string"*/}
                    {/*when to use ?? → when I want the value left of ?? even if it's falsy, e.g. relevant for number 0*/}
                    <Form.Control
                        type="number"
                        name="rang"
                        value={selectedTV.rang ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        vorgesehene Werte: 0, 1, 2, 3... → bestimmt die Anzeigereihenfolge der Filme des Programms im Termineintrag
                        <br/>
                        bei "Standard"-Screening (mit genau 1 Langfilm + optionale Vorfilme) das Feld leerlassen
                    </Form.Text>
                </Form.Group>

                <Button
                    type="submit"
                    variant={selectedTVId ? "success" : "primary"}
                    className="mt-4"
                    disabled={!((selectedTV.tnr !== undefined) && (selectedTV.fnr !== undefined))}
                >
                    {selectedTVId ? "Update " : "Add "} terminverknuepfung entry
                </Button>
                <div><sub className={styles.formSubtext}>Pflichtfelder: Termin- und Filmauswahl</sub></div>
            </Form>

            {selectedTVId && !confirmDeleteOpen && (
                <Button
                    variant="danger"
                    type="submit"
                    className="mt-4"
                    onClick={() => setConfirmDeleteOpen(true)}
                >
                    Delete terminverknuepfung entry
                </Button>
            )}

            {confirmDeleteOpen && (
                <div className="mt-3">
                    <p>Are you sure you want to delete this terminverknuepfung entry?</p>
                    <Button variant="secondary" onClick={() => setConfirmDeleteOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="outline-danger" onClick={handleDelete} className="ms-2">
                        Confirm Delete
                    </Button>
                </div>
            )}

            {( (selectedTVId && !confirmDeleteOpen) || confirmDeleteOpen ) && (
                <div><sub className={styles.formSubtext}>"Delete terminverkuepfung entry" removes the <u>connection</u> between the selected Termin and Film. The corresponding Termin and Film entities themselves will still exist.</sub></div>
            )}

            {isLoading && <div className="text-warning mb-3" role="status">&#x1f504; Perform {selectedTVId ? "updating " : "saving "} terminverknuepfung entry... Please wait!</div>}
            {errorMessage && <div className="text-danger mb-3" role="alert">{errorMessage}</div>}
            {successMessage && <div className="text-success mb-3" role="status">&#x2705; {successMessage}</div>}
        </main>
    );

}