import React, { useState, useEffect } from "react";
import FilmSelection from "./FilmSelection";
import {Film} from "../../types/Film.ts";
import {FilmDTOSelection} from "../../types/FilmDTOSelection.ts";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import {preprocessFormData} from "../../utils/preprocessFormData.ts";
import {copyToClipboard} from "../../utils/copyToClipboard.ts";
import AdminNav from "../AdminNav.tsx";
import TerminDTOSelection from "../../types/TerminDTOSelection.ts";
import {formatDateInTerminSelectOption} from "../../utils/formatDateInTerminSelectOption.ts";

const baseURL = "/api/filme";

const emptyFilmForForm = {
    fnr: 0,
    titel: '',
    originaltitel: '',
    originaltitelAnzeigen: undefined,
    bild: '',
    offsetImageInGallery: '',
    text: '',
    kurztext: '',
    besonderheit: '',
    contentNote: '',
    trailer: '',
    land: '',
    jahr: undefined,
    laufzeit: undefined,
    sprache: '',
    untertitel: '',
    farbe: '',
    format: '',
    fsk: undefined,
    regie: '',
    stab: '',
    sonderfarbeTitel: undefined,
    sonderfarbe: undefined,
}

export default function FilmForm() {
    const [allFilms, setAllFilms] = useState<FilmDTOSelection[]>([]); // All films fetched from the server
    const [selectedFilmId, setSelectedFilmId] = useState<number | undefined>(undefined); // Selected film for editing or deleting
    const [selectedFilm, setSelectedFilm] = useState<Film>(emptyFilmForForm); // Film data for the form

    const [termineOfSelectedFilmId, setTermineOfSelectedFilmId] = useState<TerminDTOSelection[]>([]); // list of the corresponding termine of selectedFilmId


    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>(""); // for POST, PUT, DELETE requests

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // for POST, PUT
    const [isGetLoading, setIsGetLoading] = useState(false); // for GET

    const [selectionChanged, setSelectionChanged] = useState(false); // to track if a new selection has been made manually by the user

    // GET all films
    const getAllFilms = () => {
        // setIsLoading(true);
        setErrorMessage("");

        axios.get(`${baseURL}`)
            .then((response) => setAllFilms(response.data))
            .catch((error) => {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                setErrorMessage(errorMessage);
            })
        // .finally(() => setIsLoading(false));
    };

    // Fetch all films for the dropdown selection
    useEffect(() => {
        getAllFilms();
    }, []);

    // Fetch the selected film details only if we are editing or deleting
    useEffect(() => {

        if (selectionChanged) {
            // Reset the success message when the selected film changes
            setSuccessMessage("");
            setSelectionChanged(false); // Reset the flag
        }

        if (selectedFilmId) {
            // GET single film (details)
            const getSingleFilm = () => {

                setIsGetLoading(true);
                setErrorMessage("");

                axios.get(`${baseURL}/${selectedFilmId}`)
                    .then((response) => setSelectedFilm(response.data))
                    .catch((error) => {
                        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                        setErrorMessage(errorMessage);
                    })
                    .finally(() => setIsGetLoading(false));
            };
            getSingleFilm();

            // *****************************************************************************
            // GET corresponding termine (as TerminDTOSelection[]) of the selected single film
            const getTermineOfSingleFilm = () => {

                setIsGetLoading(true);
                setErrorMessage("");

                axios.get(`/api/terminverknuepfung/gettermine/${selectedFilmId}`)
                    .then((response) => setTermineOfSelectedFilmId(response.data))
                    .catch((error) => {
                        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                        setErrorMessage(errorMessage);
                    })
                    .finally(() => setIsGetLoading(false));
            };
            getTermineOfSingleFilm();

        } else {
            // Reset the form for adding a new film
            setSelectedFilm(emptyFilmForForm);
        }
    }, [selectedFilmId]);


    // Handle the form submission (PUT or POST)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(true);

        // Check if we're adding or editing a film
        if (selectedFilmId) {
            // Editing an existing film (PUT request)

            axios.put(`${baseURL}/${selectedFilmId}`, preprocessFormData(selectedFilm))
                .then(() => {
                    setSuccessMessage("Film updated successfully!");

                    getAllFilms();
                    setSelectedFilmId(undefined); // Reset the selection
                    setSelectedFilm(emptyFilmForForm); // Reset the form
                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "Update failed";
                    setErrorMessage(errorMessage);
                })
                .finally(() => setIsLoading(false));
        } else {

            // ###################################################
            // ignoring fnr when posting via this form
            const { fnr, ...filmInFormWithoutFnr } = selectedFilm;
            // ###################################################

            // axios.post(`${baseURL}`, selectedFilm)
            axios.post(`${baseURL}`, preprocessFormData(filmInFormWithoutFnr))
                .then(() => {
                    setSuccessMessage("Film saved successfully!");

                    getAllFilms();
                    // setSelectedFilmId(null); // Reset the selection, not required for POST because selection is unchanged
                    setSelectedFilm(emptyFilmForForm); // Reset the form
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
        if (selectedFilmId) {

            axios.delete(`${baseURL}/${selectedFilmId}`)
                .then(() => {
                    setSuccessMessage("Film deleted successfully!");

                    getAllFilms();
                    setConfirmDeleteOpen(false);

                    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    // => I need to set it to remove the delete button from display after deletion!!
                    setSelectedFilmId(undefined);

                    setSelectedFilm(emptyFilmForForm); // Reset the form
                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "Deletion failed";
                    setErrorMessage(errorMessage);
                    setConfirmDeleteOpen(false);
                });
        }
    };

    // Handle film form field changes
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type } = e.target;

        setSelectedFilm((prevData: Film) => ({
            ...prevData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value,
        }));
    };

    // Handle selection changes
    const handleSelectionChange = (id: number | undefined) => {
        setSelectedFilmId(id);
        setSelectionChanged(true); // Set flag when selection changes
    };

    // ################## AI ##################
    const generateFilmTextwithAI = () => {
        const url = '/api/perplexityai/film-text';

        // Construct query parameters
        const params = new URLSearchParams({
            // ?? operator is called the nullish coalescing operator
            titel: selectedFilm.titel ?? '', // i.e. titel: selectedFilm.titel !== null && selectedFilm.titel !== undefined ? selectedFilm.titel : '',
            originalTitel: selectedFilm.originaltitel ?? '',
            jahr: String(selectedFilm.jahr ?? '')
        });

        // Sending the POST request
        axios.post(`${url}?${params.toString()}`)
            .then((response) => {
                // Copy the original text to clipboard
                copyToClipboard(selectedFilm.text ? selectedFilm.text : '');

                // Update the news item with the response data
                setSelectedFilm((prevData: Film) => ({
                    ...prevData,
                    text: response.data,
                }));
            })
            .catch((error) => {
                // Log any error that occurs during the request
                console.error('Error occurred while sending the request:', error.nachricht);
            })
            .finally(() => {
                // Optional: Perform any cleanup or final actions here
                console.log('Request completed.');
            });
    };
    // ########################################

    return (
        <div data-bs-theme="dark">
            <AdminNav />

            <h3 className="mt-3">{selectedFilmId ? "Edit or delete " : "Add new "} Film</h3>

            <FilmSelection
                films={allFilms}
                selectedFilmId={selectedFilmId}
                onSelectFilm={handleSelectionChange}
                textForDefaultOption={undefined}
            />

            <div style={{ minHeight: '30px' }}>
                {isGetLoading && <div className="text-warning mb-3">&#x1f504; Loading film details... Please wait!</div>}
            </div>

            {selectedFilmId && (
                <Form.Group controlId="termineDisplay"
                            className="mt-3"
                            style={{
                                opacity: 0.4,
                            }}
                >
                    <Form.Label>{termineOfSelectedFilmId.length > 1 ? "Termine" : "Termin"} zum ausgewählten Film:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={termineOfSelectedFilmId.length}
                        value={
                            termineOfSelectedFilmId.map(t => formatDateInTerminSelectOption(t.vorstellungsbeginn) + " | #" + t.tnr).join("\n")
                        }
                        readOnly

                    />
                </Form.Group>
            )}

            <Form onSubmit={handleSubmit}>

                <h3 className="mt-3">Film details</h3>

                <Form.Group controlId="titel" className="mt-3">
                    <Form.Label>Titel</Form.Label>
                    <Form.Control
                        type="text"
                        name="titel"
                        value={selectedFilm.titel || ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="originaltitel" className="mt-3">
                    <Form.Label>Originaltitel</Form.Label>
                    <Form.Control
                        type="text"
                        name="originaltitel"
                        value={selectedFilm.originaltitel || ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="originaltitelAnzeigen" className="mt-3">
                    <Form.Check
                        type="checkbox"
                        label="Originaltitel anzeigen"
                        name="originaltitelAnzeigen"
                        checked={selectedFilm.originaltitelAnzeigen || false}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="bild" className="mt-3">
                    <Form.Label>vollständiger Bilddateiname</Form.Label>
                    <Form.Control
                        type="text"
                        name="bild"
                        value={selectedFilm.bild || ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        Bilddatei muss  unter https://pupille.org/bilder/filmbilder/ abgelegt sein.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="offsetImageInGallery" className="mt-3">
                    <Form.Label>Offset für Bildanzeige in der Gallery </Form.Label>
                    <Form.Control
                        type="text"
                        name="offsetImageInGallery"
                        value={selectedFilm.offsetImageInGallery || ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        Werte: center (=default; Feld bitte leer lassen), top, bottom, Ganzzahlen in % oder px bspw. 10%, 20px, -30px
                        <br/> Erläuterung [0%, 100%]: 50% = (vertically) center; {"value>50%"} pushes the image up and {"value<50%"} pushes it down
                        <br/> Erläuterung: bottom, negative Pixelzahlen → viel vom unteren Bildausschnitt sehen; top, positive Pixelzahlen → viel vom oberen Bildausschnitt sehen
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="text" className="mt-3">
                    <Form.Label>Text</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={13}
                        name="text"
                        value={selectedFilm.text || ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Button
                    variant="outline-info"
                    className="mt-4"
                    onClick={() => generateFilmTextwithAI()}
                    disabled={!selectedFilm.titel}  // Disable if title is falsy (null, undefined, or empty string)
                >
                    🤖🧠💬 Generate film text! ✨📄✍️
                </Button>

                <Form.Group controlId="kurztext" className="mt-3">
                    <Form.Label>Kurztext (= kurze Variante vom Text oben)</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="kurztext"
                        value={selectedFilm.kurztext || ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        Erscheint nur in Gallery, wenn es der Hauptfilm in einem "Standard"-Termin (mit 1 Langfilm + optionale Vorfilme); Feld vorgesehen für <b>Inhaltliches bzgl. des Hauptfilms; idR keine Eintragung für Vorfilme</b>
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="besonderheit" className="mt-3">
                    <Form.Label>Besonderheit</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        name="besonderheit"
                        value={selectedFilm.besonderheit || ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        Erscheint in Gallery (wenn es der Hauptfilm ist) und Detailseite; Eintrag bezieht sich auf Besonderheit des <b>Films</b> (bspw. Erwähnung Director's Cut, Farbstich der analogen Kopie);
                        <br/>
                        keine Reihe(n) erwähnen, weil sonst Doppelung auf Detailseite, <b>kein</b> Feld für Kooperation, Filmfestival, Gäste (Einführung/Gespräch), Publikumswunsch, anderer Eintrittspreis, besondere Startzeit, abweichender Ort → Feld 'Besonderheit' im Termin-Formular verwenden
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="contentNote" className="mt-3">
                    <Form.Label>Content Note</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        name="contentNote"
                        value={selectedFilm.contentNote || ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        Formulierung, die genauso angezeigt werden soll.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="trailer" className="mt-3">
                    <Form.Label>Trailer</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        name="trailer"
                        value={selectedFilm.trailer || ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="land" className="mt-3">
                    <Form.Label>Land</Form.Label>
                    <Form.Control
                        type="text"
                        name="land"
                        value={selectedFilm.land || ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="jahr" className="mt-3">
                    <Form.Label>Jahr</Form.Label>
                    <Form.Control
                        type="number"
                        name="jahr"
                        value={selectedFilm.jahr || ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="laufzeit" className="mt-3">
                    <Form.Label>Laufzeit (Minuten)</Form.Label>
                    <Form.Control
                        type="number"
                        name="laufzeit"
                        value={selectedFilm.laufzeit || ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="sprache" className="mt-3">
                    <Form.Label>Sprache</Form.Label>
                    <Form.Control
                        type="text"
                        name="sprache"
                        value={selectedFilm.sprache || ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="untertitel" className="mt-3">
                    <Form.Label>Untertitel</Form.Label>
                    <Form.Control
                        type="text"
                        name="untertitel"
                        value={selectedFilm.untertitel || ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="farbe" className="mt-3">
                    <Form.Label>Farbe</Form.Label>
                    <Form.Control
                        type="text"
                        name="farbe"
                        value={selectedFilm.farbe || ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="format" className="mt-3">
                    <Form.Label>Format</Form.Label>
                    <Form.Control
                        type="text"
                        name="format"
                        value={selectedFilm.format || ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="fsk" className="mt-3">
                    <Form.Label>FSK</Form.Label>
                    <Form.Control
                        as="select"
                        name="fsk"
                        value={selectedFilm.fsk || ""}
                        onChange={handleFormChange}
                    >
                        <option value="">Select FSK (or leave this to have it empty)</option> {/* Option to display if value is null */}
                        <option value="0">0</option>
                        <option value="6">6</option>
                        <option value="12">12</option>
                        <option value="16">16</option>
                        <option value="18">18</option>
                        <option value="ungeprüft">ungeprüft</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="regie" className="mt-3">
                    <Form.Label>Regie</Form.Label>
                    <Form.Control
                        type="text"
                        name="regie"
                        value={selectedFilm.regie || ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        Für Anzeige in der Gallery, Semesterübersicht und im Adminbereich. Unten im Feld "Stab & Besetzung" bitte die Regie ebenfalls eintragen.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="stab" className="mt-3">
                    <Form.Label>Stab & Besetzung</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={10}
                        name="stab"
                        value={selectedFilm.stab || ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="sonderfarbeTitel" className="mt-3">
                    <Form.Label>Sonderfarbe Titel</Form.Label>
                    <Form.Control
                        type="number"
                        name="sonderfarbeTitel"
                        value={selectedFilm.sonderfarbeTitel || ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="sonderfarbe" className="mt-3">
                    <Form.Label>Sonderfarbe (für Glow-Effekt in der Gallery)</Form.Label>
                    <Form.Control
                        type="text"
                        name="sonderfarbe"
                        value={selectedFilm.sonderfarbe || ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        zulässige Werte: pupille-glow (=default; Feld bitte leer lassen), teal-glow, red-glow, orange-glow, yellow-glow, green-glow, blue-glow, indigo-glow, pink-glow
                    </Form.Text>
                </Form.Group>

                <Button variant={selectedFilmId ? "success" : "primary"} type="submit" className="mt-4">
                    {selectedFilmId ? "Update " : "Add "} film entry
                </Button>
            </Form>

            {selectedFilmId && !confirmDeleteOpen && (
                <Button
                    variant="danger"
                    type="submit"
                    className="mt-4"
                    onClick={() => setConfirmDeleteOpen(true)}
                >
                    Delete film entry
                </Button>
            )}

            {confirmDeleteOpen && (
                <div className="mt-3">
                    <p>Are you sure you want to delete this film entry?</p>
                    <Button variant="secondary" onClick={() => setConfirmDeleteOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="outline-danger" onClick={handleDelete} className="ms-2">
                        Confirm Delete
                    </Button>
                </div>
            )}
            {isLoading && <div className="text-warning mb-3">&#x1f504; Perform {selectedFilmId ? "updating " : "saving "} film entry... Please wait!</div>}
            {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
            {successMessage && <div className="text-success mb-3">&#x2705; {successMessage}</div>}
        </div>
    );
};