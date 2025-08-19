import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './Forms.module.css';
import EigenstaendigForm, { EigenstaendigFormData } from './EigenstaendigForm';
import MitKinotechnikForm, { MitKinotechnikFormData } from './MitKinotechnikForm';
import KooperationForm, { KooperationFormData } from './KooperationForm';
import { Badge } from 'react-bootstrap';

interface EventMitProjektionProps {
    onSubmit: (
        event: FormEvent,
        issue: string,
        data: EigenstaendigFormData | MitKinotechnikFormData | KooperationFormData
    ) => void;

    submissionStatusWithMessage: {
        status: 'idle' | 'sending' | 'success' | 'error';
        message?: string
    };
}

interface SubSelectionConfig {
    value: string;
    label: string;
}

const subSelectionOptions: SubSelectionConfig[] = [
    { value: 'eigenstaendig', label: '➀ ganz eigenständig' },
    { value: 'mitkinotechnik', label: '➁ mit professioneller Kinotechnik' },
    { value: 'kooperation', label: '➂ gemeinsam in Kooperation mit Pupille' },
];

const EventMitProjektion: React.FC<EventMitProjektionProps> = ({ onSubmit, submissionStatusWithMessage }) => {
    const [selectedIssuesSubSelection, setSelectedIssuesSubSelection] = useState<string>('');
    const [subFormData, setSubFormData] = useState<EigenstaendigFormData | MitKinotechnikFormData | KooperationFormData>({});

    const handleIssueSubSelectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedIssuesSubSelection(event.target.value);
        setSubFormData({});
    };

    const handleSubFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = event.target;
        if (type === 'checkbox') {
            setSubFormData((prevData) => ({
                ...prevData,
                [name]: (event.target as HTMLInputElement).checked,
            }));
        } else {
            setSubFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const onSubFormSubmit = (
        event: FormEvent,
        formData: EigenstaendigFormData | MitKinotechnikFormData | KooperationFormData
    ) => {
        // 2nd parameter selectedIssuesSubSelection targets the subselection (or the subform) with the possible values eigenstaendig, mitkinotechnik or kooperation
        onSubmit(event, selectedIssuesSubSelection, formData);
    };

    const renderSubForm = () => {
        if (!selectedIssuesSubSelection) return null; // not sure if really required !?!?!?!?!

        switch (selectedIssuesSubSelection) {
            case 'eigenstaendig':
                return (
                    <EigenstaendigForm
                        onSubFormSubmit={onSubFormSubmit}
                        submissionStatusWithMessage={submissionStatusWithMessage}
                        onInputChange={handleSubFormChange as (
                            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                        ) => void}
                        formData={subFormData as EigenstaendigFormData}
                    />
                );
            case 'mitkinotechnik':
                return (
                    <MitKinotechnikForm
                        onSubFormSubmit={onSubFormSubmit}
                        submissionStatusWithMessage={submissionStatusWithMessage}
                        onInputChange={handleSubFormChange as (
                            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
                        ) => void}
                        formData={subFormData as MitKinotechnikFormData}
                    />
                );
            case 'kooperation':
                return (
                    <KooperationForm
                        onSubFormSubmit={onSubFormSubmit}
                        submissionStatusWithMessage={submissionStatusWithMessage}
                        onInputChange={handleSubFormChange as (
                            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
                        ) => void}
                        formData={subFormData as KooperationFormData}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <div>
                <Badge bg="success">Bitte lesen</Badge>
                <p className={styles.formDescription}>
                    Informationen zu den verschiedenen Durchführungsarten von Veranstaltungen mit Projektion findet Ihr unter{' '}
                    <a className="custom-link" href="/kinoprojektion" target="_blank" rel="noopener noreferrer">
                        Infos & Service: Filme etc. zeigen
                    </a>
                </p>
                {/* subselection */}
                {/*~~~~~~~~~~~~~~*/}
                <label htmlFor="subSelection" className={styles.formLabel} hidden>
                    Art der Veranstaltung
                </label>
                <select
                    id="subSelection"
                    value={selectedIssuesSubSelection}
                    onChange={handleIssueSubSelectionChange}
                    className={styles.formSelect}
                >
                    <option key="" value="" disabled>
                        Bitte Durchführungsart der Veranstaltung auswählen.
                    </option>
                    {subSelectionOptions.map((option) => (
                        <option key={option.value} value={option.value} className={styles.selectOption}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {renderSubForm()}
        </div>
    );
};

export default EventMitProjektion;
