import '../styles/CancellationStyle.css'
import styles from './OverviewClicks.module.css';

import {Link, useLoaderData} from 'react-router-dom';
import {ClicksResponseDTO} from "../../types/ClicksResponseDTO.ts";
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";
import {Col, Container, Row} from "react-bootstrap";
import BackToTopButton from "../structural_components/BackToTopButton.tsx";
import {formatDateInTerminSelectOption} from "../../utils/formatDateInTerminSelectOption.ts";
import {formatDaysOnlineInOverviewClicks} from "../../utils/formatDaysOnlineInOverviewClicks.ts";
import {useEffect} from "react";

const OverviewClicks: React.FC = () => {
    const clicksOfSemester = useLoaderData<ClicksResponseDTO[]>();

    useEffect(() => {
        // create meta tag
        const meta = document.createElement('meta');
        meta.name = "robots";
        meta.content = "noindex, nofollow";
        document.head.appendChild(meta);

        // Clean up when the component is unmounted (leaving the page)
        return () => {
            document.head.removeChild(meta);
        };
    }, []);

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
                            <p>Zweck: Abschätzung des Publikumsaufkommens für staffing des Dienstplans</p>
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
                                        <th>Tage online</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {clicksOfSemester.map(click => (
                                        <tr key={click.tnr}>
                                            <td className={click.isCanceled ? 'termin-cancellation-text-clicks-overview' : undefined}>
                                                {formatDateInTerminSelectOption(click.vorstellungsbeginn)}
                                            </td>
                                            <td className={styles.truncate}>{click.isCanceled ? "🔴 " : "🟢 "}<Link to={"/details/" +click.tnr + "?t=x"} className="custom-link">{renderHtmlText(click.titel)}</Link></td>
                                            <td>{click.sessionScreeningClicks}</td>
                                            <td>{click.sessionCalendarClicks}</td>
                                            <td>{click.userScreeningClicks}</td>
                                            <td>{click.userCalendarClicks}</td>
                                            <td>{click.visitors ?? 'n/a'}</td>
                                            <td>{click.insideProgrammheft ? 'x' : ''}</td>
                                            <td>{formatDaysOnlineInOverviewClicks(click.vorstellungsbeginn, click.onlineSince)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <details className="summary-style general-info mt-3">
                            <summary>Erläuterungen</summary>
                            <h2 className={styles.title2}>Screening (session) und Screening (user)</h2>
                            <p className="mt-0">Hier werden die Klickzahlen gezählt, wie oft auf die Detailseite pupille.org/details/XYZ eines Screenings geladen wurde.</p>

                            <h2 className={styles.title2}>Kalender (session) und Termin (user)</h2>
                            <p>Die Zählung bezieht sich darauf, wie oft ein Klick auf die Kalenderfunktion (Button für “Termin eintragen” auf Detailseite oben bzw. Kalendersymbol in der Semesterübersicht links) erfolgte.</p>

                            <h2 className={styles.title2}>Zählvarianten</h2>

                            <p>Generell: Keine Zählung bei Klicks zeitlich nach der Vorführung</p>

                            <div className={styles.zaehlartenbox}>
                                <h3 className={styles.title3}>session:</h3>
                                <p>Die Zählung findet innerhalb 1 Browsersession (geöffnetes Browserfenster oder -tab) statt: Beim mehrmaligen Öffnen einer Detailseite oder mehrmaligen Klicken auf die Kalenderfunktion erfolgt keine Mehrfachzählung, sondern nur der 1. Klick wird 1-fach gezählt. Ein neues Browserfenster bzw. -tab zählt als neue Session. D. h. hier erfolgt die Zählung wieder beim 1. Klick.</p>
                            </div>

                            <div className={styles.zaehlartenbox}>
                                <h3 className={styles.title3}>user:</h3>
                                <p className="mb-0">Diese Zahl ist ein Proxy für die Zahl der interessierten Personen. Die Zählung erfolgt pro User pro erstmaligem Klick in ein und desselben Browser. Ausnahmen davon:</p>
                                <ul>
                                    <li>User löscht manuell den lokalen Speicher oder den Browser-Cache.</li>
                                    <li>User verwendet den privaten bzw. Inkognito-Modus; Daten des lokalen Speichers werden normalerweise nach Schließen des Modus gelöscht.</li>
                                    <li>Einige Browser, wie Safari, löschen lokal gespeicherte Daten proaktiv, wenn eine Website für eine bestimmte Zeit (z.B. 7 Tage) nicht genutzt oder keine Benutzerinteraktion mehr erfolgt ist.</li>
                                </ul>
                            </div>

                            <h2 className={styles.title2}>Tage online</h2>
                            <p>Zeigt an wie lange das Screening in der Gallery (main page) auf der Webseite beworben wurde (Zählung der Tage nur bis Vorführungstag).</p>

                            <h2 className={styles.title2}>Legende</h2>
                            <p>
                                🔴: Vorführung, die als "abgesagt" angezeigt wird <br />
                                🟢: Vorführung, die stattfinden soll bzw. stattgefunden hat
                            </p>

                            <h2 className={styles.title2}>Kein Tracking mit den Links hier</h2>
                            <p>Beim Besuch der Detailseiten über die Links oben (mit den Postfixes "?t=x" in der url) wird keine Click-Zählung durchgeführt.</p>
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