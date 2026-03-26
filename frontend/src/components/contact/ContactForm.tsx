import styles from './Forms.module.css';
import '../../App.css';

import React, {useState, FormEvent, ChangeEvent, useEffect} from 'react';
import axios from "axios";

import EventOhneProjektion from './EventOhneProjektion'
import EventMitProjektion from "./EventMitProjektion.tsx";
import AOBForm, { AOBFormData } from './AOBForm.tsx';
import KinomitarbeitForm, { KinomitarbeitFormData } from "./KinomitarbeitForm.tsx";
import {EigenstaendigFormData} from "./EigenstaendigForm.tsx";
import {MitKinotechnikFormData} from "./MitKinotechnikForm.tsx";
import {KooperationFormData} from "./KooperationForm.tsx";
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";

// type for object, which combines status and message information (comparable to formData that contains all form fields)
interface SubmissionStatusWithMessageType {
    status: 'idle' | 'sending' | 'success' | 'error';
    message?: string;
}

interface IssueConfig {
    value: string;
    label: string;
}

const issueSelectOptions: IssueConfig[] = [
    { value: 'aob', label: 'Allgemeine Anfrage' },
    { value: 'eventOhneProjektion', label: 'Veranstaltung im Festsaal ohne Projektion' },
    { value: 'eventMitProjektion', label: 'Veranstaltung im Festsaal mit Projektion' },
    { value: 'kinomitarbeit', label: 'ehrenamtliche Kinomitarbeit' },
    { value: 'email', label: 'E-Mail als Kontaktoption (bei sonstigen Anliegen)' },
];

