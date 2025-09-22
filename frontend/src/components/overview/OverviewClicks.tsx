import {useLoaderData} from 'react-router-dom';
import styles from './OverviewClicks.module.css';
import {ClicksResponseDTO} from "../../types/ClicksResponseDTO.ts";
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";
import {Col, Container, Row} from "react-bootstrap";
import BackToTopButton from "../BackToTopButton.tsx";

const OverviewClicks: React.FC = () => {
    const clicksOfSemester = useLoaderData() as ClicksResponseDTO[];

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'n/a';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const formatDaysOnline = (dateString: string | null) => {
        if (!dateString) return 'n/a';

        const onlineDate = new Date(dateString);
        const today = new Date();

        if (onlineDate.toDateString() === today.toDateString()) {
            return '0';
        }

        const diffTime = Math.abs(today.getTime() - onlineDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays}`;
    };

    return (
        <Container
            className="bootstrap-container-component"
            id="container"
        >
            <Row className="justify-content-center">

                <Col md={12} lg={12} xl={12} className="px-0">
                    {/*px-0 sets both horizontal paddings (left and right) to zero for all breakpoints, including extra small screens*/}
                    {/*To set the left and right padding to zero on your <Col> for extra small screens (less than 576px) in React Bootstrap, use the Bootstrap utility class px-0*/}
                    <div className={styles.container}>
                        <section>
                            <h1 className={styles.title}>Click-Übersicht pro Vorstellung im aktuellen Semester</h1>
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                    <tr>
                                        <th>Datum/Uhrzeit</th>
                                        <th>Titel</th>
                                        <th>Screening (session)</th>
                                        <th>Kalender (session)</th>
                                        <th>Screening (user)</th>
                                        <th>Kalender (user)</th>
                                        <th>verkaufte Tickets</th>
                                        <th>Im Heft</th>
                                        <th>1. Klick vor Tagen</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {clicksOfSemester.map((click, index) => (
                                        <tr key={index}>
                                            <td>
                                                {/*{new Date(click.vorstellungsbeginn).toLocaleDateString()}<br />*/}
                                                {formatDate(click.vorstellungsbeginn)}<br />
                                                {formatTime(click.vorstellungsbeginn)}
                                            </td>
                                            <td>{renderHtmlText(click.titel)}</td>
                                            <td>{click.sessionScreeningClicks}</td>
                                            <td>{click.sessionCalendarClicks}</td>
                                            <td>{click.userScreeningClicks}</td>
                                            <td>{click.userCalendarClicks}</td>
                                            <td>{click.visitors ?? 'n/a'}</td>
                                            <td>{click.outsideProgrammheft ? '' : 'x'}</td>
                                            <td>{formatDaysOnline(click.onlineSince)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <details className="summary-style general-info mt-3">
                            <summary>Erläuterungen</summary>
                            <h2 className={styles.title2}>Screening (Session) und Screening (User)</h2>
                            <p className="mt-0">Hier werden die Klickzahlen gezählt, wie oft auf die Detailseite pupille.org/details/XYZ eines Screenings geladen wurde.</p>

                            <h2 className={styles.title2}>Kalender (Session) und Termin (User)</h2>
                            <p>Die Zählung bezieht sich darauf, wie oft ein Klick auf die Kalenderfunktion (Button für “Termin eintragen” auf Detailseite oben bzw. Kalendersymbol in der Semesterübersicht links) erfolgte.</p>

                            <h2 className={styles.title2}>Zählvarianten</h2>

                            <div className={styles.zaehlartenbox}>
                                <h3 className={styles.title3}>Session:</h3>
                                <p>Die Zählung findet innerhalb einer Browsersession (geöffnetes Browserfenster oder -tab) statt: Beim mehrmaligen Öffnen einer Detailseite oder mehrmaligen Klicken auf die Kalenderfunktion erfolgt keine Mehrfachzählung, sondern nur der 1. Klick wird 1-fach gezählt. Für die Folgeklicks erfolgt keine Zählung. Ein neues Browserfenster bzw. -tab zählt als neue Session. D.h. hier erfolgt die Zählung wieder beim 1. Klick.</p>
                            </div>

                            <div className={styles.zaehlartenbox}>
                                <h3 className={styles.title3}>User:</h3>
                                <p className="mb-0">Diese Zahl ist ein Proxy für die Zahl der interessierten Personen. Die Zählung erfolgt pro User pro erstmaligem Klick in ein und desselben Browser. Ausnahmen davon:</p>
                                <ul>
                                    <li>User löscht manuell den lokalen Speicher oder den Browser-Cache.</li>
                                    <li>User verwendet den privaten bzw. Inkognito-Modus; Daten des lokalen Speichers werden normalerweise nach Schließen des Modus gelöscht.</li>
                                    <li>Einige Browser, wie Safari, löschen lokal gespeicherte Daten proaktiv, wenn eine Website für eine bestimmte Zeit (z.B. 7 Tage) nicht genutzt oder keine Benutzerinteraktion mehr erfolgt ist.</li>
                                </ul>
                            </div>

                            <h2 className={styles.title2}>1. Klick vor X Tagen</h2>
                            <p>Zeigt an, wann der allererste Klick erfolgte und ist ein Proxy seit wann der Screeningeintrag online ist.</p>
                        </details>

                    </div>

                </Col>
            </Row>
            <BackToTopButton
                parentId="container"
                rightPercent={0.02}
            />
        </Container>
    );
};

export default OverviewClicks;