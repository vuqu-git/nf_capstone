import { useEffect, useState } from "react";
import { Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./Survey.module.css";

// --- Interfaces ---
export interface AuswahloptionNestedDTO {
    onr?: number;
    titel: string;
    details: string;
    link: string;
}

export interface UmfrageDTO {
    unr: number;
    anlass: string;
    endDatum: string | null;
    beschreibung: string;
    auswahloptionendtos: AuswahloptionNestedDTO[];
}

export interface StimmabgabeDTO {
    snr?: number;
    datum: string | null;
    isSessionDuplicate: boolean | null;
    isUserDuplicate: boolean | null;
    onr: number;
    unr: number;
}

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
        const today = new Date();
        const endDate = new Date(umfrage.endDatum);
        today.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return today <= endDate;
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

    // Helper: Format Date like 'Mo 15.12.2025'
    const formatDate = (isoString: string | null) => {
        if (!isoString) return "";
        const d = new Date(isoString);
        return d.toLocaleDateString("de-DE", {
            weekday: 'short',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }) + " Uhr"; // Adding dummy time or remove if date only
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
            <Card className={`terminFilmDetails-card border-danger ${styles.cardCustom}`}>
                <Card.Body>
                    <Alert variant="danger" className="m-0">{error}</Alert>
                </Card.Body>
            </Card>
        );
    }

    if (!umfrage) return null;

    return (
        <Card className={`terminFilmDetails-card ${styles.cardCustom}`}>
            <Card.Body>

                {/*/!* 2. Divider Line *!/*/}
                {/*<hr className={styles.divider} />*/}

                {/* 3. Main Title (Anlass) */}
                <Card.Title as="h2" className={styles.umfrageAnlass}>
                    {umfrage.anlass}
                </Card.Title>

                {/* 4. Description */}
                <div className={styles.umfrageDescription}>
                    <p>{umfrage.beschreibung}</p>

                    <p>Die Abstimmung läuft bis inklusive {umfrage.endDatum}.</p>
                </div>



                {/* 5. Logic: Active / Success / Form */}
                {!isSurveyActive() ? (
                    <Alert variant="secondary" className="bg-dark text-secondary border-secondary">
                        <h5 className="text-warning">Umfrage beendet</h5>
                        <p>Der Abstimmungszeitraum ist leider abgelaufen.</p>
                    </Alert>
                ) : submitSuccess ? (
                    <div className="text-center py-4 border border-warning">
                        <h2 className="text-success mb-3">Vielen Dank!</h2>
                        <p>Deine Stimmabgabe wurde erfolgreich übermittelt.</p>
                    </div>
                ) : (
                    <Form>
                        <div className="d-flex flex-column gap-3 mb-4">
                            {umfrage.auswahloptionendtos.map((opt) => (
                                <div
                                    key={opt.onr}
                                    className={`d-flex align-items-start gap-3 p-3 rounded ${styles.optionCard} ${selectedOption === opt.onr ? styles.optionCardSelected : ""}`}
                                    onClick={() => setSelectedOption(opt.onr!)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <Form.Check
                                        type="radio"
                                        id={`option-${opt.onr}`}
                                        name="survey-options"
                                        className={styles.radioInput}
                                        checked={selectedOption === opt.onr}
                                        onChange={() => setSelectedOption(opt.onr!)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="flex-grow-1">
                                        <label
                                            htmlFor={`option-${opt.onr}`}
                                            className={styles.optionLabel}
                                        >
                                            {opt.titel}
                                        </label>

                                        <div className={`small ${styles.optionDetails}`}>
                                            {opt.details}
                                        </div>

                                        {opt.link && (
                                            <div className="small">
                                                <a
                                                    href={opt.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={"custom-link"}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    weitere Infos &rarr;
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            className={`w-100 fw-bold ${styles.submitBtn}`}
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
                    </Form>
                )}
            </Card.Body>
        </Card>
    );
}
