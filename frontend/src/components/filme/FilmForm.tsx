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
import {trimAllStringsInObjectShallow} from "../../utils/trimAllStringsInObjectShallow.ts";
import styles from "../contact/Forms.module.css";
import FilmSelectionWithSearch from "./FilmSelectionWithSearch.tsx";

const baseURL = "/api/filme";

const emptyFilmForForm = {
    fnr: undefined,
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
    verleih: '',
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
            // // GET single film (details)
            // const getSingleFilm = () => {
            //
            //     setIsGetLoading(true);
            //     setErrorMessage("");
            //
            //     axios.get(`${baseURL}/${selectedFilmId}`)
            //         .then((response) => setSelectedFilm(response.data))
            //         .catch((error) => {
            //             const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            //             setErrorMessage(errorMessage);
            //         })
            //         .finally(() => setIsGetLoading(false));
            // };
            // getSingleFilm();
            //
            // // *****************************************************************************
            // // GET corresponding termine (as TerminDTOSelection[]) of the selected single film
            // const getTermineOfSingleFilm = () => {
            //
            //     setIsGetLoading(true);
            //     setErrorMessage("");
            //
            //     axios.get(`/api/terminverknuepfung/termin/fromfilm/${selectedFilmId}`)
            //         .then((response) => setTermineOfSelectedFilmId(response.data))
            //         .catch((error) => {
            //             const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            //             setErrorMessage(errorMessage);
            //         })
            //         .finally(() => setIsGetLoading(false));
            // };
            // getTermineOfSingleFilm();

            // fetch two resources concurrently using Promise.all (avoid multiple rapid state updates through setIsGetLoading(true))
            setIsGetLoading(true);
            setErrorMessage("");

            // GET single film (details)
            const getSingleFilm = axios.get(`${baseURL}/${selectedFilmId}`);
            // GET corresponding termine (as TerminDTOSelection[]) of the selected single film
            const getTermine = axios.get(`/api/terminverknuepfung/termin/fromfilm/${selectedFilmId}`);

            Promise.all([getSingleFilm, getTermine])
                .then(([filmResponse, termineResponse]) => {
                    setSelectedFilm(filmResponse.data);
                    setTermineOfSelectedFilmId(termineResponse.data);
                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                    setErrorMessage(errorMessage);
                })
                .finally(() => setIsGetLoading(false));

        } else {
            setSelectedFilm(emptyFilmForForm); // Reset the form for further adding/editing/deleting
        }
    }, [selectedFilmId]);


    // Handle the form submission (PUT or POST)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(true);


        // #################################################
        // sanitize string in stab linewise and elementwise:
        if (selectedFilm?.stab) {
            // logic here similar to utils function structureStabString
            const lines = selectedFilm.stab.split(/\r?\n/); // Split by newline characters (\r\n or \n)
            const sanitizedLines = lines.filter(line => line.trim() !== '') // Filter out empty lines
                .map(line => {
                    // const parts = line.split(':');   // splits at every colon
                    //                                  // .split(/:(.+)/) this splits at the first occurence of : but somehow parts has 3 items incl. an empty string
                    // const abbrev = parts[0].trim();
                    // const entry = parts.slice(1).join(':').trim();   // reversed the all colon split above

                    const index = line.indexOf(':');

                    const abbrev = line.substring(0, index).trim();
                    const entry = line.substring(index + 1).trim();

                    return `${abbrev}: ${entry}`;
                }
            );
            selectedFilm.stab = sanitizedLines.join('\n');
        }
        // #################################################

        // Check if we're adding or editing a film
        if (selectedFilmId) {
            // Editing an existing film (PUT request)

            axios.put(`${baseURL}/${selectedFilmId}`, trimAllStringsInObjectShallow( preprocessFormData(selectedFilm)) )
                                                                                        // preprocessing converts '' into null
                                                        // trims all string fields in top-level entries (no nested objects)
                .then(() => {
                    setSuccessMessage("Film updated successfully!");

                    getAllFilms();
                    setSelectedFilmId(undefined); // Reset the selection
                    setSelectedFilm(emptyFilmForForm); // Reset the form for further adding/editing/deleting
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
            axios.post(`${baseURL}`, trimAllStringsInObjectShallow( preprocessFormData(filmInFormWithoutFnr)) )
                .then(() => {
                    setSuccessMessage("Film saved successfully!");

                    getAllFilms();
                    // setSelectedFilmId(null); // Reset the selection, not required for POST because selection is unchanged
                    setSelectedFilm(emptyFilmForForm); // Reset the form for further adding/editing/deleting
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

                    setSelectedFilm(emptyFilmForForm); // Reset the form for further adding/editing/deleting
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

        // ordinary logic without handling the special conditions:
        //  setSelectedFilm((prevData: Film) => ({
        //     ...prevData,
        //     [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value,
        // }));

        setSelectedFilm((prevData: Film) => {
            // temporary object for changes
            const updatedData = {
                ...prevData,
                [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value,
            };

            let newValue;
            // --- special condition for originaltitel ---
            if (name === 'originaltitel') {
                newValue = updatedData.originaltitel ?? "";
                // if new value of Originaltitel is empty, originaltitelAnzeigen is set to false
                if (!newValue.trim()) { // check console.log(!" ");
                    updatedData.originaltitelAnzeigen = false;
                }
            }
            // --- special condition on offsetImageInGallery
            if (name === 'bild') {
                newValue = updatedData.bild ?? "";
                // if new value of bild is empty, offsetImageInGallery is set to empty string
                if (!newValue.trim()) { // check console.log(!" ");
                    updatedData.offsetImageInGallery = "";
                }
            }

            return updatedData;
        });
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
            // ?? operator is called the nullish coalescing operator; if value before ?? is empty string, then this empty string is taken, when using || the empty string is NOT taken
            // when to use ?? → when I want the value left of ?? even if it's falsy, e.g. relevant for number 0
            titel: selectedFilm.titel ?? '', // i.e. titel: selectedFilm.titel !== null && selectedFilm.titel !== undefined ? selectedFilm.titel : '',
            originalTitel: selectedFilm.originaltitel ?? '',
            jahr: String(selectedFilm.jahr ?? '')
        });

        // Sending the POST request
        axios.post(`${url}?${params.toString()}`)
            .then((response) => {
                // Copy the original text to clipboard
                copyToClipboard(selectedFilm.text ?? '');

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
        <main data-bs-theme="dark">
            <AdminNav />

            <h3 className="mt-3">{selectedFilmId ? "Edit or delete " : "Add new "} Film</h3>

            <FilmSelectionWithSearch
                allFilms={allFilms}
                selectedFilmId={selectedFilmId}
                onSelectFilm={handleSelectionChange}
                textForDefaultOption={undefined}
            />


            {/*<FilmSelection*/}
            {/*    allFilms={allFilms}*/}
            {/*    selectedFilmId={selectedFilmId}*/}
            {/*    onSelectFilm={handleSelectionChange}*/}
            {/*    textForDefaultOption={undefined}*/}
            {/*/>*/}


            {/*<div className="loadingSpacer"> /!* this css class approach does NOT work somehow compared to inline style*!/*/}
            <div style={{ minHeight: '30px' }}>
                {isGetLoading && <div className="text-warning mb-3" role="status">&#x1f504; Loading film details... Please wait!</div>}
            </div>

            {/*display corresponding Termine*/}
            {/*******************************/}
            {selectedFilmId && (
                <div className={styles.correspondingItems}>
                    <p>
                        {/*{*/}
                        {/*    termineOfSelectedFilmId.length === 1 ?*/}
                        {/*        "Termin zum ausgewählten Film:" :*/}
                        {/*        termineOfSelectedFilmId.length > 1 ?*/}
                        {/*            "Termine zum ausgewählten Film:" :*/}
                        {/*            "kein Termin zugeordnet"*/}
                        {/*}*/}

                        {/*no nested ternary operations here below*/}
                        {
                            (() => {
                                if (termineOfSelectedFilmId.length === 1) {
                                    return "Termin zum ausgewählten Film:";
                                } else if (termineOfSelectedFilmId.length > 1) {
                                    return "Termine zum ausgewählten Film:";
                                } else {
                                    return "keine Termine zugeordnet";
                                }
                            })()
                        }
                    </p>
                    <ul>
                        {termineOfSelectedFilmId.map((t) => (
                            <li key={t.tnr}>
                                {formatDateInTerminSelectOption(t.vorstellungsbeginn)} | #{t.tnr}
                            </li>
                        ))}
                    </ul>
                </div>
            )
            }

            <Form onSubmit={handleSubmit}>

                <h3 className="mt-3">Film details</h3>

                <Form.Group controlId="titel" className="mt-3">
                    <Form.Label>Titel *</Form.Label>
                    <Form.Control
                        type="text"
                        name="titel"
                        value={selectedFilm.titel || ""}
                        onChange={handleFormChange}
                        required
                    />
                    <Form.Text className="text-muted">
                        Bitte möglichst KEINE HTML-Entitäten (bspw. &auml;) oder HTML-Tags nutzen!
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="originaltitel" className="mt-3">
                    <Form.Label>Originaltitel</Form.Label>
                    <Form.Control
                        type="text"
                        name="originaltitel"
                        value={selectedFilm.originaltitel || ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        Bitte möglichst KEINE HTML-Entitäten (bspw. &auml;) oder HTML-Tags nutzen!<br/>
                        Wenn der Titel gleich dem Originaltitel ist (bspw. deutscher Film oder ausländischer Film ohne Auswertung in DE) → nur Feld Titel befüllen
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="originaltitelAnzeigen" className="mt-3">
                    {/*<Form.Label>Originaltitel anzeigen</Form.Label>*/}
                    <Form.Check
                        type="checkbox"
                        label="Originaltitel anzeigen **"
                        name="originaltitelAnzeigen"
                        checked={selectedFilm.originaltitelAnzeigen || false}
                        onChange={handleFormChange}
                        disabled={!(selectedFilm.originaltitel ?? "").trim()}
                    />
                    <Form.Text className="text-muted">
                        Anzeige des Originaltitels erfolgt in Gallery, Preview, Overview Semester & Archive (in den Screeningdetails wird es stets mit angezeigt); keine Anzeige im Adminbereich (außer im Feld Originaltitel des Filmformulars)
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="bild" className="mt-3">
                    <Form.Label>vollständiger Bilddateiname</Form.Label>
                    <Form.Control
                        type="text"
                        name="bild"
                        value={selectedFilm.bild ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        Bilddatei muss unter https://pupille.org/bilder/filmbilder/ abgelegt sein.
                        <br/>
                        Bilddatei muss unter /var/www/vhosts/epic-hypatia.212-227-48-226.plesk.page/pupille-website/external-static-container/static-files/bilder/filmbilder abgelegt sein
                        → plesk file manager nutzen! Achtung: Hier wird dieser Pfad aber als nur als /pupille-website/external-static-container/static-files/bilder/filmbilder dargestellt, weil der plesk file manager /var/www/vhosts/epic-hypatia.212-227-48-226.plesk.page
                        als Stammverzeichnis hat.
                        <br/>
                        Bilder für Überraschungsfilme: surprise_film1.jpg, ... , surprise_film3.jpg
                        <br/>
                        Wenn keine Eingabe erfolgt, erscheint default_film.jpg in der Gallery.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="offsetImageInGallery" className="mt-3">
                    <Form.Label>Offset für Bildanzeige in der Gallery **</Form.Label>
                    <Form.Control
                        type="text"
                        name="offsetImageInGallery"
                        value={selectedFilm.offsetImageInGallery ?? ""}
                        onChange={handleFormChange}
                        disabled={!(selectedFilm.bild ?? "").trim()}
                    />
                    <Form.Text className="text-muted">
                        nur einzustellen für den (einzigen) Langfilm im "Standard"-Termin (d.h. 1 Langfilm + optionale Vorfilme)
                        <br/>Textfeld; zulässige Werte: center (=default; Feld bitte leer lassen), top, bottom, Ganzzahlen in % oder px bspw. 10%, 20px, -30px
                        <br/> Erläuterung [0%, 100%]: 50% = (vertically) center; {"value>50%"} pushes the image up and {"value<50%"} pushes it down
                        <br/> Erläuterung: bottom, negative Pixelzahlen → viel vom unteren Bildausschnitt sehen; top, positive Pixelzahlen → viel vom oberen Bildausschnitt sehen
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="text" className="mt-3">
                    <Form.Label>Text</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={11}
                        name="text"
                        value={selectedFilm.text ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text>
                        Jeder Absatz (auch der erste und einzige) in ein p tag setzen!
                        <br/>
                        styled tag template → {'<span style="color: blue; font-weight: bold;">highlighted part</span>'}
                    </Form.Text>
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
                        value={selectedFilm.kurztext ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        erscheint nur in Gallery, wenn es der Hauptfilm in einem "Standard"-Termin (mit 1 Langfilm + optionale Vorfilme); Feld vorgesehen für <b>Inhaltliches bzgl. des Hauptfilms; idR keine Eintragung für Vorfilme</b>
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="besonderheit" className="mt-3">
                    <Form.Label><u>Film</u>besonderheit</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        name="besonderheit"
                        value={selectedFilm.besonderheit ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        erscheint in Gallery (wenn es der Hauptfilm ist) und Detailseite; Eintrag bezieht sich auf Besonderheit des <b>Films</b> (bspw. Erwähnung Director's Cut, Farbstich der analogen Kopie);
                        <br/>
                        keine Reihe(n) erwähnen, weil sonst Doppelung auf Detailseite, <b>kein</b> Feld für Kooperation, Filmfestival, Gäste (mit Einführung/Gespräch), Publikumswunsch, anderer Eintrittspreis, besondere Startzeit, abweichender Ort → Feld 'Besonderheit' im Termin-Formular verwenden
                        <br/>
                        a tag template → {`<a href="" class="custom-link" target="_blank" rel="noopener noreferrer">Linktext</a>`}
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="contentNote" className="mt-3">
                    <Form.Label>Content Note</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        name="contentNote"
                        value={selectedFilm.contentNote ?? ""}
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
                        rows={4}
                        name="trailer"
                        value={selectedFilm.trailer ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        embedded link code: {'<iframe ...'}
                        <br/>
                        a tag: {`<a href="" class="custom-link" target="_blank" rel="noopener noreferrer">Trailer</a>`}
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="land" className="mt-3">
                    <Form.Label>Land</Form.Label>
                    <Form.Control
                        type="text"
                        name="land"
                        value={selectedFilm.land ?? ""}
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
                        value={selectedFilm.sprache ?? ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="untertitel" className="mt-3">
                    <Form.Label>Untertitel</Form.Label>
                    <Form.Control
                        type="text"
                        name="untertitel"
                        value={selectedFilm.untertitel ?? ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="farbe" className="mt-3">
                    <Form.Label>Farbe</Form.Label>
                    <Form.Control
                        type="text"
                        name="farbe"
                        value={selectedFilm.farbe ?? ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="format" className="mt-3">
                    <Form.Label>Format</Form.Label>
                    <Form.Control
                        type="text"
                        name="format"
                        value={selectedFilm.format ?? ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="fsk" className="mt-3">
                    <Form.Label>FSK</Form.Label>
                    <Form.Control
                        as="select"
                        name="fsk"
                        value={selectedFilm.fsk ?? ""}
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

                <Form.Group controlId="verleih" className="mt-3">
                    <Form.Label>Verleih</Form.Label>
                    <Form.Control
                        type="text"
                        name="verleih"
                        value={selectedFilm.verleih ?? ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="regie" className="mt-3">
                    <Form.Label>Regie</Form.Label>
                    <Form.Control
                        type="text"
                        name="regie"
                        value={selectedFilm.regie ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        für Anzeige in der Gallery, Semesterübersicht und im Adminbereich
                        <br/>
                        unten im Feld "Stab & Besetzung" bitte die Regie ebenfalls eintragen.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="stab" className="mt-3">
                    <Form.Label>Stab & Besetzung</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={9}
                        name="stab"
                        value={selectedFilm.stab ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        a tag template → Link: {`<a href="" class="custom-link" target="_blank" rel="noopener noreferrer">Letterboxd</a>`}
                        <br/>
                        <span className="text-danger">Wichtig:</span> Zeilenumbruch muss vorliegen d.h. jeweils 1 Eintrag pro Zeile → [key]: [value] d.h. key und value getrennt durch einen Doppelpunkt
                        <br/>
                        Bei form submit werden leading and trailing blanks entfernt und zwar pro Zeile in den beiden Substrings getrennt durch den 1. Doppelpunkt; so eine Zeile ist zulässig und wird schön formatiert:
                        <pre> M   :     Ennio Morricone  </pre>
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="sonderfarbeTitel" className="mt-3">
                    <Form.Label>Sonderfarbe Titel</Form.Label>
                    <Form.Control
                        disabled={true}
                        type="number"
                        name="sonderfarbeTitel"
                        value={selectedFilm.sonderfarbeTitel || ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="sonderfarbe" className="mt-3">
                    <Form.Label>Sonderfarbe (für Glow-Effekt in der Gallery)</Form.Label>
                    <Form.Control
                        disabled={true}
                        type="text"
                        name="sonderfarbe"
                        value={selectedFilm.sonderfarbe ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        zulässige Werte: pupille-glow (=default; Feld bitte leer lassen), teal-glow, red-glow, orange-glow, yellow-glow, green-glow, blue-glow, indigo-glow, pink-glow
                    </Form.Text>
                </Form.Group>

                <Button variant={selectedFilmId ? "success" : "primary"} type="submit" className="mt-4">
                    {selectedFilmId ? "Update " : "Add "} film entry
                </Button>
                <div><sub className={styles.formSubtext}>*Pflichtfeld</sub></div>
                <div><sub className={styles.formSubtext}>**bedingtes Pflichtfeld</sub></div>
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

            {( (selectedFilmId && !confirmDeleteOpen) || confirmDeleteOpen ) && (
                <div><sub className={styles.formSubtext}>When a specific Film entry is deleted, also the <u>connections</u> (Terminverknuepfungen) to its Termin entities are removed, but not the Termin entities themselves. These entities are preserved.</sub></div>
            )}

            {isLoading && <div className="text-warning mb-3" role="status">&#x1f504; Perform {selectedFilmId ? "updating " : "saving "} film entry... Please wait!</div>}
            {errorMessage && <div className="text-danger mb-3" role="alert">{errorMessage}</div>}
            {successMessage && <div className="text-success mb-3" role="status">&#x2705; {successMessage}</div>}
        </main>
    );
}