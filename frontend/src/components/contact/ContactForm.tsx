import styles from './Forms.module.css';

import React, {useState, FormEvent, ChangeEvent, useEffect} from 'react';
import AOBForm, { AOBFormData } from './AOBForm.tsx';

import EventOhneProjektion from './EventOhneProjektion'
import EventMitProjektion from "./EventMitProjektion.tsx";
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
    { value: 'kinomitarbeit', label: 'Kinomitarbeit' },
];

const ContactForm: React.FC = () => {
    // selectedIssueSelection here manages only the 4 options aob, kinomitarbeit, eventOhneProjektion and eventMitProjektion (see issueSelectOptions interface)
    const [selectedIssueSelection, setSelectedIssueSelection] = useState<string>('');

    // formData management only for AOBForm and KinomitarbeitForm; for the subforms c.f. EventMitProjektion and the subFormData management there
    const [formData, setFormData] = useState<AOBFormData | KinomitarbeitFormData>({});

    const [submissionStatusWithMessage, setSubmissionStatusWithMessage] = useState<SubmissionStatusWithMessageType>({ status: 'idle' });

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
        setSelectedIssueSelection(event.target.value);
        setFormData({});
    };

    // this is the "standard" handler for changes in input fields for text and numbers
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            })
        );
    };

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

        // ### Save Form Data to localStorage ###
        localStorage.setItem(`${selectedIssueSelection}FormData`, JSON.stringify(newData));
    };

    const handleGlobalSubmit = async (
        event: FormEvent,
        explicitIssue?: string, // optional parameter
        explicitData?: AOBFormData | KinomitarbeitFormData | EigenstaendigFormData | MitKinotechnikFormData | KooperationFormData // optional parameter
    ) => {
        event.preventDefault(); //maybe remove this because in the (grand) child's handleLocalSubmit event.preventDefault() is already called
        setSubmissionStatusWithMessage({ status: 'sending' });

        // Use explicit parameters if provided, otherwise use state values
        const issueToUse = explicitIssue || selectedIssueSelection;
        const dataToUse = explicitData || formData;

        try {
            const response = await fetch(`/api/contact/${issueToUse}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUse),
            });

            if (response.ok) {
                setSubmissionStatusWithMessage({
                    status: 'success',
                    message: `&#x2705; Vielen Dank! Die Nachricht wurde gesendet.
                            <br/>
                            Eine Kopie wurde an deine angegebene Mail-Adresse ${dataToUse.email} geschickt.`
                });

                setFormData({});

                // ### Clear Form Data on Successful Submit ###
                localStorage.removeItem(`${issueToUse}FormData`);
            } else {
                // use error message from response
                // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                const errorData = await response.json();
                setSubmissionStatusWithMessage({ status: 'error', message: errorData.message  || 'Something went wrong. Please send a message to info@pupille.org' });

                // use standard error message
                // ~~~~~~~~~~~~~~~~~~~~~~~~~~
                // setSubmissionStatusWithMessage({ status: 'error', message: 'Serverfehler: Etwas lief schief :( Bitte sende deine Nachricht an info@pupille.org' });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setSubmissionStatusWithMessage({ status: 'error', message: 'Netzwerkfehler :( Bitte sende deine Nachricht an info@pupille.org' });
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
                    />
                );
            case 'kinomitarbeit':
                return (
                    <KinomitarbeitForm
                        onSubmit={handleGlobalSubmit}
                        submissionStatusWithMessage={submissionStatusWithMessage}
                        onInputChange={handleChangeWithCheckbox}
                        formData={formData as KinomitarbeitFormData}
                    />
                );
            case 'eventMitProjektion':
                return (
                    <EventMitProjektion
                        onSubmit={handleGlobalSubmit} // The callback will now receive the issue from the subselection
                        submissionStatusWithMessage={submissionStatusWithMessage}
                    />
                );
            case 'eventOhneProjektion':
                return (
                    <EventOhneProjektion/>
                );
            default:
                return null;
        }
    };

    // ### Load Form Data from localStorage ###
    useEffect(() => {
        if (selectedIssueSelection) {
            const savedData = localStorage.getItem(`${selectedIssueSelection}FormData`);
            if (savedData) {
                setFormData(JSON.parse(savedData));
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

            {/* Only show main selection+form if submission is everything else but 'success' */}
            {/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/}
            {submissionStatusWithMessage.status !== 'success' && (
                <>
                    <p className={styles.formDescription}>
                        Für eine schnelle und strukturierte Bearbeitung von Anfragen bitten wir darum, stets das nachfolgende Kontaktformular zu verwenden.
                    </p>
                    <p className={styles.formDescription}>
                        Da das gesamte Kinoteam ehrenamtlich arbeitet, kann die Beantwortung etwas Zeit in Anspruch nehmen – wir bitten um Verständnis und etwas Geduld.
                    </p>

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
                    {renderForm()}
                </>
            )}
            {/*Fehlermeldung*/}
            {submissionStatusWithMessage.status === 'error' && submissionStatusWithMessage.message && (
                <div className={styles.statusError} role="alert">
                    {renderHtmlText(submissionStatusWithMessage.message)}
                </div>
            )}

        </div>
    );
};

export default ContactForm;
