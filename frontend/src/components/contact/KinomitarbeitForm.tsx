import React, { ChangeEvent, FormEvent } from 'react';
import styles from './Forms.module.css';

export interface KinomitarbeitFormData {
    name: string;
    email: string;
    nachricht: string;
    stundenEngagement: number;
}

interface KinomitarbeitFormProps {
    onSubmit: (event: FormEvent, issue?: string, data?: KinomitarbeitFormData) => void;
    submissionStatus: { status: 'idle' | 'sending' | 'success' | 'error'; nachricht?: string | null };
    onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    formData: KinomitarbeitFormData;
}

const KinomitarbeitForm: React.FC<KinomitarbeitFormProps> = ({ onSubmit, submissionStatus, onInputChange, formData }) => {

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
                <label className={styles.formLabel} htmlFor="name">Name*:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ''}     // Ensure initial value is defined
                    onChange={onInputChange}
                    required
                    className={styles.textInput}
                />
            </div>
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="email">Email*:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}    // Ensure initial value is defined
                    onChange={onInputChange}
                    required
                    className={styles.emailInput}
                />
            </div>
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="nachricht">Nachricht*:</label>
                <textarea
                    id="nachricht"
                    name="nachricht"
                    value={formData.nachricht || ''}  // Ensure initial value is defined
                    onChange={onInputChange}
                    required
                    className={styles.textareaField}
                    style={{ height: '300px' }}
                />
            </div>

            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="stundenEngagement">Geschätztes Engagement (in h) im Durchschnitt pro Monat:</label>
                <input
                    type="number"
                    id="stundenEngagement"
                    name="stundenEngagement"
                    value={formData.stundenEngagement !== undefined ? formData.stundenEngagement : 0}
                    onChange={onInputChange}
                    min="0"
                    step="0.5"
                    className={styles.numberInput}
                />
            </div>

            <button
                type="submit"
                className={styles.submitButton}
                disabled={submissionStatus.status === 'sending'}
            >
                Nachricht senden
            </button>
            <p><sub className={styles.formSubtext}>*Pflichtfelder</sub></p>

            {submissionStatus.status === 'sending' &&
                <p className={styles.statusMessage + " " + styles.statusSending}>&#x2709; Sende Nachricht...</p>
            }
        </form>
    );
};

export default KinomitarbeitForm;
