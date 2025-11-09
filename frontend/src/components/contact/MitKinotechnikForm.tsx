import React, {ChangeEvent, FormEvent, useState} from 'react';
import styles from './Forms.module.css';
import {useDateRangeValidation} from "../../hooks/useDateRangeValidation.ts";
import DatenschutzCheck from "../other/DatenschutzCheck.tsx";
import ReCAPTCHA from "react-google-recaptcha";

// caller of this component: EventMitProjektion.tsx

export interface MitKinotechnikFormData {
    betreff: string;
    ansprechperson: string;
    email: string;
    telefon: string;

    veranstaltungsbeginn: string; // Will hold ISO 8601 date and time
    veranstaltungsende: string;   // Will hold ISO 8601 date and time
    istGemietetBeiAsta: boolean;
    wurdeGelesenHinweisEventlocation: boolean;

    nachricht: string;

    projektionsinhalt: string;
    verleih: string;
    format: 'DCP' | 'Blu-ray' | 'DVD' | 'Datei auf PC' | '35mm' | '16mm' | 'noch unbekannt';
    anzMikrofone: number;

    istEinverstandenMitDatennutzung: boolean
}

interface MitKinotechnikFormProps {
    onSubFormSubmit: (event: FormEvent, data: MitKinotechnikFormData) => void;
    submissionStatusWithMessage: {
        status: 'idle' | 'sending' | 'success' | 'error';
        nachricht?: string
    };
    onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    formData: MitKinotechnikFormData;
    onSetCaptchaToken: (value: string | null) => void;
}

