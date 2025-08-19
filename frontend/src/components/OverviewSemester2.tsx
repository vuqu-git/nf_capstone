import './OverviewAndProgram.css';

import {Link, useLoaderData} from "react-router-dom";
import TerminDTOWithFilmDTOOverviewSemester from "../types/TerminDTOWithFilmDTOOverviewSemester.ts";
import {formatDateTime} from "../utils/formatDateTime.ts";
import {renderHtmlText} from "../utils/renderHtmlText.tsx";
import {AddToCalendarButton} from "add-to-calendar-button-react";
import {createDateAndTimeForAddToCalendarButton} from "../utils/createDateAndTimeForAddToCalendarButton.ts";
import {createICSFileName} from "../utils/createICSFileName.ts";
import ReihenAndFilmTermineForOverviewSemester from "../types/ReihenAndFilmTermineForOverviewSemester.ts";
import React, {useState} from "react";

import Select, { ActionMeta, SingleValue } from "react-select";
import {renderHtmlContent} from "../utils/renderHtmlContent.tsx";
import {testListeReihenSemester} from "./testListeReihenSemester.ts";
import {reihenSelectionWithSearchStyles} from "./styles/reihenSelectionWithSearchStyles.ts";

interface ReihenOption {
    value: string;
    label: React.ReactNode; // If using JSX (i.e. HTML tags used), otherwise string
}


const avgDurationTrailer = 12;

export default function OverviewSemester2() {
    const objReihenAndTermineForOverviewSemester = useLoaderData<ReihenAndFilmTermineForOverviewSemester>();
    const semesterTermine: TerminDTOWithFilmDTOOverviewSemester[] = objReihenAndTermineForOverviewSemester.termineSemester;
    const semesterReihen: string[] = objReihenAndTermineForOverviewSemester.reihenSemester;

    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);

    const [selectedOption, setSelectedOption] = useState<ReihenOption | null>(null);

    const handleChange = (
        newValue: SingleValue<ReihenOption>,
        actionMeta: ActionMeta<ReihenOption>
    ) => {
        setSelectedOption(newValue);
    };

    // const reihenOptions = testListeReihenSemester.map(reihe => ({ // test for huge semesterReihen list
    const reihenOptions = semesterReihen.map(reihe => ({
        value: reihe,
        label: <span><em>{reihe}</em></span>
    }));

    return (
        <section className="normal-content-container">

            <h2 className="header2NormalContainer">Semesterübersicht</h2>

            <Select
                options={reihenOptions}

                value={selectedOption}
                onChange={handleChange}

                isClearable={isClearable}
                isSearchable={isSearchable}
                placeholder="nach Filmreihe filtern"
                noOptionsMessage={() => "Keine Reihen gefunden"}

                styles={reihenSelectionWithSearchStyles}
            />

            {semesterTermine && semesterTermine.length > 0 && (
                <div className="overview-container">
                    {semesterTermine
                        .filter(termin => {
                            // if (!selectedOption || !selectedOption.value) return true; // concise line below achieves the same
                            if (!selectedOption?.value) return true; // show all

                            // Filter: Only show termine where at least one reihe.titel matches selectedOption.value
                            return termin.reihen?.some(reihe => reihe.titel === selectedOption.value);
                        })
                        .map(termin => {

                            const screeningDateObj = formatDateTime(termin.vorstellungsbeginn, true, true);
                            const calenderDateObj = createDateAndTimeForAddToCalendarButton(termin.vorstellungsbeginn, termin.terminGesamtlaufzeit + avgDurationTrailer);

                            const calenderTitle = termin.titel || termin.mainfilms[0].titel;
                            const icsFileName = createICSFileName(calenderTitle, termin.vorstellungsbeginn);

                            return (
                                <article key={termin.tnr} className="overview-row">
                                    <div className="overview-date">
                                        <div className="weekday">{screeningDateObj?.weekday}</div>
                                        <div
                                            className="datetime">{screeningDateObj?.date} {screeningDateObj?.time}</div>

                                        <div className="calendar">
                                            <AddToCalendarButton
                                                name={"Pupille: " + calenderTitle}
                                                startDate={calenderDateObj.startDate}
                                                startTime={calenderDateObj.startTime}
                                                endDate={calenderDateObj.endDate}
                                                endTime={calenderDateObj.endTime}
                                                timeZone="Europe/Berlin"
                                                options={['Apple', 'Google', 'iCal']}
                                                uid={termin.tnr + "-uidTermin@pupille.org"}
                                                iCalFileName={"pupille-" + icsFileName}
                                                inline={true}
                                                hideTextLabelButton={true}
                                                pastDateHandling="hide"
                                                size="0"
                                                lightMode={"dark"}
                                                hideBranding={true}
                                                buttonStyle="round"
                                            />
                                        </div>
                                    </div>

                                    <div className="overview-title">
                                        {!termin.titel ? (
                                            <>
                                                <Link to={`/details/${termin.tnr}`} className="custom-link">
                                                    {renderHtmlText(termin.mainfilms[0]?.titel) ?? ""}
                                                </Link>

                                                {(termin.mainfilms[0]?.regie || termin.mainfilms[0]?.jahr || termin.mainfilms[0]?.laufzeit) &&
                                                    <p className="filminfo-and-stab-details filminfo-in-semester-overview">
                                                        {[
                                                            termin.mainfilms[0]?.regie,
                                                            termin.mainfilms[0]?.jahr,
                                                            termin.mainfilms[0]?.laufzeit !== undefined ? termin.mainfilms[0]?.laufzeit + " Min." : undefined
                                                        ].filter(Boolean).join(' | ')}
                                                    </p>
                                                }
                                            </>
                                        ) : (
                                            <>
                                                <Link to={`/details/${termin.tnr}`} className="custom-link">
                                                    {renderHtmlText(termin.titel)}
                                                    <ol className="film-list">
                                                        {termin.mainfilms.map(film => (
                                                            <li key={film.fnr}>{renderHtmlText(film.titel)}</li>
                                                        ))}
                                                    </ol>
                                                </Link>
                                                <p className="filminfo-and-stab-details filminfo-in-semester-overview">
                                                    {termin.terminGesamtlaufzeit} Min.
                                                </p>
                                            </>
                                        )}

                                        {termin.terminBesonderheit && (
                                            <div className="besonderheit">
                                                {renderHtmlContent(termin.terminBesonderheit) ?? ""}
                                            </div>
                                        )}

                                    </div>
                                </article>
                            );
                        })}
                </div>
            )}
        </section>
    );
}
