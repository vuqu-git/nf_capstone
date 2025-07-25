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

interface ReihenOption {
    value: string;
    label: React.ReactNode; // If using JSX (i.e. HTML tags used), otherwise string
}


const darkModeStyles = {
    control: (base: any, state: any) => ({
        ...base,
        backgroundColor: '#0f172a', // very dark background
        borderColor: state.isFocused ? '#334155' : '#1e293b',
        color: '#cfd6e1',
        boxShadow: 'none',
        ':hover': {
            borderColor: '#334155',
        },
    }),
    singleValue: (base: any) => ({
        ...base,
        color: '#cfd6e1',
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isFocused || state.isSelected ? '#1e293b' : '#0f172a',
        color: '#cfd6e1',
        cursor: 'pointer',
        ':active': {
            backgroundColor: '#334155',
        },
    }),
    input: (base: any) => ({
        ...base,
        color: '#cfd6e1',
    }),
    menu: (base: any) => ({
        ...base,
        backgroundColor: '#0f172a',
        boxShadow: 'none',
        borderRadius: '0 0 4px 4px',
        marginTop: 0,
        border: '1px solid #1e293b',
        color: '#cfd6e1',
        zIndex: 9999,
    }),
    menuPortal: (base: any) => ({
        ...base,
        zIndex: 9999,
    }),
};

const avgDurationTrailer = 12;

export default function OverviewSemester() {
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

    const reihenOptions = semesterReihen.map(reihe => ({
        value: reihe,
        label: <span><em>{reihe}</em></span>
    }));

    return (
        <section className="normal-content-container">

            <h2>Semesterübersicht</h2>

            <Select
                options={reihenOptions}

                value={selectedOption}
                onChange={handleChange}

                isClearable={isClearable}
                isSearchable={isSearchable}
                placeholder="nach Filmreihe filtern"
                noOptionsMessage={() => "Keine Reihen gefunden"}

                styles={darkModeStyles}
            />

            {semesterTermine && semesterTermine.length > 0 && (
                <div className="overview-container">
                    {semesterTermine
                        .filter(termin => {
                            // if (!selectedOption || !selectedOption.value) return true; // concise line achieves the same
                            if (!selectedOption?.value) return true; // show all

                            // Filter: Only show termine where at least one reihe.titel matches selectedOption.value
                            return termin.reihen?.some(reihe => reihe.titel === selectedOption.value);
                        })
                        .map(termin => {

                            const screeningDateObj = formatDateTime(termin.vorstellungsbeginn, true, true);
                            const calenderDateObj = createDateAndTimeForAddToCalendarButton(termin.vorstellungsbeginn, termin.terminGesamtlaufzeit + avgDurationTrailer);

                            const calenderTitle = termin.titel ?? termin.mainfilms[0].titel;
                            const icsFileName = createICSFileName(calenderTitle, termin.vorstellungsbeginn);

                            return (
                                <div key={termin.tnr} className="overview-row">
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
                                            <p className="besonderheit">
                                                {renderHtmlText(termin.terminBesonderheit) ?? ""}
                                            </p>
                                        )}

                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
        </section>
    );
}
