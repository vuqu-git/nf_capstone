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
        const diffTime = Math.abs(today.getTime() - onlineDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} Tage`;
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
                        <h2 className={styles.title}>Klicks-Übersicht pro Vorstellung</h2>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>Datum/Uhrzeit</th>
                                    <th>Titel</th>
                                    <th>Termin (session)</th>
                                    <th>Kalender (session)</th>
                                    <th>Termin (user)</th>
                                    <th>Kalender (user)</th>
                                    <th>verkaufte Tickets</th>
                                    <th>Im Heft</th>
                                    <th>Online seit</th>
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
                                        <td>{click.sessionTerminClicks}</td>
                                        <td>{click.sessionCalendarClicks}</td>
                                        <td>{click.userTerminClicks}</td>
                                        <td>{click.userCalendarClicks}</td>
                                        <td>{click.visitors ?? 'n/a'}</td>
                                        <td>{click.outsideProgrammheft ? '' : 'x'}</td>
                                        <td>{formatDaysOnline(click.onlineSince)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
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