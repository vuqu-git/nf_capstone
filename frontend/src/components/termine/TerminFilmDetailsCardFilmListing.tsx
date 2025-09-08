import Card from 'react-bootstrap/Card';
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";

import {Film} from "../../types/Film.ts";
import {structureStabString} from "../../utils/structureStabString.ts";
import './TerminFilmDetailsCardFilmListing.css';
import {Accordion} from "react-bootstrap";
import {getFilmTitleForFilmDetailsCardFilmListing} from "../../utils/getFilmTitleForFilmDetailsCardFilmListing.tsx";

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

    return (
        <div>
            {/****** film title ******/}
            {/*******----------*******/}
            <Card.Title
                as="h3"
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
                        {renderHtmlText(f.text)}
                    </div>
                )}

                {/****** besonderheit ******/}
                {/*******------------*******/}
                {
                    f.besonderheit &&
                    <div className="film-besonderheit">
                        {renderHtmlText(f.besonderheit)}
                    </div>
                }

                {/****** content note ******/}
                {/*******------------*******/}
                { f.contentNote && (
                    <Accordion flush data-bs-theme="dark" className="mb-3 content-note">
                        <Accordion.Item eventKey="0" >
                            <Accordion.Header>
                                <span className="w-100 text-center">Hinweis auf sensible Inhalte</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                {renderHtmlText(f.contentNote)}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                )}

                {/****** trailer ******/}
                {/*******-------*******/}
                {
                    f.trailer &&
                    <div className="film-text style-video-in-card iframe">
                        {renderHtmlText(f.trailer)}
                    </div>
                }

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
                                    <div className="label">{renderHtmlText(row.abbrev)}</div>
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