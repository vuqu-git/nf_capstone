import React, { useState, useEffect } from "react";
import TerminSelection from "./TerminSelection";
import Termin from "../../types/Termin.ts";
import TerminDTOSelection from "../../types/TerminDTOSelection.ts";
import {Button, Form} from "react-bootstrap";
import axios from "axios";

import { preprocessFormData } from '../../utils/preprocessFormData.ts';
import AdminNav from "../AdminNav.tsx";
import {FilmDTOSelection} from "../../types/FilmDTOSelection.ts";
import styles from "../contact/Forms.module.css";
import {trimAllStringsInObjectShallow} from "../../utils/trimAllStringsInObjectShallow.ts";
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";
import ReiheDTOSelection from "../../types/ReiheDTOSelection.ts";

const baseURL = "/api/termine";

// Helper function to get current date in YYYY-MM-DD format
// for default time setting in form input vorstellungsbeginn
const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const emptyTerminForForm = {
    tnr: undefined,
    vorstellungsbeginn: `${getCurrentDate()}T20:15`,
    titel: '',
    text: '',
    kurztext: '',
    besonderheit: '',
    bild: '',
    offsetImageInGallery: '',
    showImageInDetails: undefined,
    startReservierung: '',
    linkReservierung: '',
    sonderfarbeTitel: undefined,
    sonderfarbe: '',
    veroeffentlichen: undefined,
    patenschaft: '',
}