const MitKinotechnikForm: React.FC<MitKinotechnikFormProps> = ({ onSubFormSubmit, submissionStatusWithMessage, onInputChange, formData, onSetCaptchaToken }) => {

    const maxMessageLength = 1500;

    const [errorMissingConfirmationMessage, setErrorMissingConfirmationMessage] = useState<string | null>(null);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = event.target;
        onInputChange(event); // Call the original onInputChange prop

        if (target.type === 'checkbox') {
            const checkboxTarget = target as HTMLInputElement; // Explicitly cast to HTMLInputElement
            const { name, checked } = checkboxTarget;
            const isAstaChecked = name === 'istGemietetBeiAsta' ? checked : formData.istGemietetBeiAsta;
            const isLocationHintChecked = name === 'wurdeGelesenHinweisEventlocation' ? checked : formData.wurdeGelesenHinweisEventlocation;

            if (isAstaChecked && isLocationHintChecked) {
                setErrorMissingConfirmationMessage(null); // Clear the error message
            }
        }
    };

    const handleLocalSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (formData.istGemietetBeiAsta && formData.wurdeGelesenHinweisEventlocation) {
            onSubFormSubmit(event, formData);
            setErrorMissingConfirmationMessage(null); // Clear any previous error message
        } else {
            setErrorMissingConfirmationMessage('Bitte bestätige beide Punkte, um die Anfrage zu senden.');
        }
    };

    const dateRangeErrorMessage = useDateRangeValidation(
        formData.veranstaltungsbeginn,
        formData.veranstaltungsende
    );

    return (
        <form className={styles.formContainer} onSubmit={handleLocalSubmit}>
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="betreff">Betreff *</label>
                <input
                    type="text"
                    id="betreff"
                    name="betreff"
                    value={formData.betreff || ''}
                    maxLength={100}
                    onChange={onInputChange}
                    required
                    className={styles.textInput}
                />
            </div>
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="ansprechperson">Ansprechperson *</label>
                <input
                    type="text"
                    id="ansprechperson"
                    name="ansprechperson"
                    value={formData.ansprechperson || ''}
                    maxLength={50}
                    onChange={onInputChange}
                    required
                    className={styles.textInput}
                />
            </div>
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="email">E-Mail-Adresse *</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    maxLength={254} // RFC 5322 Standard
                    onChange={onInputChange}
                    required
                    className={styles.emailInput}
                />
            </div>
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="telefon">Telefonnummer </label>
                <input
                    type="tel"
                    id="telefon"
                    name="telefon"
                    value={formData.telefon || ''}
                    maxLength={20}
                    onChange={onInputChange}
                    className={styles.telInput}
                />
            </div>

            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="nachricht">Nachricht *</label>
                <textarea
                    id="nachricht"
                    name="nachricht"
                    value={formData.nachricht || ''}
                    maxLength={maxMessageLength}
                    onChange={onInputChange}
                    required
                    className={styles.textareaField}
                    style={{ height: '175px' }}
                    aria-describedby="nachricht-counter"
                />
                <div id="nachricht-counter" className={styles.characterCounter}>
                    Zeichen: {formData?.nachricht?.length || 0}/{maxMessageLength}
                </div>
            </div>

            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="projektionsinhalt">Projektionsinhalt (bspw. Filmtitel) *</label>
                <input
                    type="text"
                    id="projektionsinhalt"
                    name="projektionsinhalt"
                    value={formData.projektionsinhalt || ''}
                    maxLength={150}
                    onChange={onInputChange}
                    required
                    className={styles.textInput}
                />
            </div>

            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="verleih">Verleiher/Rechteinhaber (bei öffentlicher Filmvorführung)</label>
                <input
                    type="text"
                    id="verleih"
                    name="verleih"
                    value={formData.verleih || ''}
                    maxLength={100}
                    onChange={onInputChange}
                    className={styles.textInput}
                />
            </div>

            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="format">Abspielformat *</label>
                <select
                    id="format"
                    name="format"
                    value={formData.format || ''}
                    onChange={onInputChange}
                    required
                    className={styles.formSelect}
                >
                    <option value="" disabled className={styles.selectOption}>Bitte auswählen</option>
                    <option value="DCP" className={styles.selectOption}>DCP</option>
                    <option value="Blu-ray" className={styles.selectOption}>Blu-ray</option>
                    <option value="DVD" className={styles.selectOption}>DVD</option>
                    <option value="Datei auf PC" className={styles.selectOption}>Datei auf PC</option>
                    <option value="35mm" className={styles.selectOption}>35mm</option>
                    <option value="16mm" className={styles.selectOption}>16mm</option>
                    <option value="noch unbekannt" className={styles.selectOption}>noch unbekannt</option>
                </select>
            </div>

            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="anzMikrofone">Anzahl benötigter Mikrofone</label>
                <input
                    type="number"
                    id="anzMikrofone"
                    name="anzMikrofone"
                    value={formData.anzMikrofone !== undefined ? formData.anzMikrofone : 0}
                    onChange={onInputChange}
                    min={0}
                    max={2}
                    className={styles.numberInput}
                />
            </div>

            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="veranstaltungsbeginn">Veranstaltungsbeginn (Datum & Uhrzeit) *</label>
                <input
                    type="datetime-local"
                    id="veranstaltungsbeginn"
                    name="veranstaltungsbeginn"
                    value={formData.veranstaltungsbeginn || ''}
                    onChange={onInputChange}
                    required
                    className={styles.datetimeInput}
                    aria-describedby="date-range-error"
                />
            </div>

            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="veranstaltungsende">Veranstaltungsende (Datum & Uhrzeit) *</label>
                <input
                    type="datetime-local"
                    id="veranstaltungsende"
                    name="veranstaltungsende"
                    value={formData.veranstaltungsende || ''}
                    onChange={onInputChange}
                    required
                    className={styles.datetimeInput}
                    aria-describedby="date-range-error"
                />

                {/*<div className="loadingSpacer"> /!* this css class approach does NOT work somehow compared to inline style*!/*/}
                <div style={{ minHeight: '1.5em' }}>
                    {dateRangeErrorMessage && <p role="alert" id="date-range-error" className={styles.statusError + " m-0"}>{dateRangeErrorMessage}</p>}
                </div>
            </div>

            <div className={styles.textUnderTextField}>
                Weitere alternative Veranstaltungszeiträume (mit Angabe von Datum und Uhrzeit) können im obigen Nachrichtenfeld genannt werden.
            </div>

            {/*<div className={`${styles.formFieldCheckbox} mt-3`}>*/}
            <div className={styles.formFieldCheckbox + " mt-3"}>
                <input
                    type="checkbox"
                    id="istGemietetBeiAsta"
                    name="istGemietetBeiAsta"
                    checked={formData.istGemietetBeiAsta || false}
                    onChange={handleInputChange}
                    className={styles.checkboxInput}
                    required
                />
                <label
                    htmlFor="istGemietetBeiAsta"
                    className={errorMissingConfirmationMessage && !formData.istGemietetBeiAsta ? styles.errorRedLabel : ''}
                    role="alert"
                >
                    Ich bestätige, dass der Festsaal beim AStA für den oben genannten Veranstaltungszeitraum bereits von mir reserviert bzw. gemietet wurde.
                </label>
            </div>

            <div className={styles.formFieldCheckbox}>
                <input
                    type="checkbox"
                    id="wurdeGelesenHinweisEventlocation"
                    name="wurdeGelesenHinweisEventlocation"
                    checked={formData.wurdeGelesenHinweisEventlocation || false}
                    onChange={handleInputChange}
                    className={styles.checkboxInput}
                    required
                />
                <label
                    htmlFor="wurdeGelesenHinweisEventlocation"
                    className={errorMissingConfirmationMessage && !formData.wurdeGelesenHinweisEventlocation ? styles.errorOrangeLabel : ''}
                    role="alert"
                >
                    Hiermit bestätige ich, dass bei Werbemaßnahmen der "Festsaal im Studierendenhaus" als Veranstaltungsort genannt wird und <b>nicht</b> Pupille-Kino, da die Pupille nicht der Veranstalter ist.
                </label>
            </div>

            <DatenschutzCheck
                onInputChange={onInputChange}
                formData={formData as MitKinotechnikFormData}
                messageType={undefined}
            />

            <ReCAPTCHA
                className="mb-3"
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={onSetCaptchaToken}
                theme="dark"
            />

            <button
                type="submit"
                className={styles.submitButton}
                disabled={submissionStatusWithMessage.status === 'sending' || !!dateRangeErrorMessage}
            >
                Anfrage senden
            </button>
            <p><sub className={styles.formSubtext}>*Pflichtfelder</sub></p>

            {errorMissingConfirmationMessage && (
                <p role="alert" className={styles.errorOrangeLabel}>{errorMissingConfirmationMessage}</p>
            )}

            {submissionStatusWithMessage.status === 'sending' && (
                <p
                    className={styles.statusMessage + " " + styles.statusSending}
                    role="status"
                >
                    &#x2709; Sende Nachricht...
                </p>
            )}
        </form>
    );
};

export default MitKinotechnikForm;