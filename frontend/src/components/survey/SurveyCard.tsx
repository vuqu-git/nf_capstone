import { useEffect, useState } from "react";
import { Card, Button, Alert, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import surveyStyles from "./Survey.module.css";
import {formatDateInOverviewArchive} from "../../utils/formatDateInOverviewArchive.ts";
import {UmfrageDTO} from "../../types/UmfrageDTO.ts";
import {StimmabgabeDTO} from "../../types/StimmabgabeDTO.ts";
import NotFound from "../NotFound.tsx";

export default function SurveyCard() {
    const { unr } = useParams<{ unr: string }>();

    const [umfrage, setUmfrage] = useState<UmfrageDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

    useEffect(() => {
        if (!unr) {
            setError("Keine Umfrage-ID in der URL gefunden.");
            return;
        }
        setLoading(true);
        axios.get<UmfrageDTO>(`/api/survey/umfragen/${unr}`)
            .then((res) => {
                setUmfrage(res.data);
                setError(null);
            })
            .catch((err) => {
                console.error(err);
                setError("Fehler beim Laden der Umfrage.");
            })
            .finally(() => setLoading(false));
    }, [unr]);

    const isSurveyActive = (): boolean => {
        if (!umfrage || !umfrage.endDatum) return true;

        const now = new Date();

        // 1. Parse the string manually to avoid UTC conversion issues
        // format expected: "YYYY-MM-DD"
        const [year, month, day] = umfrage.endDatum.split('-').map(Number);

        // 2. Create a local date object for the deadline
        // Month is 0-indexed in JS (0=Jan, 11=Dec)
        //      new Date(y, m, d): This constructor always creates a date in the user's local timezone.
        //      It ignores UTC entirely. "Dec 25" becomes "Dec 25 Local Time".
        //      This matches the user's expectation: "This survey ends when my day ends" (or whenever the server says it ends, but visually it makes sense to the user).
        //      Since you have implemented the hard "Frankfurt Time" check in the backend, this frontend check is purely cosmetic (UX) to disable the button. This robust local implementation ensures the button doesn't disable prematurely for users in Western timezones (e.g., USA) or incorrectly stay open for Eastern ones.
        const deadline = new Date(year, month - 1, day);
            // The Issue/Problem
            // ~~~~~~~~~~~~~~~~~
            // When you do directly:
            // const deadline = new Date(umfrage.endDatum); // e.g., "2025-12-25"
            //     Browser Parsing: Since endDatum is a date-only string (e.g., "2025-12-25"), most browsers (per ISO 8601) will interpret this as UTC midnight (2025-12-25T00:00:00Z).
            //     Local Time Shift: If you are in Germany (UTC+1), your browser will display this as 1:00 AM on Dec 25th.
            //     setHours(23...): You then set the time to 23:59:59 in local time. This generally works, but it's fragile.
            // If the user is in a different timezone (e.g., USA), new Date("2025-12-25") might resolve to Dec 24th local time, leading to endDate being set to Dec 24th, 23:59:59, effectively closing the survey 24 hours too early for that user.

        // 3. Set to end of that specific day
        deadline.setHours(23, 59, 59, 999);

        // 4. Compare
        return now <= deadline;
    };

    const handleSubmit = () => {
        if (!selectedOption || !umfrage) return;
        setSubmitting(true);

        // 1. Define unique keys for this specific survey
        const sessionKey = `voted_session_survey_${umfrage.unr}`;
        const localKey = `voted_user_survey_${umfrage.unr}`;

        // 2. Check if keys exist.
        // If getItem returns a value, it IS a duplicate.
        // If null, it is NOT a duplicate.
        const isSessionDuplicate = !!sessionStorage.getItem(sessionKey);
        const isUserDuplicate = !!localStorage.getItem(localKey);

        const payload: StimmabgabeDTO = {
            onr: selectedOption,
            unr: umfrage.unr,

            datum: new Date().toISOString(), // The method toISOString() always returns the time in UTC (Coordinated Universal Time), also known as "Zulu time" (indicated by the Z at the end of the string). In the spring backend the field type is Instant.

            // 3. Send the status to backend
            isSessionDuplicate: isSessionDuplicate,
            isUserDuplicate: isUserDuplicate
        };

        axios.post<StimmabgabeDTO>("/api/survey/stimmabgaben", payload)
            .then(() => {
                setSubmitSuccess(true);

                // 4. Update storage only on SUCCESS to prevent false positives if request fails
                if (!isSessionDuplicate) {
                    sessionStorage.setItem(sessionKey, 'true');
                }
                if (!isUserDuplicate) {
                    localStorage.setItem(localKey, 'true');
                }
            })
            .catch((err) => {
                console.error(err);
                setError("Fehler beim Speichern der Stimme.");
            })
            .finally(() => setSubmitting(false));
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center p-5">
                <Spinner animation="border" variant="warning" role="status">
                    <span className="visually-hidden">Lade Umfrage...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        // in case the no umfrage unr is found under the path /survey/{unr}
        return (
            // <Card className={`terminFilmDetails-card border-danger ${surveyStyles.cardCustom}`}>
            //     <Card.Body>
            //         <Alert variant="danger" className="m-0">{error}</Alert>
            //     </Card.Body>
            // </Card>
            <NotFound/>
        );
    }

    if (!umfrage) return null;

    return (
        <Card className={`terminFilmDetails-card pupille-glow`}>
            <Card.Body>

                {/* Main Title (Anlass) */}
                <Card.Title as="h2" className={surveyStyles.umfrageAnlass}>
                    {umfrage.anlass}
                </Card.Title>

                {/* Description */}
                <div className={surveyStyles.umfrageDescription}>
                    <p>{umfrage.beschreibung}</p>
                    <p>Die Umfrage läuft bis einschließlich {formatDateInOverviewArchive(umfrage.endDatum ?? undefined)}, 23:59:59 Uhr.</p>
                </div>

                {/* Logic: Active / Success / Form */}
                {!isSurveyActive() ? (
                    <Alert variant="secondary" className="bg-dark text-secondary border-secondary">
                        <h5 className="text-warning">Umfrage beendet</h5>
                        <p>Der Umfragezeitraum ist leider abgelaufen.</p>
                    </Alert>
                ) : submitSuccess ? (
                    <div className="text-center py-3 border border-warning">
                        <div className="text-success fs-4 fw-bold">Vielen Dank!</div>
                        <span className={surveyStyles.umfrageDescription}>Dein Voting wurde erfolgreich übermittelt.</span>
                    </div>
                ) : (
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="d-flex flex-column gap-3 mb-4">
                            {umfrage.auswahloptionendtos.map((opt) => (
                                <div
                                    key={opt.onr}
                                    // className={`d-flex align-items-start gap-3 p-3 rounded ${surveyStyles.optionCard} ${selectedOption === opt.onr ? surveyStyles.optionCardSelected : ""}`}
                                    className={`d-flex align-items-start gap-3 rounded ${surveyStyles.optionCard} ${selectedOption === opt.onr ? surveyStyles.optionCardSelected : ""}`}
                                    onClick={() => setSelectedOption(opt.onr!)}
                                >
                                    {/* Custom CSS Radio Button */}
                                    <input
                                        type="radio"
                                        id={`option-${opt.onr}`}
                                        name="survey-options"
                                        className={surveyStyles.customRadio}
                                        checked={selectedOption === opt.onr}
                                        onChange={() => setSelectedOption(opt.onr!)}
                                        onClick={(e) => e.stopPropagation()}
                                    />

                                    <div className="flex-grow-1">
                                        <label
                                            htmlFor={`option-${opt.onr}`}
                                            className={surveyStyles.optionLabel}
                                        >
                                            {opt.titel}
                                        </label>

                                        <div className={`small ${surveyStyles.optionDetails}`}>
                                            {opt.details}
                                        </div>

                                        {opt.link && (
                                            <div className="small">
                                                <a
                                                    href={opt.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="custom-link" // global class if you have one, or add to module
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    weitere Infos
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            className={`w-100 ${surveyStyles.submitBtn}`}
                            size="lg"
                            onClick={handleSubmit}
                            disabled={!selectedOption || submitting}
                        >
                            {submitting ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>
                                    Wird gesendet...
                                </>
                            ) : (
                                "Abstimmen"
                            )}
                        </Button>
                    </form>
                )}
            </Card.Body>
        </Card>
    );
}
