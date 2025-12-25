import { useEffect, useState } from "react";
import { Card, Button, Alert, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import surveyStyles from "./Survey.module.css";
import {formatDateInOverviewArchive} from "../../utils/formatDateInOverviewArchive.ts";
import {UmfrageDTO} from "../../types/UmfrageDTO.ts";
import {StimmabgabeDTO} from "../../types/StimmabgabeDTO.ts";

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

        const now = new Date(); // Current date and time
        const endDate = new Date(umfrage.endDatum); // Create date from endDatum

        // Set end date to the end of the day
        endDate.setHours(23, 59, 59, 999);

        // Compare current date and time with the modified end date and time
        return now <= endDate;
    };

    const handleSubmit = () => {
        if (!selectedOption || !umfrage) return;
        setSubmitting(true);
        const payload: StimmabgabeDTO = {
            onr: selectedOption,
            unr: umfrage.unr,
            datum: new Date().toISOString(),
            isSessionDuplicate: null,
            isUserDuplicate: null
        };

        axios.post<StimmabgabeDTO>("/api/survey/stimmabgaben", payload)
            .then(() => setSubmitSuccess(true))
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
        return (
            <Card className={`terminFilmDetails-card border-danger ${surveyStyles.cardCustom}`}>
                <Card.Body>
                    <Alert variant="danger" className="m-0">{error}</Alert>
                </Card.Body>
            </Card>
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
                        <h2 className="text-success">Vielen Dank!</h2>
                        <span>Dein Voting wurde erfolgreich übermittelt.</span>
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