export default function TerminForm() {
    const [allTermine, setAllTermine] = useState<TerminDTOSelection[]>([]); // All Termine fetched from the server
    const [selectedTerminId, setSelectedTerminId] = useState<number | undefined>(undefined); // Selected Termin for editing or deleting
    const [selectedTermin, setSelectedTermin] = useState<Termin>(emptyTerminForForm); // Termin data for the form

    const [filmsOfSelectedTerminId, setFilmsOfSelectedTerminId] = useState<FilmDTOSelection[]>([]); // list of the corresponding films of selectedTerminId
    const [reihenOfSelectedTerminId, setReihenOfSelectedTerminId] = useState<ReiheDTOSelection[]>([]); // list of the corresponding reihen of selectedTerminId

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>(""); // for POST, PUT, DELETE requests

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // for POST, PUT
    const [isGetLoading, setIsGetLoading] = useState(false); // for GET

    const [selectionChanged, setSelectionChanged] = useState(false); // to track if a new selection has been made manually by the user

    const [errorMissingBildWhenGivenTitel, setErrorMissingBildWhenGivenTitel] = useState<string | null>(null);

    // GET all termine
    const getAllSortedTermine = () => {
        // setIsLoading(true);
        setErrorMessage("");

        axios.get(`${baseURL}`)
            .then((response) => setAllTermine(response.data))
            .catch((error) => {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                setErrorMessage(errorMessage);
            })
        // .finally(() => setIsLoading(false));
    };

    // Fetch all termine for the dropdown selection
    useEffect(() => {
        getAllSortedTermine();
    }, []);

    // Fetch the selected termin details only if we are editing or deleting
    useEffect(() => {

        if (selectionChanged) {
            // Reset the success message when the selected termin changes
            setSuccessMessage("");
            setSelectionChanged(false); // Reset the flag
        }

        if (selectedTerminId) {

            setIsGetLoading(true);
            setErrorMessage("");

            // GET single termin (details)
            const getSingleTermin = axios.get(`${baseURL}/${selectedTerminId}`);
            // GET corresponding films (as FilmDTOSelection[]) of the selected single termin
            const getFilmsOfSingleTermin = axios.get(`/api/terminverknuepfung/film/fromtermin/${selectedTerminId}`);
            // GET corresponding reihen (as ReiheDTOSelection[]) of the selected single film
            const getReihen = axios.get(`/api/reihe/getreihen-fromtermin/${selectedTerminId}`);

            Promise.all([getSingleTermin, getFilmsOfSingleTermin, getReihen])
                .then(([terminResponse, filmsResponse, reihenResponse]) => {
                    setSelectedTermin(terminResponse.data);
                    setFilmsOfSelectedTerminId(filmsResponse.data);
                    setReihenOfSelectedTerminId(reihenResponse.data)
                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                    setErrorMessage(errorMessage);
                })
                .finally(() => setIsGetLoading(false));

        } else {
            // Reset the form for further adding/editing/deleting, including the default time for vorstellungsbeginn
            setSelectedTermin(emptyTerminForForm);
        }
    }, [selectedTerminId]);

    // Handle the form submission (PUT or POST)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // check on condition between titel and bild
        if (!!selectedTermin.titel === !!selectedTermin.bild) {
            // double negation returns true if the value is truthy, false if falsy.

            setErrorMessage("");
            setSuccessMessage("");
            setIsLoading(true);

            // Check if we're adding or editing a termin
            if (selectedTerminId) {
                // Editing an existing termin (PUT request)

                axios.put(`${baseURL}/${selectedTerminId}`, trimAllStringsInObjectShallow( preprocessFormData(selectedTermin) ))
                    .then(() => {
                        setSuccessMessage("Termin updated successfully!");

                        getAllSortedTermine();
                        setSelectedTerminId(undefined); // Reset the selection
                        setSelectedTermin(emptyTerminForForm); // Reset the form for further adding/editing/deleting
                    })
                    .catch((error) => {
                        const errorMessage = error instanceof Error ? error.message : "Update failed";
                        setErrorMessage(errorMessage);
                    })
                    .finally(() => setIsLoading(false));
            } else {

                // ####################################################
                // ignoring tnr when posting via this form
                const {tnr, ...terminInFormWithoutFnr} = selectedTermin;
                // ####################################################

                // axios.post(`${baseURL}`, selectedTermin)
                axios.post(`${baseURL}`, trimAllStringsInObjectShallow( preprocessFormData(terminInFormWithoutFnr) ))
                    .then(() => {
                        setSuccessMessage("Termin saved successfully!");

                        getAllSortedTermine();
                        // setSelectedTerminId(undefined); // Reset the selection, not required for POST because selection is unchanged
                        setSelectedTermin(emptyTerminForForm); // Reset the form for further adding/editing/deleting
                    })
                    .catch((error) => {
                        const errorMessage = error instanceof Error ? error.message : "Saving failed";
                        setErrorMessage(errorMessage);
                    })
                    .finally(() => setIsLoading(false));
            }

            setErrorMissingBildWhenGivenTitel(null);

        } else {
            if (selectedTermin.titel) {
                setErrorMissingBildWhenGivenTitel("Bitte gebe eine Bilddatei an! Die Angabe der Bilddatei ist verpflichtend, wenn ein Titel gewählt wurde.");
            } else {
                setErrorMissingBildWhenGivenTitel("Bitte lösche die Eingabe der Bilddatei! Die Bilddatei-Nennung ist nur dann nötig, wenn ein Titel gewählt wurde.");
            }
        }
    };

    // Handle DELETE
    const handleDelete = () => {
        setErrorMessage("");
        setSuccessMessage("");
        if (selectedTerminId) {

            axios.delete(`${baseURL}/${selectedTerminId}`)
                .then(() => {
                    setSuccessMessage("Termin deleted successfully!");

                    getAllSortedTermine();
                    setConfirmDeleteOpen(false);

                    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    // => I need to set it to remove the delete button from display after deletion!!
                    setSelectedTerminId(undefined);

                    setSelectedTermin(emptyTerminForForm); // Reset the form for further adding/editing/deleting
                })
                .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "Deletion failed";
                    setErrorMessage(errorMessage);
                    setConfirmDeleteOpen(false);
                });
        }
    };

    // Handle termin form field changes
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type } = e.target;

        setSelectedTermin((prevData: Termin) => {
            // temporary object for changes
            const updatedData = {
                ...prevData,
                [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value,
            };

            let newValue;

            // --- special condition on offsetImageInGallery
            if (name === 'bild') {
                newValue = updatedData.bild ?? "";
                // if new value of bild is empty, offsetImageInGallery is set to empty string
                if (!newValue.trim()) { // check console.log(!" ");
                    updatedData.offsetImageInGallery = "";
                }
            }

            // --- special condition on showImageInDetails
            if (name === 'bild') {
                newValue = updatedData.bild ?? "";
                // if new value of bild is empty, showImageInDetails is set to false
                if (!newValue.trim()) { // check console.log(!" ");
                    updatedData.showImageInDetails = false;
                }
            }
            return updatedData;
        });

        // check for condition on titel and bild
        if (!!selectedTermin.titel === !!selectedTermin.bild) {
            // double negation returns true if the value is truthy, false if falsy.
            setErrorMissingBildWhenGivenTitel(null); // Clear the error message
        }

    };

    // Handle selection changes
    const handleSelectionChange = (id: number | undefined) => {
        setSelectedTerminId(id);
        setSelectionChanged(true); // Set flag when selection changes
    };

    return (
        <main data-bs-theme="dark">
            <AdminNav />

            <h3 className="mt-3">{selectedTerminId ? "Edit or delete " : "Add new "} Termin</h3>

            <TerminSelection
                allTermine={allTermine}
                selectedTnr={selectedTerminId}
                onSelectTermin={handleSelectionChange}
                textForDefaultOption={undefined}
            />

            {/*<div className="loadingSpacer"> /!* this css class approach does NOT work somehow compared to inline style*!/*/}
            <div style={{ minHeight: '30px' }}>
                {isGetLoading && <div className="text-warning mb-3" role="status">&#x1f504; Loading Termin details... Please wait!</div>}
            </div>

            {/*display corresponding Filme*/}
            {/*****************************/}
            {selectedTerminId && (
                <div className={styles.correspondingItems}>
                    <p>
                        {
                            filmsOfSelectedTerminId.length === 1 ?
                                "Film zum ausgewählten Termin:" :
                                filmsOfSelectedTerminId.length > 1 ?
                                    "Filme zum ausgewählten Termin:" :
                                    "keine Filme zugeordnet"
                        }
                    </p>

                    <ul>
                        {filmsOfSelectedTerminId.map(f => (
                            <li key={f.fnr}>
                                {renderHtmlText(f.titel)} | #{f.fnr}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/*display corresponding Reihen*/}
            {/******************************/}
            {selectedTerminId && (
                <div className={styles.correspondingItems}>
                    <p>
                        {
                            reihenOfSelectedTerminId.length === 1 ?
                                "Reihe zum ausgewählten Termin:" :
                                reihenOfSelectedTerminId.length > 1 ?
                                    "Reihen zum ausgewählten Termin:" :
                                    "keine Reihe zugeordnet"
                        }
                    </p>

                    <ul>
                        {reihenOfSelectedTerminId.map(r => (
                            <li key={r.rnr}>
                                {renderHtmlText(r.titel)} | #{r.rnr}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Form onSubmit={handleSubmit}>

                <h3 className="mt-3">Termin details</h3>

                <Form.Group controlId="vorstellungsbeginn" className="mt-3">
                    <Form.Label>Vorstellungsbeginn *</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        name="vorstellungsbeginn"
                        value={selectedTermin.vorstellungsbeginn ?? ""}
                        onChange={handleFormChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="patenschaft" className="mt-3">
                    <Form.Label>Patenschaft (Mailadresse)</Form.Label>
                    <Form.Control
                        type="email"
                        name="patenschaft"
                        value={selectedTermin.patenschaft ?? ""}
                        onChange={handleFormChange}
                        // required
                    />
                    <Form.Text className="text-muted">
                        Höchstens 1 Email-Adresse eintragen!
                        {/*Bei mehreren Paten bitte kommagetrennte Liste von Mailadressen eintragen.*/}
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="titel" className="mt-3">
                    <Form.Label>Titel (für das ganze Programm am Termin)</Form.Label>
                    <Form.Control
                        type="text"
                        name="titel"
                        value={selectedTermin.titel ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        <span className="text-danger">Wichtig:</span> Feld leerlassen, wenn es <b>kein</b> (mit mehreren Langfilmen), sondern ein "Standard"-Screening (mit 1 Langfilm + optionale Vorfilme) ist!
                        <br/>
                        Der eingetragene Titel hier erscheint dann in der Gallery im Termineintrag links unterhalb des Datums.
                        <br/>
                        Wenn Eintragung hier erfolgt, muss unten ein Bild angegeben werden (für die korrekte Darstellung in der Gallery).
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="text" className="mt-3">
                    <Form.Label>Text</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={13}
                        name="text"
                        value={selectedTermin.text ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        Jeder Absatz (auch der erste und einzige) in ein p tag setzen!
                        <br/>
                        Feld leerlassen, wenn es <b>kein</b> Programmscreening (mit mehreren Langfilmen), sondern ein "Standard"-Screening (mit 1 Langfilm + optionale Vorfilme) ist!
                        <br/>
                        styled tag template → {'<span style="color: blue; font-weight: bold;">highlighted part</span>'}
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="kurztext" className="mt-3">
                    <Form.Label>Kurztext (= kurze Variante vom Text oben)</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="kurztext"
                        value={selectedTermin.kurztext ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        Wenn nur 1 Absatz, dann kein {"<p>...</p>"} verwenden. Hier statt Absätze eher {"<br>"} verwenden.
                        <br/>
                        Erscheint nur in Gallery; Feld vorgesehen für <b>Inhaltliches bzgl. des (ganzen Termin umfassenden) Filmprogramms</b> (alle (Lang-)Filme des Termins); nicht Reihe(n) erwähnen, weil sonst Doppelung auf Detailseite
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="besonderheit" className="mt-3">
                    <Form.Label><u>Termin</u>besonderheit</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        name="besonderheit"
                        value={selectedTermin.besonderheit ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        Wenn nur 1 Absatz, dann kein {"<p>...</p>"} verwenden. Hier statt Absätze eher {"<br>"} verwenden.
                        <br/>
                        Erscheint in Gallery und Detailseite; Eintrag bezieht sich auf den <b>Termin</b> (bspw. Kooperation, Filmfestival, Gäste (mit Einführung/Gespräch), Publikumswunsch, anderer Eintrittspreis, besondere Startzeit, abweichender Ort); keine Reihe(n) erwähnen, weil sonst Doppelung auf Detailseite
                        <br/>
                        a tag template → {`<a href="" class="custom-link" target="_blank" rel="noopener noreferrer">Linktext</a>`}
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="bild" className="mt-3">
                    <Form.Label className={errorMissingBildWhenGivenTitel ? "text-danger" : ""}>vollständiger Bildname mit Dateiendung (Bild repräsentiert das ganze Filmprogramm) **</Form.Label>
                    <Form.Control
                        type="text"
                        name="bild"
                        value={selectedTermin.bild ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        <span className="text-danger">Wichtig:</span> Dieses Feld muss befüllt, wenn oben ein Titel angegeben wurde, sonst leer lassen.
                        {/*<br/>*/}
                        {/*Bilddatei muss unter https://pupille.org/bilder/filmbilder/ abgelegt sein.*/}
                        <br/>
                        Bilddatei muss unter /var/www/vhosts/epic-hypatia.212-227-48-226.plesk.page/pupille-website/external-static-container/static-files/bilder/filmbilder abgelegt sein
                        → plesk file manager nutzen! Achtung: Hier wird dieser Pfad aber als nur als /pupille-website/external-static-container/static-files/bilder/filmbilder dargestellt, weil der plesk file manager /var/www/vhosts/epic-hypatia.212-227-48-226.plesk.page
                        als Stammverzeichnis hat.
                        <br/>
                        Bilder für Überraschungsfilme: surprise_film1.jpg, ... , surprise_film4.jpg
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="offsetImageInGallery" className="mt-3">
                    <Form.Label>Offset für Bildanzeige in der Gallery **</Form.Label>
                    <Form.Control
                        type="text"
                        name="offsetImageInGallery"
                        value={selectedTermin.offsetImageInGallery ?? ""}
                        onChange={handleFormChange}
                        disabled={!(selectedTermin.bild ?? "").trim()}
                    />
                    <Form.Text className="text-muted">
                        Nur einzustellen für den (einzigen) Langfilm im "Standard"-Screening (d.h. 1 Langfilm + optionale Vorfilme).
                        <br/>Textfeld; zulässige Werte: center (=default; Feld bitte leer lassen), top, bottom, Ganzzahlen in % oder px bspw. 10%, 20px, -30px
                        <br/><strong>Erläuterung [0%, 100%]: 50% = (vertically) center; {"value>50%"} pushes the image up and {"value<50%"} pushes it down</strong>
                        <br/>Erläuterung: bottom, negative Pixelzahlen → viel vom unteren Bildausschnitt sehen; top, positive Pixelzahlen → viel vom oberen Bildausschnitt sehen
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="showImageInDetails" className="mt-3">
                    {/*<Form.Label>(Termin-)Bild in den Screeningdetails anzeigen</Form.Label>*/}
                    <Form.Check
                        type="checkbox"
                        label="(Termin-)Bild in den Screeningdetails anzeigen **"
                        name="showImageInDetails"
                        checked={selectedTermin.showImageInDetails || false}
                        onChange={handleFormChange}
                        disabled={!(selectedTermin.bild ?? "").trim()}
                    />
                    <Form.Text className="text-muted">
                        Anzeige des (Termin-)Bildes nicht nur in der Gallery, sondern auch in den Screeningdetails
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="startReservierung" className="mt-3" style={{ display: 'none' }}>
                    <Form.Label>Start Reservierungsdatum</Form.Label>
                    <Form.Control
                        disabled={true}
                        type="date"
                        name="startReservierung"
                        value={selectedTermin.startReservierung ?? ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="linkReservierung" className="mt-3" style={{ display: 'none' }}>
                    <Form.Label>Link zur Reservierung</Form.Label>
                    <Form.Control
                        disabled={true}
                        type="text"
                        name="linkReservierung"
                        value={selectedTermin.linkReservierung ?? ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="sonderfarbeTitel" className="mt-3" style={{ display: 'none' }}>
                    <Form.Label>Sonderfarbe Titel</Form.Label>
                    <Form.Control
                        disabled={true}
                        type="number"
                        name="sonderfarbeTitel"
                        value={selectedTermin.sonderfarbeTitel ?? ""}
                        onChange={handleFormChange}
                    />
                </Form.Group>

                <Form.Group controlId="sonderfarbe" className="mt-3">
                    <Form.Label>Sonderfarbe (für Glow-Effekt in der Gallery)</Form.Label>
                    <Form.Control
                        as="select"
                        name="sonderfarbe"
                        value={selectedTermin.sonderfarbe ?? ""}
                        onChange={handleFormChange}
                    >
                        <option value="">pupille-glow (default)</option>
                        <option value="teal-glow">teal-glow</option>
                        <option value="red-glow">red-glow</option>
                        <option value="orange-glow">orange-glow</option>
                        <option value="yellow-glow">yellow-glow</option>
                        <option value="green-glow">green-glow</option>
                        <option value="blue-glow">blue-glow</option>
                        <option value="indigo-glow">indigo-glow</option>
                        <option value="pink-glow">pink-glow</option>
                    </Form.Control>
                    <Form.Text className="text-muted">
                        Eintrag hier für 'Sonderfarbe' hat <b>Vorrang</b> ggü. dem Sonderfarbe-Eintrag der zugehörigen Reihe → Farbsteuerung eher über Reihe machen, wenn Film in einer Reihe ist.<br/>
                        Mehrere Einträge hier möglich (comma separated!), es erfolgt dann automatische Zufallsauswahl der Farbe.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="veroeffentlichen" className="mt-3">
                    <Form.Label>Veroeffentlichen</Form.Label>
                    {/*coalescing operator ?? here is important to display 0 value instead of empty string"*/}
                    {/*when to use ?? → when I want the value left of ?? even if it's falsy, e.g. relevant for number 0*/}
                    <Form.Control
                        type="number"
                        name="veroeffentlichen"
                        value={selectedTermin.veroeffentlichen ?? ""}
                        onChange={handleFormChange}
                    />
                    <Form.Text className="text-muted">
                        Zahl größer 0 to publish; leer lassen oder 0 to hide
                    </Form.Text>
                </Form.Group>

                <Button variant={selectedTerminId ? "success" : "primary"} type="submit" className="mt-2">
                    {selectedTerminId ? "Update " : "Add "} termin entry
                </Button>
                <div><sub className={styles.formSubtext}>*Pflichtfelder</sub></div>
                <div><sub className={styles.formSubtext}>**bedingtes Pflichtfeld</sub></div>
            </Form>

            {errorMissingBildWhenGivenTitel && (
                <div className="text-danger mt-2">{errorMissingBildWhenGivenTitel}</div>
            )}

            {selectedTerminId && !confirmDeleteOpen && (
                <Button
                    variant="danger"
                    type="submit"
                    className="mt-3"
                    onClick={() => setConfirmDeleteOpen(true)}
                >
                    Delete termin entry
                </Button>
            )}

            {confirmDeleteOpen && (
                <div className="mt-3">
                    <p>Are you sure you want to delete this termin entry?</p>
                    <Button variant="secondary" onClick={() => setConfirmDeleteOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="outline-danger" onClick={handleDelete} className="ms-2">
                        Confirm Delete
                    </Button>
                </div>
            )}

            {( (selectedTerminId && !confirmDeleteOpen) || confirmDeleteOpen ) && (
                <div>
                    <sub className={styles.formSubtext}>
                        When deleting a specific Termin entry, also the <u>connections</u> (Terminverknuepfungen) to its Film entities are removed as well as the <u>connections</u> (Reiheverknuepfungen) to its Reihe entities are erased. The associated Film and Reihe entities themselves remain untouched.
                    </sub>
                </div>
            )}

            {isLoading && <div className="text-warning mb-3" role="status">&#x1f504; Perform {selectedTerminId ? "updating " : "saving "} termin entry... Please wait!</div>}
            {errorMessage && <div className="text-danger mb-3" role="alert">{errorMessage}</div>}
            {successMessage && <div className="text-success mb-3" role="status">&#x2705; {successMessage}</div>}
        </main>
    );
}