const ContactForm: React.FC = () => {
    // selectedIssueSelection here manages only the 4 options aob, kinomitarbeit, eventOhneProjektion and eventMitProjektion (see issueSelectOptions interface)
    const [selectedIssueSelection, setSelectedIssueSelection] = useState<string>('');

    // formData management only for AOBForm and KinomitarbeitForm; for the subforms c.f. EventMitProjektion and the subFormData management there
    //      Partial<T> transforms every required field into an optional one
    //      now {} (initial state val) is perfectly valid — it's an object where all fields happen to be absent, which is allowed when every field is optional. TypeScript is satisfied
    //      Partial<> doesn't change your runtime behaviour at all — my forms already handle missing values defensively with value={formData.betreff || ''}.
    //      Partial<> simply makes the TypeScript type match the runtime reality: the form data object starts empty and gets populated field by field as the user types:
    //          -- Runtime vs. TypeScript — two separate worlds --
    //          TypeScript is a compile-time tool only. It checks your code for type correctness, then gets completely stripped away before the code runs in the browser. JavaScript doesn't know what Partial<>, string, or interface even means — those concepts simply don't exist at runtime.
    //          So Partial<> is purely a signal to TypeScript saying "trust me, some fields may be missing". It has zero effect on what actually executes.
    //          What actually runs in the browser: At runtime, your form data is just a plain JavaScript object. It starts as {} and grows as the user types:
    //              {}                                          ← after mount
    //              { betreff: 'Hallo' }                        ← after typing in Betreff
    //              { betreff: 'Hallo', email: 'a@b.com' }      ← after typing email
    //              { betreff: 'Hallo', email: 'a@b.com', nachricht: 'Test', ... } ← ready to submit
    //          JavaScript has no problem with any of this. An object with missing keys is just a normal object — accessing a missing key simply returns undefined.
    const [formData, setFormData] = useState<Partial<AOBFormData> | Partial<KinomitarbeitFormData>>({});

    const [submissionStatusWithMessage, setSubmissionStatusWithMessage] = useState<SubmissionStatusWithMessageType>({ status: 'idle' });

    // captchaToken is a state variable that stores the response token from the Google reCAPTCHA widget after the user completes the CAPTCHA challenge
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    // Reset state after a successful submission, but keep the success message
    useEffect(() => {
        if (submissionStatusWithMessage.status === 'success') {
            setSelectedIssueSelection('');
            setFormData({});
            // Optionally reset status after a timeout if you want to hide the message after a while:
            setTimeout(() => setSubmissionStatusWithMessage({ status: 'idle', message: undefined }), 10000); // i.e. 10 seconds
        }
    }, [submissionStatusWithMessage.status]);

    const handleIssueSelectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        // Update the selected form type, which triggers renderForm() to mount the new sub-form
        setSelectedIssueSelection(event.target.value);
        // Discard any previously entered field values — they belong to the old form type
        setFormData({});
        // Reset any lingering submission state (e.g. CAPTCHA error, network error) from a previous attempt, so the newly selected form renders clean without a stale message
        setSubmissionStatusWithMessage({ status: 'idle' });
    };

    // Resets submission state of sub forms — i.e. called by child components when their internal sub-selection changes, so stale error messages don't bleed over
    const handleResetSubmissionStatus = () => {
        setSubmissionStatusWithMessage({ status: 'idle' });
    };

    // this is the "standard" handler for changes in input fields for text and numbers
    // const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = event.target;
    //     setFormData((prevData) => ({
    //             ...prevData,
    //             [name]: value,
    //         })
    //     );
    // };

    const handleChangeWithCheckbox = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === "checkbox";

        // setFormData((prevData) => ({
        //     ...prevData,
        //     [name]: isCheckbox ? (e as ChangeEvent<HTMLInputElement>).target.checked : value,
        // }));

        const newData = {
            ...formData,
            [name]: isCheckbox ? (e as ChangeEvent<HTMLInputElement>).target.checked : value,
        };
        setFormData(newData);

        // ### Save Form Data to storage ###
        sessionStorage.setItem(`${selectedIssueSelection}FormData`, JSON.stringify(newData));
    };

    const handleGlobalSubmit = async (
        event: FormEvent,
        explicitIssue?: string, // optional parameter
        explicitData?: AOBFormData | KinomitarbeitFormData | EigenstaendigFormData | MitKinotechnikFormData | KooperationFormData // optional parameter
    ) => {
        event.preventDefault(); // maybe remove this because in the (grand) child's handleLocalSubmit event.preventDefault() is already called

        if (!captchaToken) {
            // alert("Please complete the CAPTCHA");
            setSubmissionStatusWithMessage({
                status: 'error',
                message: "Bitte vervollständige das CAPTCHA (Sicherheitsüberprüfung) mit einem Klick auf 'Ich bin kein Roboter'."
            });
            return;
        }

        setSubmissionStatusWithMessage({ status: 'sending' });

        // Use explicit parameters if provided, otherwise use state values
        const issueToUse = explicitIssue || selectedIssueSelection;
        const dataToUse = explicitData || formData;

        try {
            await axios.post(`/api/contact/${issueToUse}`, {
                ...dataToUse,
                captcha: captchaToken,
            });

            // Axios automatically throws on errors, so if we reach here, it's success
            setSubmissionStatusWithMessage({
                status: 'success',
                message: `Vielen Dank! Die Nachricht wurde gesendet. &#x2705;
                        <br/>
                        Eine Kopie wurde an deine angegebene Mail-Adresse ${dataToUse.email} geschickt.`
            });

            // reset form and CAPTCHA after a successful submission
            setFormData({});
            setCaptchaToken(null);

            // ### Clear Form Data on Successful Submit ###
            sessionStorage.removeItem(`${issueToUse}FormData`);

        } catch (error) {
            console.error('Error sending message:', error);

            // Check if it's an Axios error with response
            if (axios.isAxiosError(error) && error.response) {
                // Server responded with error status (4xx, 5xx)
                const errorMessage = error.response.data?.message || 'Something went wrong. Please send a message to info@pupille.org';
                setSubmissionStatusWithMessage({
                    status: 'error',
                    message: errorMessage
                });
            } else {
                // Network error or request failed
                setSubmissionStatusWithMessage({
                    status: 'error',
                    message: 'Netzwerkfehler :( Bitte sende deine Nachricht an info@pupille.org'
                });
            }
        }
    };

    const renderForm = () => {
        switch (selectedIssueSelection) {
            case 'aob':
                return (
                    <AOBForm
                        onSubmit={handleGlobalSubmit}
                        submissionStatusWithMessage={submissionStatusWithMessage}
                        onInputChange={handleChangeWithCheckbox}
                        formData={formData as AOBFormData}

                        onSetCaptchaToken={setCaptchaToken}
                    />
                );
            case 'kinomitarbeit':
                return (
                    <KinomitarbeitForm
                        onSubmit={handleGlobalSubmit}
                        submissionStatusWithMessage={submissionStatusWithMessage}
                        onInputChange={handleChangeWithCheckbox}
                        formData={formData as KinomitarbeitFormData}

                        onSetCaptchaToken={setCaptchaToken}
                    />
                );
            case 'eventMitProjektion':
                return (
                    <EventMitProjektion
                        onSubmit={handleGlobalSubmit} // The callback will now receive the issue from the subselection
                        submissionStatusWithMessage={submissionStatusWithMessage}
                        onResetSubmissionStatus={handleResetSubmissionStatus}

                        onSetCaptchaToken={setCaptchaToken}
                    />
                );
            case 'eventOhneProjektion':
                return (
                    <EventOhneProjektion/>
                );
            case 'email':
                return (
                    <a
                        href="mailto:info@pupille.org?subject=%5BE-Mail%20Anfrage%5D%3A%20...&body=%5BBitte%20keine%20Werbeinhalte%20hier.%20&#x1F647;%5D"
                        // href="mailto:info@pupille.org?subject=%5BE-Mail%20Anfrage%5D%3A%20..."
                        className="hidden-link"
                    >
                        E-Mail-Adresse anzeigen
                    </a>
                );
            default:
                return null;
        }
    };

    // ### Load Form Data from storage ###
    useEffect(() => {
        if (selectedIssueSelection) {
            const savedData = sessionStorage.getItem(`${selectedIssueSelection}FormData`);
            if (savedData) {
                setFormData(JSON.parse(savedData)); // ← restores the previously typed values
            }
        }
    }, [selectedIssueSelection]);

    return (
        <div className={styles.contactFormWrapper}>
            <h2 className={styles.sectionTitle}>Kontakt</h2>

            <h3 className={styles.subsectionTitle}>fernmündlich</h3>
            <p className={styles.formDescription}>I.d.R. nur taggleich vor und nach den Spielterminen erreichbar.</p>
            <p className={styles.formDescription}>Telefon: 069 7982 8976</p>

            <h3 className={styles.subsectionTitle}>schriftlich</h3>

            {/* Only show success message if submission was successful */}
            {/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/}
            {submissionStatusWithMessage.status === 'success' && (
                                                   // role-Attribut: Teil von WAI-ARIA (Accessible Rich Internet Applications); wird verwendet, um semantische Informationen über ein Element hinzuzufügen
                <div className={styles.statusSuccess} role="status">
                    {renderHtmlText(submissionStatusWithMessage.message)}
                </div>
            )}

            {/* Only show main selection + form if submission is everything else but 'success' */}
            {/* I.e. the whole selection + sub-form is conditionally hidden on success */}
            {/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/}
            {submissionStatusWithMessage.status !== 'success' && (
                <>
                    <div className={styles.emojiList}>
                        <div className={styles.emojiListItem}>
                            <span className={styles.emoji}>&#128337;</span>
                            <span className={styles.emojiText}>
                                Da das gesamte Kinoteam ehrenamtlich arbeitet, kann die Beantwortung etwas Zeit in Anspruch nehmen – wir bitten um Verständnis und etwas Geduld.
                            </span>
                        </div>

                        <div className={styles.emojiListItem}>
                            <span className={styles.emoji}>&#128640;</span>
                            <span className={styles.emojiText}>
                                Für eine schnellere und strukturierte Bearbeitung von Anfragen bitten wir, die Kontaktformulare zu verwenden und <strong>keine</strong> E-Mail zu schreiben.
                            </span>
                        </div>

                        <div className={styles.emojiListItem}>
                            <span className={styles.emoji}>&#x1F4E7;</span>
                            <span className={styles.emojiText}>
                                Nach erfolgreicher Übermittlung der Formulareingaben erhältst du automatisch eine Kopie der Nachricht an deine angegebene Mail-Adresse.
                            </span>
                        </div>
                    </div>

                    <div className={styles.formField}>
                        <label htmlFor="issue" className={`${styles.formLabel} visually-hidden`}>
                            Anliegen auswählen
                        </label>
                        <select
                            id="issue"
                            value={selectedIssueSelection}
                            onChange={handleIssueSelectionChange}
                            className={styles.formSelect}
                        >
                            <option key="" value="" disabled>
                                Bitte Anliegen auswählen.
                            </option>
                            {issueSelectOptions.map((option) => (
                                <option key={option.value} value={option.value} className={styles.selectOption}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/*respective form is rendered here*/}
                    {/*--------------------------------*/}
                    {renderForm()}
                </>
            )}
            {/*Fehlermeldung*/}
            {submissionStatusWithMessage.status === 'error' && submissionStatusWithMessage.message && (
                <div className={styles.statusError + " ms-3 me-3"} role="alert">
                    {renderHtmlText(submissionStatusWithMessage.message)}
                </div>
            )}
        </div>
    );
};

export default ContactForm;