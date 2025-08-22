import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import styles from './Forms.module.css';
import {Badge} from "react-bootstrap";
import DatenschutzCheck from "../other/DatenschutzCheck.tsx";

// caller of this component: EventMitProjektion.tsx

export interface KooperationFormData {
    betreff: string;
    ansprechperson: string;
    email: string;
    telefon: string;

    filmtitel: string;
    verleih: string;
    format: 'DCP' | 'Blu-ray' | 'DVD' | 'Datei auf PC' | '35mm' | '16mm' | 'noch unbekannt';

    terminpraeferenz: string;
    nachricht: string;
    zusammenarbeit: string;

    istEinverstandenMitDatennutzung: boolean;
}

interface KooperationFormProps {
    onSubFormSubmit: (event: FormEvent, data: KooperationFormData) => void;
    submissionStatusWithMessage: {
        status: 'idle' | 'sending' | 'success' | 'error';
        nachricht?: string
    };
    onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    formData: KooperationFormData;
}

const KooperationForm: React.FC<KooperationFormProps> = ({ onSubFormSubmit, submissionStatusWithMessage, onInputChange, formData }) => {

    const maxMessageLengthObj = {
        nachricht: 1500,
        zusammenarbeit: 500
    };

    const [terminPraeferenzLabel, setTerminPraeferenzLabel] = useState('');
    const [momentaneAnfrageFuerSemester, setMomentaneAnfrageFuerSemester] = useState('');

    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-indexed (0 for January, 6 for July)

        if (month >= 3 && month <= 6) { // April (3) to July (6)
            setTerminPraeferenzLabel(`Eure Terminpräferenzen für das Wintersemester ${year.toString().slice(-2)}/${(year + 1).toString().slice(-2)}`);
            setMomentaneAnfrageFuerSemester(`D.h. momentan sind nur Anfragen für das Wintersemester ${year.toString().slice(-2)}/${(year + 1).toString().slice(-2)} möglich.`)
        } else { // August (7) to March (2) of the following year
            setTerminPraeferenzLabel(`Eure Terminpräferenzen für das Sommersemester ${year + 1}`);
            setMomentaneAnfrageFuerSemester(`D.h. momentan sind nur Anfragen für das Sommersemester ${year + 1} möglich.`);
        }
    }, []);

    const handleLocalSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSubFormSubmit(event, formData);
    };


    return (
        <form className={styles.formContainer} onSubmit={handleLocalSubmit}>
            <Badge bg="warning" text="dark">Hinweis:</Badge>
            <p className={styles.formDescription}>
                Der Einsendeschluss für Kooperationsanfragen ist der 31. Januar (für das Sommersemester) sowie der 31. Juli (für das Wintersemester). <b>{momentaneAnfrageFuerSemester}</b>
            </p>
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
                <label className={styles.formLabel} htmlFor="telefon">Telefonnummer</label>
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
                    maxLength={maxMessageLengthObj.nachricht}
                    onChange={onInputChange}
                    required
                    className={styles.textareaField}
                    style={{ height: '175px' }}
                    aria-describedby="nachricht-counter"
                />
                <div id="nachricht-counter" className={styles.characterCounter}>
                    Zeichen: {formData?.nachricht?.length || 0}/{maxMessageLengthObj.nachricht}
                </div>
            </div>

            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="filmtitel">Filmtitel *</label>
                <input
                    type="text"
                    id="filmtitel"
                    name="filmtitel"
                    value={formData.filmtitel || ''}
                    maxLength={150}
                    onChange={onInputChange}
                    required
                    className={styles.textInput}
                />
            </div>

            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="verleih">Verleiher/Rechteinhaber des vorgeschlagenen Films *</label>
                <input
                    type="text"
                    id="verleih"
                    name="verleih"
                    value={formData.verleih || ''}
                    maxLength={100}
                    onChange={onInputChange}
                    required
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
                    <option value="Datei auf PC" className={styles.selectOption}>Filmdatei</option>
                    <option value="35mm" className={styles.selectOption}>35mm</option>
                    <option value="16mm" className={styles.selectOption}>16mm</option>
                    <option value="noch unbekannt" className={styles.selectOption}>noch unbekannt</option>
                </select>
                <div className={styles.textUnderTextField}>
                    Weitere alternative Filmideen (mit Angabe von Verleih und Abspielformat) können im obigen Nachrichtenfeld genannt werden.
                </div>
            </div>

            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="terminpraeferenz">{terminPraeferenzLabel} *</label>
                <textarea
                    id="terminpraeferenz"
                    name="terminpraeferenz"
                    value={formData.terminpraeferenz || ''}
                    maxLength={250}
                    placeholder="Spieltermine sind i.d.R. 20:15 Uhr am Montag und Mittwoch in der Vorlesungszeit des Semesters"
                    onChange={onInputChange}
                    required
                    className={styles.textareaField}
                />
            </div>

            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="zusammenarbeit">
                    Eure Vorstellungen zur Arbeitsteilung und Kostenbeteiligung (u.a. Ticketeinnahmen, Filmbestellung, Vorführlizenz) *
                </label>
                <textarea
                    id="zusammenarbeit"
                    name="zusammenarbeit"
                    value={formData.zusammenarbeit || ''}
                    maxLength={maxMessageLengthObj.zusammenarbeit}
                    onChange={onInputChange}
                    required
                    className={styles.textareaField}
                    style={{ height: '100px' }}
                    aria-describedby="zusammenarbeit-counter"
                />
                <div id="zusammenarbeit-counter" className={styles.characterCounter}>
                    Zeichen: {formData?.zusammenarbeit?.length || 0}/{maxMessageLengthObj.zusammenarbeit}
                </div>
            </div>

            <DatenschutzCheck
                onInputChange={onInputChange}
                formData={formData as KooperationFormData}
                messageType={undefined}
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

export default KooperationForm;
