import Card from 'react-bootstrap/Card';
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";

import './TerminFilmDetailsCard.css';
import './CancellationStyle.css';
import FilmDTOFormPlus from "../../types/FilmDTOFormPlus.ts";
import TerminFilmDetailsListing from "./TerminFilmDetailsListing.tsx";
import {createICSFileName} from "../../utils/createICSFileName.ts";
import {AddToCalendarButton} from "add-to-calendar-button-react";
import {createDateAndTimeForAddToCalendarButton} from "../../utils/createDateAndTimeForAddToCalendarButton.ts";
import ReiheDTOFormWithTermineAndFilme from "../../types/ReiheDTOFormWithTermineAndFilme.ts";
import {formatDateTime} from "../../utils/formatDateTime.ts";
import {Link} from "react-router-dom";
import {selectSonderfarbeFromString} from "../../utils/selectSonderfarbeFromString.ts";
import {renderHtmlContent} from "../../utils/renderHtmlContent.tsx";
import {useTrackCalendarClick} from "../../hooks/useTrackCalendarClick.ts";
import {useTrackScreeningVisit} from "../../hooks/useTrackScreeningVisit.ts";
import {staticFilePathFrontend} from "../../utils/config.ts";

interface Props {
    tnr: number;
    veroeffentlichen: number | undefined;

    screeningWeekday: string | undefined;
    screeningDate: string | undefined;
    screeningTime: string | undefined;

    vorstellungsbeginnIso8601: string;

    screeningSonderfarbe: string;

    // these 3 items refer to the displayed entries above (wrt to programm titel or main feature titel)
    programmtitel: string | undefined | null;
    programmtext: string | undefined | null;
    programmbesonderheit: string | undefined | null;
    programmbild: string | undefined | null;

    showProgrammbildInDetails: boolean | undefined | null;

    mainfilms: FilmDTOFormPlus[];
    vorfilms: FilmDTOFormPlus[];

    terminGesamtlaufzeit: number;

    reihen: ReiheDTOFormWithTermineAndFilme[];

    terminIsCanceled: boolean | undefined;
}

const avgDurationTrailer = 12;

