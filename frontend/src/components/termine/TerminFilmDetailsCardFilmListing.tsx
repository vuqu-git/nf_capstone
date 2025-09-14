import Card from 'react-bootstrap/Card';
import {Accordion} from "react-bootstrap";
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";
import {renderHtmlContent} from "../../utils/renderHtmlContent.tsx";

import {Film} from "../../types/Film.ts";
import {structureStabString} from "../../utils/structureStabString.ts";
import {getFilmTitleForFilmDetailsCardFilmListing} from "../../utils/getFilmTitleForFilmDetailsCardFilmListing.tsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import './TerminFilmDetailsCardFilmListing.css';


interface Props {
    index: number;
    f: Film;
    numberOfF: number;
    fType: string;
}

export default function TerminFilmDetailsListing({
                                                  index,
                                                  f,
                                                  numberOfF,
                                                  fType,
                                              }: Readonly<Props>) {

    const structuredStabObj = f.stab ? structureStabString(f.stab) : null;

    // State to track if the user has given consent to play the YouTube video
    const [hasPlayYoutubeConsent, setHasPlayYoutubeConsent] = useState(false);

    // Check for existing consent in sessionStorage on component mount
    useEffect(() => {
        const userConsent = sessionStorage.getItem('youtube_consent');
        if (userConsent === 'true') {
            setHasPlayYoutubeConsent(true);
        }
    }, []);

    // Function to handle the user giving consent for 'Video laden' button (onClick)
    const handleConsent = () => {
        setHasPlayYoutubeConsent(true);
        sessionStorage.setItem('youtube_consent', 'true');
    };

    return (
        <div>
            {/****** film title ******/}
            {/*******----------*******/}
            <Card.Title
                as="h2"
                className={`film-title ${f.bild ? 'film-title-with-image-padding' : ''}`}
            >
                {getFilmTitleForFilmDetailsCardFilmListing({ f, fType, numberOfF, index, renderHtmlText })}
            </Card.Title>

            {/****** image ******/}
            {/*******-----*******/}
            {/* Check if image URL exists */}
            {f.bild && (
                <Card.Img
                    src={`https://www.pupille.org/bilder/filmbilder/${f.bild}`}
                    alt={f?.titel ? `Still vom Film ${f.titel}` : ""}
                />
            )}

            <Card.Body>
                {/****** text ******/}
                {/*******----*******/}
                { f.text && (
                    <div className="film-text style-video-in-card iframe">
                        {renderHtmlContent(f.text)}
                    </div>
                )}

                {/****** besonderheit ******/}
                {/*******------------*******/}
                {   f.besonderheit && (
                    <div className="film-besonderheit">
                        {renderHtmlText(f.besonderheit)}
                    </div>
                )}

                {/****** content note ******/}
                {/*******------------*******/}
                { f.contentNote && (
                    <Accordion flush data-bs-theme="dark" className="mb-3 content-note">
                        <Accordion.Item eventKey="0" >
                            <Accordion.Header>
                                <span className="w-100 text-center">Hinweis auf sensible Inhalte</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                {renderHtmlContent(f.contentNote)}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                )}

                {/*/!****** trailer ******!/*/}
                {/*/!*******-------*******!/*/}
                {/*{*/}
                {/*    f.trailer &&*/}
                {/*    <div className="style-video-in-card iframe">*/}
                {/*        {renderHtmlContent(f.trailer)}*/}
                {/*    </div>*/}
                {/*}*/}

                {/****** trailer with consent logic ******/}
                {/*******--------------------------*******/}
                {f.trailer && (
                    <div className="trailer-consent-container">
                        {hasPlayYoutubeConsent ? (
                            // If consent is true, render the trailer
                            renderHtmlContent(f.trailer)
                        ) : (
                            // Otherwise, render the privacy banner
                            <div className="privacy-banner">
                                <h4>Trailer: Wiedergabe und Datenschutz</h4>
                                <p>
                                    Dieses Video wird von einem externen Dienst (YouTube, Vimeo etc.) geladen. Dabei können personenbezogene Daten (z. B. IP‑Adresse) an den Anbieter übertragen und Cookies gesetzt werden.
                                    Mit Klick auf „Video laden“ stimmst du der Übertragung und Verarbeitung deiner Daten durch den Anbieter zu.
                                    <br/>
                                    Weitere Informationen sind in unseren <Link to="/datenschutzhinweise" className="custom-link">Datenschutzhinweisen</Link> zu finden.
                                </p>
                                <button
                                    onClick={handleConsent}
                                >
                                    Ja, Video laden.
                                </button>
                            </div>
                        )}
                    </div>
                )}


                {/****** film informationen ******/}
                {/*******------------------*******/}
                {(f.land || f.jahr || f.laufzeit || f.sprache || f.untertitel || f.farbe || f.format || f.fsk) && (
                    <div className="section-block">
                        <Card.Title as="h6" className="filminfo-and-stab-details">Filminformationen:</Card.Title>
                        <div className="table-block">
                            {f.land && <div className="row"><div className="label">Land</div><div className="value">{f.land}</div></div>}
                            {f.jahr && <div className="row"><div className="label">Jahr</div><div className="value">{f.jahr}</div></div>}
                            {f.laufzeit && <div className="row"><div className="label">Länge</div><div className="value">{f.laufzeit} Min.</div></div>}
                            {f.sprache && <div className="row"><div className="label">Sprache</div><div className="value">{f.sprache}</div></div>}
                            {f.untertitel && <div className="row"><div className="label">Untertitel</div><div className="value">{f.untertitel}</div></div>}
                            {f.farbe && <div className="row"><div className="label">Farbigkeit</div><div className="value">{renderHtmlText(f.farbe)}</div></div>}
                            {f.format && <div className="row"><div className="label">Format</div><div className="value">{f.format}</div></div>}
                            {f.fsk && <div className="row"><div className="label">FSK</div><div className="value">{f.fsk}</div></div>}
                            {f.verleih && <div className="row"><div className="label">Verleih</div><div className="value">{f.verleih}</div></div>}
                        </div>
                    </div>
                )}

                {/****** stab & besetzung ******/}
                {/*******----------------*******/}
                {structuredStabObj && (
                    <div className="section-block"> {/* This will be the last .section-block */}
                        <Card.Title as="h6" className="filminfo-and-stab-details">Stab und Besetzung:</Card.Title>
                        <div className="table-block">
                            {structuredStabObj.map(row => (
                                <div className="row" key={row.abbrev}>
                                    <div className="label">{row.abbrev}</div>
                                    <div className="value">{renderHtmlText(row.entry)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card.Body>
        </div>
    )
}