import React, { ChangeEvent, FormEvent } from 'react';
import styles from './Forms.module.css';
import DatenschutzCheck from "../other/DatenschutzCheck.tsx";
import ReCAPTCHA from "react-google-recaptcha";

// caller of this component: ContactForm.tsx

export interface KinomitarbeitFormData {
    name: string;
    email: string;
    nachricht: string;
    stundenEngagement: number;
    istEinverstandenMitDatennutzung: boolean
}

interface KinomitarbeitFormProps {
    onSubmit: (event: FormEvent, issue?: string, data?: KinomitarbeitFormData) => void;
    submissionStatusWithMessage: {
        status: 'idle' | 'sending' | 'success' | 'error';
        nachricht?: string
    };
    onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    formData: KinomitarbeitFormData;
    onSetCaptchaToken: (value: string | null) => void;
}

const KinomitarbeitForm: React.FC<KinomitarbeitFormProps> = ({ onSubmit, submissionStatusWithMessage, onInputChange, formData, onSetCaptchaToken }) => {

    const maxMessageLength = 1000;

    const handleLocalSubmit = (event: FormEvent) => {
        // Prevent the child form's default submission
        event.preventDefault();

        // Call the parent's onSubmit which is called handleGlobalSubmit there, 2nd parameter explicitIssue of handleGlobalSubmit is undefined here
        // i.e. ContactForm the state variable selectedIssueSelection is used (for recognizing kinomitarbeit or aob)
        onSubmit(event, undefined, formData);
    };

    return (
        <form className={styles.formContainer} onSubmit={handleLocalSubmit}>
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="name">Name *</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ''}
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
                <label className={styles.formLabel} htmlFor="nachricht">Nachricht *</label>
                <textarea
                    id="nachricht"
                    name="nachricht"
                    value={formData.nachricht || ''}
                    maxLength={maxMessageLength}
                    onChange={onInputChange}
                    required
                    className={styles.textareaField}
                    style={{ height: '300px' }}
                    aria-describedby="nachricht-counter"
                />
                <div id="nachricht-counter" className={styles.characterCounter}>
                    Zeichen: {formData?.nachricht?.length || 0}/{maxMessageLength}
                </div>
            </div>

            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="stundenEngagement">Geschätztes Engagement (in h) im Durchschnitt pro Monat</label>
                <input
                    type="number"
                    id="stundenEngagement"
                    name="stundenEngagement"
                    value={formData.stundenEngagement ?? 0}
                    onChange={onInputChange}
                    min="0"
                    step="0.5"
                    className={styles.numberInput}
                />
            </div>

            <DatenschutzCheck
                onInputChange={onInputChange}
                formData={formData as KinomitarbeitFormData}
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
                disabled={submissionStatusWithMessage.status === 'sending'}
            >
                Anfrage senden
            </button>
            <p><sub className={styles.formSubtext}>*Pflichtfelder</sub></p>

            {submissionStatusWithMessage.status === 'sending' &&
                <p
                    className={styles.statusMessage + " " + styles.statusSending}
                    role="status"
                >
                    &#x2709; Sende Nachricht...
                </p>
            }
        </form>
    );
};

export default KinomitarbeitForm;