export default function TerminFilmDetailsCard({
                                                  tnr,
                                                  veroeffentlichen,

                                                  screeningWeekday,
                                                  screeningDate,
                                                  screeningTime,

                                                  vorstellungsbeginnIso8601,

                                                  screeningSonderfarbe,

                                                  programmtitel,
                                                  programmtext,
                                                  programmbesonderheit,
                                                  programmbild,

                                                  showProgrammbildInDetails,

                                                  mainfilms,
                                                  vorfilms,

                                                  terminGesamtlaufzeit,

                                                  reihen,

                                                  terminIsCanceled
                                              }: Readonly<Props>) {

    const calenderTitle = programmtitel || (mainfilms[0]?.film?.titel || "Film im Pupille-Kino");
    const icsFileName = createICSFileName(calenderTitle, vorstellungsbeginnIso8601);
    const calenderDateObj = createDateAndTimeForAddToCalendarButton(vorstellungsbeginnIso8601, terminGesamtlaufzeit + avgDurationTrailer);

    useTrackScreeningVisit(tnr, veroeffentlichen, vorstellungsbeginnIso8601, calenderTitle, !!programmbesonderheit, reihen.length, !!terminIsCanceled);
    const handleTrackCalendarClick = useTrackCalendarClick();

    // frontend termin cancellation test
    // terminIsCanceled = true;

    return (
        <Card
            className={`terminFilmDetails-card ${selectSonderfarbeFromString(screeningSonderfarbe)}`}
            // className={`terminFilmDetails-card pupille-glow`}
        >
            <Card.Body>
                <div
                    className="add-to-calendar-button-container"
                    onClick={() => handleTrackCalendarClick(tnr, vorstellungsbeginnIso8601, calenderTitle, !!programmbesonderheit, reihen.length, !!terminIsCanceled)}
                >
                    <AddToCalendarButton

                        name={"Pupille: " + calenderTitle}
                        startDate={terminIsCanceled ? "0000-01-01": calenderDateObj.startDate}  // "disable" calendar button when termin is canceled
                        startTime={calenderDateObj.startTime}
                        endDate={terminIsCanceled ? "0000-01-01" : calenderDateObj.endDate}     // "disable" calendar button when termin is canceled
                        endTime={calenderDateObj.endTime}
                        timeZone="Europe/Berlin" // Handles DST automatically

                        options={['Apple', 'Google', 'iCal']}
                        uid={tnr + "-uidTermin@pupille.org"}
                        iCalFileName={"pupille-" +  icsFileName}

                        trigger="click"

                        // inline={true}
                        label="Termin speichern"
                        // hideTextLabelButton={true}

                        pastDateHandling="hide"
                        size="2"
                        lightMode={"dark"}
                        // hideBackground={true}
                        hideBranding={true}
                    />
                </div>

                <Card.Header
                    as="h3"
                    className="terminFilmDetails-card-header" // Base class only
                >
                    {/* Optional: Add text prefix for clarity */}
                    {terminIsCanceled && <span className="termin-cancellation-alert-text">Abgesagt! </span>}

                    {/*<span className={terminIsCanceled ? 'termin-cancellation-date-text' : ''}>*/}
                    <span className={terminIsCanceled ? 'overlay-time' : ''}>
                        {screeningWeekday} {screeningDate} {screeningTime}
                    </span>
                </Card.Header>

                <Card.Title
                    as="h2"
                    className="program-title"
                >
                    {renderHtmlText(programmtitel)}
                </Card.Title>

                {showProgrammbildInDetails && (
                    <div className="image-container"> {/* Container to position overlay */}
                        <Card.Img
                            src={staticFilePathFrontend + "bilder/filmbilder/" + programmbild}
                            alt={programmtitel ? `Still vom Screening "${programmtitel}"` : ""}
                        />

                        {/* Conditional overlay */}
                        {terminIsCanceled && (  // Show overlay if the termin is canceled
                            <>
                                {/* color grading overlay */}
                                <div className="image-color-grading-overlay"></div>

                                <div className="cancellation-image-overlay">
                                    <span className="cancellation-image-overlay-text">Termin abgesagt!</span>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {programmtext && (
                    <div className="program-text mt-2">
                        {renderHtmlContent(programmtext)}
                    </div>
                )}

                {/*Here with Card.Text (p tag) and renderHtmlText (span tag)*/}
                {/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/}
                {/*{programmbesonderheit && (*/}
                {/*    <Card.Text className={reihen.length > 0 ? "program-besonderheit-mit-reihe-drunter" : "program-besonderheit-ohne-reihe-drunter"}>*/}
                {/*        {renderHtmlText(programmbesonderheit)}*/}
                {/*    </Card.Text>*/}
                {/*)}*/}

                {/*Here with div tag instead of Card.Text (p tag) and renderHtmlContent (div tag)*/}
                {/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/}
                {programmbesonderheit && (
                    <div className={reihen.length > 0 ? "program-besonderheit-mit-reihe-drunter" : "program-besonderheit-ohne-reihe-drunter"}>
                        {renderHtmlContent(programmbesonderheit)}
                    </div>
                )}

                {/*#########################################*/}
                {/*###### Listing of Reihe(-elements) ######*/}
                {reihen.length > 0 && (
                    <article className="program-text mb-4">
                        <div className="introduction-text-reihen">
                            {/*Diese {terminIsCanceled ? 'ausgefallene' : ''} Vorstellung {new Date() > new Date(calenderDateObj.startDate) ? "war" : "ist"}*/}
                            Diese {terminIsCanceled ? 'ausgefallene' : ''} Vorstellung ist
                            {reihen.length == 1 ? " Teil der Filmreihe" : " Teil der Filmreihen"}
                        </div>
                        {reihen.map((reihe: ReiheDTOFormWithTermineAndFilme, i) => (
                            <div key={reihe.rnr} className="">
                                {/*<div className="ps-3"><em>{reihe.titel}</em> {reihe.termine.length > 1 ? "zusammen mit" : ""}</div>*/}
                                <div className="mt-1"><em>{reihe.titel}</em> {reihe.termine.length > 1 ? "zusammen mit" : ""}</div>
                                {reihe.termine && (
                                    <ul className="no-bullets">
                                        {[...reihe.termine]
                                            .filter(termin => termin.tnr != tnr) // Termin in focus (in TerminFilmDetailsCard) should not be listed
                                            .map((termin, j) => (

                                                <li key={termin.tnr}>
                                                    <Link to={`/details/${termin.tnr}`} className="custom-link">
                                                    {termin.mainfilms && termin.mainfilms.length > 0
                                                        ? termin.mainfilms.map((film, k) => (
                                                            <span key={film.fnr}>
                                                                {renderHtmlText(film.titel)}
                                                                {k < termin.mainfilms.length - 1 ? ", " : ""}
                                                            </span>
                                                        ))
                                                        : "Kein Filmtitel vorhanden"}
                                                    {" "}({formatDateTime(termin.vorstellungsbeginn, false, true)?.date})
                                                    </Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                )}
                            </div>
                        ))}
                    </article>
                )}
                {/*###############################################*/}

                {(mainfilms.length > 0 || vorfilms.length > 0) && (
                    <>
                        {mainfilms?.map((filmPlusObj, index) => {
                            const film = filmPlusObj.film;

                            // Check if film properties exist
                            if (!film) return null;

                            return (
                                <TerminFilmDetailsListing
                                    key={film.fnr}
                                    index={index}
                                    f={film}
                                    numberOfF={mainfilms.length}
                                    fType={(mainfilms.length === 1) ? "" : "Film:"}
                                    terminIsCanceled={terminIsCanceled}
                                />
                            );
                        })}

                        {vorfilms?.map((filmPlusObj, index) => {
                            const vorfilm = filmPlusObj.film;

                            // Check if vorfilm properties exist
                            if (!vorfilm) return null;

                            return (
                                <TerminFilmDetailsListing
                                    key={vorfilm.fnr}
                                    index={index}
                                    f={vorfilm}
                                    numberOfF={vorfilms.length}
                                    fType={"Vorfilm:"}
                                    terminIsCanceled={terminIsCanceled}
                                />
                            );
                        })}
                    </>
                )}
            </Card.Body>
        </Card>
    );
}