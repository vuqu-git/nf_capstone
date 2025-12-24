import React, { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import axios from "axios";

import AdminNav from "../../AdminNav";
import styles from "../../contact/Forms.module.css";
import surveyStyles from "../Survey.module.css";

import UmfrageSelectionWithSearch from "../umfrage/UmfrageSelectionWithSearch.tsx";
import {UmfrageDTO} from "../../../types/UmfrageDTO";
import {StimmabgabeDTO} from "../../../types/StimmabgabeDTO.ts";
import {StimmabgabeByUmfrageDTO} from "../../../types/StimmabgabeByUmfrageDTO.ts";
import Card from "react-bootstrap/Card";
import {AuswahloptionNestedDTO} from "../../../types/AuswahloptionNestedDTO.ts";

const umfrageBaseURL = "/api/survey/umfragen";
const stimmabgabeBaseURL = "/api/survey/stimmabgaben";

const emptyVoteForForm: StimmabgabeDTO = {
    snr: undefined,
    datum: null,
    isSessionDuplicate: null,
    isUserDuplicate: null,
    onr: -1,
    unr: -1,
    auswahloptionTitel: "",
    auswahloptionDetails: "",
    umfrageAnlass: ""
};

class FormControlElement {
}

export default function StimmabgabeForm() {
    const [allUmfragen, setAllUmfragen] = useState<UmfrageDTO[]>([]);
    const [selectedUmfrageId, setSelectedUmfrageId] = useState<number | undefined>(undefined);

    const [availableOptions, setAvailableOptions] = useState<AuswahloptionNestedDTO[]>([]);

    const [votes, setVotes] = useState<StimmabgabeByUmfrageDTO[]>([]);
    const [newVote, setNewVote] = useState<StimmabgabeDTO>(emptyVoteForForm);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGetLoading, setIsGetLoading] = useState(false);

    // ---- load all surveys for selection ----
    useEffect(() => {
        axios
            .get<UmfrageDTO[]>(umfrageBaseURL)
            .then(r => setAllUmfragen(r.data))
            .catch(e =>
                setErrorMessage(e instanceof Error ? e.message : "Error fetching surveys")
            );
    }, []);

    // ---- when survey changes, load its votes ----
    // useEffect(() => {
    //     if (!selectedUmfrageId) {
    //         setVotes([]);
    //         setNewVote({ ...emptyVoteForForm, unr: -1 });
    //         return;
    //     }
    //
    //     setIsGetLoading(true);
    //     setErrorMessage("");
    //     setSuccessMessage("");
    //
    //     axios
    //         .get<StimmabgabeByUmfrageDTO[]>(`${stimmabgabeBaseURL}/forumfrage/${selectedUmfrageId}`)
    //         .then(r => {
    //             setVotes(r.data);
    //             setNewVote(prev => ({
    //                 ...emptyVoteForForm,
    //                 unr: selectedUmfrageId,
    //                 umfrageAnlass: r.data[0]?.umfrageAnlass ?? prev.umfrageAnlass
    //             }));
    //         })
    //         .catch(e =>
    //             setErrorMessage(e instanceof Error ? e.message : "Error loading votes")
    //         )
    //         .finally(() => setIsGetLoading(false));
    // }, [selectedUmfrageId]);
    useEffect(() => {
        if (!selectedUmfrageId) {
            setVotes([]);
            setAvailableOptions([]);
            setNewVote({ ...emptyVoteForForm, unr: -1 });
            return;
        }

        setIsGetLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        // 1) load votes for this survey
        axios
            .get<StimmabgabeByUmfrageDTO[]>(`${stimmabgabeBaseURL}/forumfrage/${selectedUmfrageId}`)
            .then(r => {
                setVotes(r.data);
                setNewVote(prev => ({
                    ...emptyVoteForForm,
                    unr: selectedUmfrageId,
                    umfrageAnlass: r.data[0]?.umfrageAnlass ?? prev.umfrageAnlass
                }));
            })
            .catch(e =>
                setErrorMessage(e instanceof Error ? e.message : "Error loading votes")
            )
            .finally(() => setIsGetLoading(false));

        // 2) load the Umfrage with its options (if not already available)
        axios
            .get<UmfrageDTO>(`${umfrageBaseURL}/${selectedUmfrageId}`)
            .then(r => {
                setAvailableOptions(r.data.auswahloptionendtos ?? []);
            })
            .catch(e =>
                setErrorMessage(e instanceof Error ? e.message : "Error loading options")
            );
    }, [selectedUmfrageId]);

    const handleSurveySelect = (unr: number | undefined) => {
        setSelectedUmfrageId(unr);
    };

    // ---- form handlers for creating a vote ----
    // const handleNewVoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, type, value, checked } = e.target; // now OK
    //     setNewVote(prev => ({
    //         ...prev,
    //         [name]: type === "checkbox" ? checked : value,
    //     }));
    // };
    const handleNewVoteChange = (
        e: React.ChangeEvent<FormControlElement>
    ) => {
        const target = e.currentTarget; // typed as FormControlElement

        const { name, type, value } = target as HTMLInputElement; // safe for inputs/selects

        if (type === "checkbox" && target instanceof HTMLInputElement) {
            const checked = target.checked;
            setNewVote(prev => ({ ...prev, [name]: checked }));
            return;
        }

        setNewVote(prev => ({
            ...prev,
            [name]: name === "onr" || name === "unr" ? Number(value) : value,
        }));
    };


    const handleCreateVote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUmfrageId) {
            setErrorMessage("Bitte zuerst eine Umfrage auswählen.");
            return;
        }
        if (!newVote.onr || newVote.onr === -1) {
            setErrorMessage("Bitte eine Option (onr) angeben.");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const payload: StimmabgabeDTO = {
            ...newVote,
            unr: selectedUmfrageId,
            datum: newVote.datum || null
        };

        axios
            .post<StimmabgabeDTO>(stimmabgabeBaseURL, payload)
            .then(() => {
                setSuccessMessage("Stimme gespeichert.");
                // reload votes
                return axios.get<StimmabgabeByUmfrageDTO[]>(
                    `${stimmabgabeBaseURL}/forumfrage/${selectedUmfrageId}`
                );
            })
            .then(r => {
                setVotes(r.data);
                setNewVote({ ...emptyVoteForForm, unr: selectedUmfrageId });
            })
            .catch(e =>
                setErrorMessage(e instanceof Error ? e.message : "Speichern fehlgeschlagen")
            )
            .finally(() => setIsLoading(false));
    };

    // ---- delete vote ----
    const handleDeleteVote = (snr?: number) => {
        if (!snr) return;
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        axios
            .delete(`${stimmabgabeBaseURL}/${snr}`)
            .then(() => {
                setSuccessMessage("Stimme gelöscht.");
                setVotes(prev => prev.filter(v => v.snr !== snr));
            })
            .catch(e =>
                setErrorMessage(e instanceof Error ? e.message : "Löschen fehlgeschlagen")
            )
            .finally(() => setIsLoading(false));
    };

    return (
        <main data-bs-theme="dark">
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

            <h3 className="mt-3">Administer Stimmabgaben of Umfragen</h3>

            <UmfrageSelectionWithSearch
                allUmfragen={allUmfragen}
                selectedUmfrageId={selectedUmfrageId}
                onSelectUmfrage={handleSurveySelect}
                textForDefaultOption="Select/search a umfrage to see its voting records"
            />

            {!selectedUmfrageId && (
                <p className="text-muted">
                    Bitte eine Umfrage auswählen, um Stimmen zu erfassen und zu sehen.
                </p>
            )}

            {selectedUmfrageId && (
                <Form onSubmit={handleCreateVote} className={styles.formContainer}>
                    {/* “Form fields first” – analogous to UmfrageForm */}

                    <h5>Neue Stimmabgabe erfassen</h5>

                    {/*<Form.Group className="mb-2">*/}
                    {/*    <Form.Label>onr (Option-ID) *</Form.Label>*/}
                    {/*    <Form.Control*/}
                    {/*        type="number"*/}
                    {/*        name="onr"*/}
                    {/*        value={newVote.onr === -1 ? "" : newVote.onr}*/}
                    {/*        onChange={handleNewVoteChange}*/}
                    {/*        required*/}
                    {/*    />*/}
                    {/*</Form.Group>*/}
                    <Form.Group controlId="onr" className="mb-2">
                        <Form.Label>Option *</Form.Label>
                        <Form.Select
                            name="onr"
                            value={newVote.onr === -1 ? "" : newVote.onr}
                            onChange={handleNewVoteChange}
                            required
                            disabled={availableOptions.length === 0}
                        >
                            <option value="">Bitte Option wählen</option>
                            {availableOptions.map(opt => (
                                <option key={opt.onr} value={opt.onr}>
                                    {opt.titel}{opt.details ? `: ${opt.details}` : ""}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="datum" className="mb-3">
                        <Form.Label>Voting-Datum</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="datum"
                            value={newVote.datum ? newVote.datum.slice(0, 16) : ""}
                            onChange={handleNewVoteChange}
                        />
                        <Form.Text className="text-muted">
                            <ul className="tight-list">
                                <li>Wenn leer gelassen, wird der aktuelle Zeitpunkt der Stimmabgabeerstellung genommen.</li>
                            </ul>
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="Session duplicate">
                        <Form.Check
                            type="checkbox"
                            label="Session duplicate"
                            name="isSessionDuplicate"
                            checked={Boolean(newVote.isSessionDuplicate)}
                            onChange={handleNewVoteChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="User duplicate" className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="User duplicate"
                            name="isUserDuplicate"
                            checked={Boolean(newVote.isUserDuplicate)}
                            onChange={handleNewVoteChange}
                        />
                    </Form.Group>

                    <div className="d-flex gap-2 mt-3">
                        <Button variant="success" type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Stimmabgabe erstellen"}
                        </Button>
                    </div>
                    <div><sub className={styles.formSubtext}>*Pflichtfeld</sub></div>

                    {/* TABLE directly under the fields & button, same visual style as UmfrageForm */}
                    <Card className="mt-4 bg-secondary bg-opacity-10">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <span>Erfasste Stimmabgaben</span>
                            {/* Optional: small info text */}
                        </Card.Header>
                        <Card.Body className="p-2">
                            <div
                                className={`table-responsive ${surveyStyles.tableStyle}`}
                            >
                                <Table
                                    size="sm"
                                    variant="dark table-hover"
                                    borderless
                                    className="mb-0"
                                >
                                    <thead>
                                    <tr>
                                        <th>snr</th>
                                        <th>Voting‑Datum</th>
                                        <th>Option</th>
                                        <th>Details</th>
                                        <th>Session 👯</th>
                                        <th>User 👯</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {votes.map((v, idx) => (
                                        <tr key={v.snr ?? idx}>
                                            <td>{v.snr}</td>
                                            <td>
                                                {/*{v.datum*/}
                                                {/*                        toLocaleString() defaults to the user's browser locale, which is often en-US (12-hour format) even if you are in Europe*/}
                                                {/*    ? new Date(v.datum).toLocaleString()*/}
                                                {/*    : ""}*/}
                                                {v.datum
                                                    ? new Date(v.datum).toLocaleString("de-DE", {
                                                        hour12: false,
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                    })
                                                    : ""}
                                            </td>
                                            <td>{v.auswahloptionTitel}</td>
                                            <td>{v.auswahloptionDetails}</td>
                                            <td>{v.isSessionDuplicate ? "✓" : ""}</td>
                                            <td>{v.isUserDuplicate ? "✓" : ""}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className={surveyStyles.xButtonStyle}
                                                    onClick={() => handleDeleteVote(v.snr)}
                                                 >
                                                    🗑️
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {votes.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-center text-muted"
                                            >
                                                Keine Stimmabgaben vorhanden.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>

                </Form>
            )}
        </main>
    );

}
