import { useEffect, useState } from "react";
import { Card, Button, Alert, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import surveyStyles from "./Survey.module.css";
import {formatDateInOverviewArchive} from "../../utils/formatDateInOverviewArchive.ts";
import {UmfrageDTO} from "../../types/UmfrageDTO.ts";
import {StimmabgabeDTO} from "../../types/StimmabgabeDTO.ts";
import NotFound from "../NotFound.tsx";
import {renderHtmlContent} from "../../utils/renderHtmlContent.tsx";

export default function SurveyCard() {
    const { unr } = useParams<{ unr: string }>();

    const [umfrage, setUmfrage] = useState<UmfrageDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [errorCode, setErrorCode] = useState<number | null>(null);

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
                setErrorCode(null);
            })
            .catch((err) => {
                // console.error(err);

                if (axios.isAxiosError(err)) {
                    if (err.response) {
                        // --- Server responded with 4xx or 5xx ---
                        setErrorCode(err.response.status);

                        // Optional: Set specific text based on status here if you use {error} in JSX
                        switch (err.response.status) {
                            // case 400: setError("Invalid ID format (e.g. text)"); break;  // redundant because of Case 1 in "Fatal Errors (GET Request Failed) below"
                            // case 404: setError("Umfrage nicht gefunden."); break;        // redundant because of Case 1 in "Fatal Errors (GET Request Failed) below"
                            case 500: setError("Serverfehler."); break;
                            default: setError(`Fehler: ${err.response.status}`);
                        }
                    } else if (err.request) {
                        // --- Network error ---
                        setErrorCode(0);
                        setError("Netzwerkfehler: Keine Antwort vom Server.");
                    }
                }

            })
            .finally(() => setLoading(false));
    }, [unr]);

    const isSurveyActive = (): boolean => {
        if (!umfrage || !umfrage.endDatum) return true;

        const now = new Date(); // time comes directly from the user's operating system (their device)

        // 1. Parse the string manually to avoid UTC conversion issues; format expected: "YYYY-MM-DD"
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

    const isSurveyArchived = (): boolean => {
        if (!umfrage || !umfrage.endDatum) return false;

        const now = new Date(); // time comes directly from the user's operating system (their device)
        const [year, month, day] = umfrage.endDatum.split('-').map(Number);

        const deadline = new Date(year, month - 1, day);
        deadline.setHours(23, 59, 59, 999);

        // Calculate difference in milliseconds
        const diffTime = now.getTime() - deadline.getTime();

        // Convert to days
        const diffDays = diffTime / (1000 * 3600 * 24);

        return diffDays >= 10;
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

            datum: null, // i.e. let backend set the timestamp (in StimmabgabeService's createStimmabgabe method)
            // datum: new Date().toISOString(), // The method toISOString() always returns the time in UTC (Coordinated Universal Time), also known as "Zulu time" (indicated by the Z at the end of the string). In the spring backend the field type is Instant.

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
                // console.error(err);

                // Default fallback message
                let errorMessage = "Fehler beim Speichern der Stimme.";

                if (axios.isAxiosError(err)) {
                    if (err.response) {
                        // --- Server Error (4xx, 5xx) ---
                        setErrorCode(err.response.status);

                        // 1. Try to get the specific message from Backend (CustomErrorMessage)
                        // The backend returns: { message: "Umfrage ist bereits beendet", time: ... }
                        const backendMessage = err.response.data?.message;

                        if (backendMessage) {
                            errorMessage = backendMessage;
                        } else {
                            // 2. Fallback based on status code if no message provided
                            //  The fallback is necessary because backendMessage might be missing or empty.
                            //  The "Safety Net" (Backend Message missing):
                            //      If something else triggers a 400 error (e.g., Spring validation fails, malformed JSON, or a different exception you forgot to map in GlobalExceptionHandler), err.response.data.message might be undefined or weird.
                            //      In that case, the code falls into the else. The text "Ungültige Anfrage (z.B. Umfrage abgelaufen)" is just a generic hint to the user about what might have gone wrong when we don't know the exact reason.
                            switch (err.response.status) {
                                case 400: errorMessage = "Ungültige Anfrage (z.B. Umfrage abgelaufen oder Dateninkonsistenz)."; break;
                                case 404: errorMessage = "Umfrage oder Option nicht vorhanden."; break;
                                case 500: errorMessage = "Serverfehler beim Speichern."; break;
                            }
                        }
                    } else if (err.request) {
                        // --- Network Error ---
                        setErrorCode(0);
                        errorMessage = "Netzwerkfehler: Keine Verbindung zum Server.";
                    }
                }
                setError(errorMessage);
            })
            .finally(() => setSubmitting(false));
    };

    // display umfrage loading spinner
    if (loading) {
        return (
            <div className="d-flex justify-content-center p-5">
                <Spinner animation="border" variant="warning" role="status">
                    <span className="visually-hidden">Lade Umfrage...</span>
                </Spinner>
            </div>
        );
    }

    // Handling fatal errors from failed GET request
    // only block rendering if we have no survey data (i.e. umfrage is null) yet AND an error.
    if (!umfrage && (error || errorCode !== null)) { // "If we have NO survey data (!umfrage) AND we have an error..."
                                                     // Errors from the POST request (voting) happen after umfrage is loaded (so !umfrage is false). Those errors bypass this block and are handled by the inline Alert inside the main return block.
        // CASE 1: 404 Not Found -> Render specific NotFound component
        if (errorCode === 404 || errorCode === 400) {
        // if (errorCode === 404) { // only for test purposes
            return <NotFound />;
        }

        // CASE 2: Network Error (0) or Server Error (500) -> Render Card with Alert
        return (
            <div>
                <Alert variant="danger" className="m-0">
                    {errorCode} - {errorCode === 0
                    ? "Netzwerkfehler: Server nicht erreichbar."
                    : errorCode === 500
                        ? "Interner Serverfehler. Bitte später erneut versuchen."
                        : error /* Fallback to the string state */}
                </Alert>

                {/* You could add a "Retry" button here for 500/Network errors */}
                {(errorCode === 0 || errorCode === 500) && (
                    <Button
                        variant="outline-danger"
                        className="mt-3 w-100"
                        onClick={() => window.location.reload()}
                    >
                        Seite neu laden
                    </Button>
                )}
            </div>
        );

    }

    // If we are here, loading is false, and we haven't returned a fatal error.
    // However, umfrage could still be null if we are in a weird intermediate state.
    if (!umfrage) return null;

    // check if survey is expired by more (>=) than 10 days
    if (!isSurveyActive() && isSurveyArchived()) {
        return <NotFound />;
    }

    return (
        <Card className={`terminFilmDetails-card pupille-glow`}>
            <Card.Body>

                {/* Main Title (Anlass) */}
                <Card.Title as="h2" className={surveyStyles.umfrageAnlass}>
                    {umfrage.anlass}
                </Card.Title>

                {/* Description */}
                <div className={surveyStyles.umfrageDescription}>
                    {/*<p>{umfrage.beschreibung}</p>*/}
                    {renderHtmlContent(umfrage.beschreibung)}
                    <p className="mt-2">Ende der Umfrage: {formatDateInOverviewArchive(umfrage.endDatum ?? undefined)}, 23:59:59 Uhr.</p>
                </div>

                {/* Logic: Active / Success / Form */}
                {!isSurveyActive() ? (
                    // -- Case: survey expired (Frontend detected)
                    <Alert className="bg-dark text-danger border-secondary">
                        <span>Die Umfrage ist leider bereits beendet.</span>
                    </Alert>
                ) : submitSuccess ? (
                    // -- Case: voting submitted successful
                    <div className="text-center py-3 border border-warning">
                        <div className="text-success fs-4 fw-bold">Vielen Dank!</div>
                        <span className={surveyStyles.umfrageDescription}>Dein Voting wurde erfolgreich übermittelt.</span>
                    </div>
                ) : (
                    // -- Case: show survey options for submission
                    <form onSubmit={(e) => e.preventDefault()}>

                        {/* --- POST error alert --- */}
                        {/* Alert appears in a situation where your Frontend thinks the survey is open, but your Backend knows it is closed (or failed for another reason)*/}
                        {/*Here is the step-by-step "Race Condition" scenario:*/}
                        {/*The Scenario: The "Slow" User or Clock Mismatch*/}

                        {/*Imagine the survey ends exactly at 12:00:00.*/}
                        {/*    11:59:00 (Page Load):*/}
                        {/*    The user opens the page. Your frontend function isSurveyActive() checks the time. It is before 12:00.*/}
                        {/*        Result: The "Active Form" renders. The user sees the radio buttons.*/}

                        {/*    12:00:05 (The Delay):*/}
                        {/*    The user takes a minute to read the options. It is now past the deadline.*/}
                        {/*        Note: The page does not automatically refresh or hide the form just because time passed. It sits there waiting.*/}

                        {/*    12:00:10 (The Click):*/}
                        {/*    The user clicks "Abstimmen".*/}
                        {/*        Your Frontend sends the POST request.*/}

                        {/*    The Server Check:*/}
                        {/*    The request hits your Java Backend. Your backend checks Instant.now(). It sees it is 12:00:10.*/}
                        {/*        Result: The Backend rejects it. It throws UmfrageExpiredException (Status 400).*/}

                        {/*    The Response:*/}
                        {/*    Your frontend receives the 400 error with the message "Umfrage ist bereits beendet."*/}
                        {/*    You call setError("Umfrage ist bereits beendet.").*/}
                        {/*    You call setErrorCode(400).*/}

                        {/*    The Re-Render (The Critical Moment):*/}
                        {/*    React re-renders the component.*/}
                        {/*        It runs isSurveyActive() again.*/}
                        {/*        Case A (Clock synced): isSurveyActive() sees it's 12:00:10. It returns false. The entire form disappears and is replaced by the standard "Bereits beendet" alert.*/}

                        {/*        Case B (Clock Mismatch - The Race Condition):*/}
                        {/*        Suppose the User's PC clock is slightly slow or was changed by the user (e.g., reads 11:59:50; tiem from new Date() comes directly from the user's operating system). isSurveyActive() still returns true.*/}
                        {/*        The form stays visible.*/}
                        {/*        BUT now error is not null.*/}
                        {/*        Therefore: The red Alert appears inside the form saying "Umfrage ist bereits beendet."*/}

                        {/*==> THIS IS WHAT RENDERS in the "The Critical Moment" mentioned a few lines above because the code from way above if (!umfrage && (error || errorCode !== null)) is false since the umfrage is loaded/present*/}
                        {/*here: Handling fatal errors from failed POST request*/}
                        {(error || errorCode) && (
                            <Alert className="bg-dark text-danger border-secondary mb-3">
                                {error}
                            </Alert>
                        )}
                        {/*                            This ensures the form is disabled only for client-side/logic errors (4xx) incl. Umfrage expired woth code 400, but remains active for server/network errors (so the user can retry).*/}
                        <fieldset disabled={submitting || (errorCode !== null && errorCode >= 400 && errorCode < 500)}>
                            <div className="d-flex flex-column gap-3 mb-4">
                                {umfrage.auswahloptionendtos.map((opt) => (
                                    <div
                                        key={opt.onr}
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
                        </fieldset>
                    </form>
                )}
            </Card.Body>
        </Card>
    );
}
