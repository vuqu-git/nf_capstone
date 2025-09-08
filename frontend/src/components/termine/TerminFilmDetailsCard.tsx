import Card from 'react-bootstrap/Card';
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";

import './TerminFilmDetailsCard.css';
import FilmDTOFormPlus from "../../types/FilmDTOFormPlus.ts";
import TerminFilmDetailsListing from "./TerminFilmDetailsCardFilmListing.tsx";
import {createICSFileName} from "../../utils/createICSFileName.ts";
import {AddToCalendarButton} from "add-to-calendar-button-react";
import {createDateAndTimeForAddToCalendarButton} from "../../utils/createDateAndTimeForAddToCalendarButton.ts";
import ReiheDTOFormWithTermineAndFilme from "../../types/ReiheDTOFormWithTermineAndFilme.ts";
import {formatDateTime} from "../../utils/formatDateTime.ts";
import {Link} from "react-router-dom";
import {selectSonderfarbeFromString} from "../../utils/selectSonderfarbeFromString.ts";
import {renderHtmlContent} from "../../utils/renderHtmlContent.tsx";

interface Props {
    tnr: string | undefined;

    screeningWeekday: string | undefined;
    screeningDate: string | undefined;
    screeningTime: string | undefined;

    vorstellungsbeginnIso8601: string | undefined;

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
}

export default function TerminFilmDetailsCard({
                                                  tnr,

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
                                              }: Readonly<Props>) {

    const calenderTitle = programmtitel || (mainfilms[0].film.titel || "Film im Pupille-Kino");
    const icsFileName = createICSFileName(calenderTitle, vorstellungsbeginnIso8601);
    const calenderDateObj = createDateAndTimeForAddToCalendarButton(vorstellungsbeginnIso8601, terminGesamtlaufzeit);

    return (
        <Card
            className={`terminFilmDetails-card ${selectSonderfarbeFromString(screeningSonderfarbe)}`}
            // className={`terminFilmDetails-card pupille-glow`}
        >
            <Card.Body>
                <div className="add-to-calendar-button-container">
                    <AddToCalendarButton

                        name={"Pupille: " + calenderTitle}
                        startDate={calenderDateObj.startDate}
                        startTime={calenderDateObj.startTime}
                        endDate={calenderDateObj.endDate}
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
                    as="h4"
                    className="terminFilmDetails-card-header"
                >
                    {screeningWeekday} | {screeningDate} | {screeningTime}
                </Card.Header>

                <Card.Title
                    as="h3"
                    className="program-title"
                >
                    {renderHtmlText(programmtitel)}
                </Card.Title>

                {showProgrammbildInDetails && (
                    <Card.Img
                        src={`https://www.pupille.org/bilder/filmbilder/${programmbild}`}
                        alt={programmtitel ? `Still vom Film ${programmtitel}` : ""}
                    />
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
                            Diese Vorstellung { new Date() > new Date(calenderDateObj.startDate) ? " lief" : "läuft"}
                            {reihen.length == 1 ? " in der Filmreihe" : " in den Filmreihen"}
                        </div>
                        {reihen.map((reihe: ReiheDTOFormWithTermineAndFilme, i) => (
                            <div key={reihe.rnr} className="">
                                <div className="ps-3"><em>{reihe.titel}</em> {reihe.termine.length > 1 ? "zusammen mit" : ""}</div>
                                {reihe.termine && (
                                    <ul className="">
                                        {[...reihe.termine]
                                            .filter(termin => termin.tnr?.toString() !== tnr) // Termin in focus (in TerminFilmDetailsCard) should not be listed
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

                {(mainfilms.length > 0 || vorfilms.length > 0) ? (
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
                                />
                            );
                        })}
                    </>
                ) : (
                    <>
                        {/*<Card.Img*/}
                        {/*    src={`https://www.pupille.org/bilder/filmbilder/${programmbild}`}*/}
                        {/*    alt={programmtitel ? `Still vom Film ${programmtitel}` : ""}*/}
                        {/*/>*/}
                    </>
                )}
            </Card.Body>
        </Card>
    );
}