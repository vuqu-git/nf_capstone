import './OverviewAndProgram.css';

import {formatDateInOverviewArchive} from "../utils/formatDateInOverviewArchive.ts";
import {renderHtmlText} from "../utils/renderHtmlText.tsx";
import {Link, useLoaderData} from "react-router-dom";
import React, {JSX, useEffect, useState} from "react";
import {ArchiveData} from "../App2.tsx";
import styles from "./contact/Forms.module.css";
import {convertToHtmlEntities} from "../utils/convertToHtmlEntities.ts";

export default function OverviewArchive2() {

    const {screeningArchiveEntries, allPdfs} = useLoaderData<ArchiveData>();

    // ********************************************************
    // ordinary state management → state is lost when the component unmounts and remounts, which happens when you navigate away and then back
    // const [archivedResource, setArchivedResource] = useState<string>("");
    //
    // const [searchFilm, setSearchFilm] = useState<string>("");
    // const [searchPdf, setSearchPdf] = useState<string>("");


    // Initialize state from sessionStorage
    //      Purpose: To keep the state after visiting the film details and get back to archive
    const [archivedResource, setArchivedResource] = useState<string>(
        sessionStorage.getItem("archivedResource") || ""
    );
    const [searchFilm, setSearchFilm] = useState<string>(
        sessionStorage.getItem("searchFilm") || ""
    );
    const [searchPdf, setSearchPdf] = useState<string>(
        sessionStorage.getItem("searchPdf") || ""
    );

    // Effect to save state to sessionStorage whenever it changes
    useEffect(() => {
        sessionStorage.setItem("archivedResource", archivedResource);
    }, [archivedResource]);

    useEffect(() => {
        sessionStorage.setItem("searchFilm", searchFilm);
    }, [searchFilm]);

    useEffect(() => {
        sessionStorage.setItem("searchPdf", searchPdf);
    }, [searchPdf]);

    // form handlers
    const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setArchivedResource(event.target.value);
    };

    const handleFilmInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilm(event.target.value);
    };

    const handlePdfInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchPdf(event.target.value);
    };
    // ********************************************************

    const renderArchiveWithScreenings = () => {
        if (!screeningArchiveEntries || screeningArchiveEntries.length === 0) {
            return null;
        }

        const rowsForArchiveEntries: JSX.Element[] = [];
        let lastSemester: string | undefined = '';

        // for (let i = 0; i < screeningArchiveEntries.length; i++) {
        //     const termin = screeningArchiveEntries[i];
        for (const termin of screeningArchiveEntries) {

            if (!termin.vorstellungsbeginn) continue;

            // for plain text search
            if (
                termin.titel?.toLowerCase().includes(searchFilm.toLowerCase()) ||
                termin.titel?.toLowerCase().includes(convertToHtmlEntities(searchFilm.toLowerCase())) ||
                termin.films.some(film =>
                    film.titel?.toLowerCase().includes(searchFilm.toLowerCase()) ||
                    film.titel?.toLowerCase().includes(convertToHtmlEntities(searchFilm.toLowerCase()))
                )
            ) {
                const currentSemester = termin.semester;
                const headerText = (lastSemester !== currentSemester) ? currentSemester : '';

                if (headerText) {
                    rowsForArchiveEntries.push(
                        <tr key={`header-${currentSemester}`} className="semester-header-row">
                            <td
                                className="semester-header-cell"
                                colSpan={2}
                            >
                                {headerText}
                            </td>
                        </tr>
                    );
                }
                
                rowsForArchiveEntries.push(
                    <tr key={termin.tnr}>
                        <td className="screening-date-cell">
                            {formatDateInOverviewArchive(termin.vorstellungsbeginn)}
                        </td>
                        <td className="screening-title-cell">
                            <Link
                                to={`/details/${termin.tnr}`}
                                className="custom-link"
                                // target="_blank"
                                // rel="noopener noreferrer"
                            >
                                {!termin.titel ? (
                                    <>
                                        {renderHtmlText(termin.films[0]?.titel) ?? ""}
                                    </>
                                ) : (
                                    <>
                                        {renderHtmlText(termin.titel)}
                                        <ol className="multiple-films-list">
                                            {termin.films.map(film => (
                                                <li key={film.fnr} className="multiple-films-list-item">
                                                    {renderHtmlText(film.titel)}
                                                </li>
                                            ))}
                                        </ol>
                                    </>
                                )}
                            </Link>
                        </td>
                    </tr>
                );

                lastSemester = currentSemester;
            }
        }

        return (
            <>
                {/*search field for film*/}
                <div className={styles.formField}>
                    <label htmlFor="searchFilm" className={`${styles.formLabel} visually-hidden`}>
                        einfache Filmsuche
                    </label>
                    <input
                        type="text"
                        id="searchFilm"
                        name="searchFilm"
                        value={searchFilm}
                        placeholder="Filmsuche (einfache Textsuche)"
                        onChange={handleFilmInputChange}
                        className={styles.textInput}
                    />
                </div>

                {/*display all/found archived screening entries as table*/}
                <table>
                    <tbody>{rowsForArchiveEntries}</tbody>
                </table>

            </>
        );
    };

    const renderArchiveWithPdfs = () => {
        if (!allPdfs || allPdfs.length === 0) {
            return null;
        }

        return (
            <>
                {/*termin.titel?.toLowerCase().includes(searchFilm.toLowerCase())*/}
                {/*search field for pdfs*/}
                <div className={styles.formField}>
                    <label htmlFor="searchPdf" className={`${styles.formLabel} visually-hidden`}>
                        einfache Filmsuche
                    </label>
                    <input
                        type="text"
                        id="searchPdf"
                        name="searchPdf"
                        value={searchPdf}
                        placeholder="Suche nach Programmheft, Flyer etc. (einfache Textsuche)"
                        onChange={handlePdfInputChange}
                        className={styles.textInput}
                    />
                </div>

                {/*display all/found archived pdf entries with image*/}
                {allPdfs.filter(p => p.titel?.toLowerCase().includes(searchPdf.toLowerCase()))
                    .map(p => (
                        <article key={p.pnr} className="mb-4">
                            <div>
                                <Link
                                    to={"https://pupille.org/programmheft/" + p.pdf}
                                    className="custom-link mb-1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {renderHtmlText(p.titel)}
                                </Link>
                            </div>

                            {p.bild && (
                                <Link
                                    to={"https://pupille.org/programmheft/" + p.pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={"https://pupille.org/bilder/programmheftbilder/" + p.bild}
                                        alt={"Bild von " + p.titel}
                                        className="program-flyer-image-archive"
                                    />
                                </Link>
                            )}
                        </article>
                    ))
                }
            </>
        )
    }

    // ********************************************************

    // this is the react component return
    return (
        <section className="normal-content-container">
            <h2>Programmarchiv</h2>

            <div className={styles.formField}>
                <label htmlFor="archivedResource" className={`${styles.formLabel} visually-hidden`}>
                    Screenings oder Hefte/Flyer auswählen
                </label>
                <select
                    id="archivedResource"
                    value={archivedResource}
                    onChange={handleSelectionChange}
                    className={styles.formSelect}
                >
                    <option key="" value="" disabled>
                        Screenings oder PDF-Hefte/Flyer auswählen
                    </option>
                    <option key="screenings" value="screenings">
                        alle Screeningtermine (bis Oktober 2014)
                    </option>
                    <option key="pdfs" value="pdfs">
                        PDF-Programmhefte/Flyer (bis Wintersemester 2002/2003)
                    </option>

                </select>
            </div>

            {archivedResource == "screenings" && renderArchiveWithScreenings()}
            {archivedResource == "pdfs" && renderArchiveWithPdfs()}
        </section>
    );
}