import Card from 'react-bootstrap/Card';
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";

import './TerminFilmDetailsCard.css';
import FilmDTOFormPlus from "../../types/FilmDTOFormPlus.ts";
import TerminFilmDetailsListing from "./TerminFilmDetailsCardFilmListing.tsx";
import {createICSFileName} from "../../utils/createICSFileName.ts";
import {AddToCalendarButton} from "add-to-calendar-button-react";
import {createDateAndTimeForAddToCalendarButton} from "../../utils/createDateAndTimeForAddToCalendarButton.ts";
import ReiheDTOForFormWithTermineAndFilme from "../../types/ReiheDTOForFormWithTermineAndFilme.ts";
import {formatDateTime} from "../../utils/formatDateTime.ts";
import {Link} from "react-router-dom";

interface Props {
    tnr: string | undefined;

    screeningWeekday: string | undefined;
    screeningDate: string | undefined;
    screeningTime: string | undefined;

    vorstellungsbeginnIso8601: string | undefined;

    screeningSonderfarbe: string | undefined;

    // these 3 items refer to the displayed entries above (wrt to programm titel or main feature titel)
    programmtitel: string | undefined | null;
    programmtext: string | undefined | null;
    programmbesonderheit: string | undefined | null;

    mainfilms: FilmDTOFormPlus[];
    vorfilms: FilmDTOFormPlus[];

    terminGesamtlaufzeit: number;

    reihen: ReiheDTOForFormWithTermineAndFilme[];
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

                                                  mainfilms,
                                                  vorfilms,

                                                  terminGesamtlaufzeit,

                                                  reihen,
                                              }: Readonly<Props>) {

    const calenderTitle = programmtitel ?? (mainfilms[0].film.titel ?? "Film in der Pupille");
    const icsFileName = createICSFileName(calenderTitle, vorstellungsbeginnIso8601);
    const calenderDateObj = createDateAndTimeForAddToCalendarButton(vorstellungsbeginnIso8601, terminGesamtlaufzeit);

    return (
        <Card
            className={`terminFilm-card ${screeningSonderfarbe}`}
        >
            <Card.Body>

                <Card.Header
                    as="h4"
                    className="terminFilm-card-header"
                >

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

                    {screeningWeekday} | {screeningDate} | {screeningTime}
                </Card.Header>

                <Card.Title
                    as="h3"
                    className="program-title"
                >
                    {renderHtmlText(programmtitel)}
                </Card.Title>

                {programmtext && (
                    <Card.Text className="program-text">
                        {renderHtmlText(programmtext)}
                    </Card.Text>
                )}

                {programmbesonderheit && (
                    <Card.Text className="program-besonderheit">
                        {renderHtmlText(programmbesonderheit)}
                    </Card.Text>
                )}

                {/*#########################################*/}
                {/*###### Listing of Reihe(-elements) ######*/}
                {reihen.length > 0 && (
                    <article className="program-text" style={{marginBottom: '1.5rem'}}>
                        {/*<div style={{color: '#9ac7fa'}}>{reihen.length == 1 ? "In der Filmreihe" : "In den Filmreihen"}</div>*/}
                        <div style={{color: '#9ac7fa'}}>
                            Diese Vorstellung { new Date() > new Date(calenderDateObj.startDate) ? " lief" : "läuft"}
                            {reihen.length == 1 ? " in der Filmreihe" : " in den Filmreihen"}
                        </div>
                        {reihen.map((reihe: ReiheDTOForFormWithTermineAndFilme, i) => (
                            <div key={reihe.rnr} className="">
                                <div style={{paddingLeft: '1rem'}}><em>{reihe.titel}</em> zusammen mit</div>
                                {reihe.termine && (
                                    <ul className="">
                                        {[...reihe.termine]
                                            .filter(termin => termin.tnr?.toString() !== tnr)
                                            .map((termin, j) => (

                                                <li key={termin.tnr}>
                                                    <Link to={`/details/${termin.tnr}`} className="custom-link">
                                                    {/*{formatDateTime(termin.vorstellungsbeginn, false, true)?.date}: {" "}*/}
                                                    {termin.films && termin.films.length > 0
                                                        ? termin.films.map((film, k) => (
                                                            <span key={film.fnr}>
                                                                {renderHtmlText(film.titel)}
                                                                {k < termin.films.length - 1 ? ", " : ""}
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

                {mainfilms.map((filmPlusObj, index) => {
                    const film = filmPlusObj.film;

                    // Check if film properties exist
                    if (!film) return null;

                    return (
                        <TerminFilmDetailsListing
                            key={index}
                            index={index}
                            f={film}
                            numberOfF={mainfilms.length}
                            fType={(mainfilms.length == 1) ? "" : "Film:"}
                        />
                    );
                })}

                {vorfilms.map((filmPlusObj, index) => {
                    const vorfilm = filmPlusObj.film;

                    // Check if film properties exist
                    if (!vorfilm) return null;

                    return (
                        <TerminFilmDetailsListing
                            key={index}
                            index={index}
                            f={vorfilm}
                            numberOfF={vorfilms.length}
                            fType={"Vorfilm:"}
                        />
                    );
                })}
            </Card.Body>
        </Card>
    );
}