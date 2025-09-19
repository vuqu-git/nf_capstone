import {useEffect, useState} from "react";

import './OverviewAndProgram.css';

import axios from "axios";
import TerminDTOWithFilmDTOOverviewSemester from "../../types/TerminDTOWithFilmDTOOverviewSemester.ts";
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";
import {Link} from "react-router-dom";
import {formatDateTime} from "../../utils/formatDateTime.ts";


// interface Props {
//
// }

// export default function OverviewSemester({ }: Props) {
export default function OverviewSemester() {

    const [semesterTermine, setSemesterTermine] = useState<TerminDTOWithFilmDTOOverviewSemester[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getSemesterTermineWithFilmTitles = () => {
        axios.get<TerminDTOWithFilmDTOOverviewSemester[]>("/api/screenings/semester")
            .then((response) => {
                setSemesterTermine(response.data)
            })
            .catch((error) => {
                    const errorMessage = error instanceof Error ? error.message : "Fetching semester films failed";
                    setErrorMessage(errorMessage);
            })
            .finally(() => {
                setIsLoaded(true);
            });
    }

    useEffect(() => {
        getSemesterTermineWithFilmTitles();
    }, [])

    return (
        <div>
            <section>
                <h1>Semesterübersicht</h1>

                {errorMessage && (
                    <div className="text-danger mb-3">{errorMessage}</div>
                )}
                {!errorMessage && isLoaded && semesterTermine.length === 0 && (
                    <p>Die Termine für das Semester werden demnächst veröffentlicht.</p>
                )}

                {semesterTermine && semesterTermine.length > 0 ? (
                    <table>

                        <tbody>
                        {semesterTermine.map(termin => {
                            const screeningDateObj = formatDateTime(termin.vorstellungsbeginn, true, true);
                            return (
                                <tr key={termin.tnr}>
                                    <td style={{ padding: '0.5rem 0.25rem', whiteSpace: 'nowrap' }}>
                                        {screeningDateObj?.weekday}
                                    </td>
                                    <td style={{ padding: '0.5rem 0.25rem', whiteSpace: 'nowrap', textAlign: 'right' }}>
                                        {screeningDateObj?.date}
                                    </td>
                                    <td style={{ padding: '0.5rem 2rem 0.5rem 0.25rem', whiteSpace: 'nowrap', textAlign: 'right' }}>
                                        {screeningDateObj?.time}
                                    </td>
                                    <td style={{ padding: '0.5rem 0' }}>
                                        {!termin.titel ? (
                                            <>
                                                <Link
                                                    to={`/details/${termin.tnr}`}
                                                    className="custom-link"
                                                >
                                                    {renderHtmlText(termin.mainfilms[0]?.titel) ?? ""}
                                                </Link>
                                                {termin.mainfilms[0]?.besonderheit && (
                                                    <p style={{ fontSize: '0.75em', marginBottom: '0' }}>
                                                        {renderHtmlText(termin.mainfilms[0]?.besonderheit) ?? ""}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <Link
                                                to={`/details/${termin.tnr}`}
                                                className="custom-link"
                                            >
                                                {renderHtmlText(termin.titel)}
                                                <ol style={{ marginBottom: '0' }}>
                                                    {termin.mainfilms.map(film => (
                                                        <li key={film.fnr}>{renderHtmlText(film.titel)}</li>
                                                    ))}
                                                </ol>
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                ) : null} {/* else' part with null */}
            </section>
        </div>
    );
};