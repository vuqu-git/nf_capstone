import Card from 'react-bootstrap/Card';
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";
import {renderHtmlContent} from "../../utils/renderHtmlContent.tsx";
import './TerminFilmGalleryCard.css';
import { useNavigate } from "react-router-dom";
import {selectSonderfarbeFromString} from "../../utils/selectSonderfarbeFromString.ts";
import {staticFilePathFrontend} from "../../utils/config.ts";

interface Props {
    screeningWeekday: string | null;
    screeningDate: string | null;
    screeningTime: string | null;
    screeningSonderfarbe: string;

    bild: string | null; // could refer to the entire programm or main feature
    offsetImageInGallery: string | undefined;

    titel: string | null; // could refer to the entire programm or main feature
    kurztext: string | null; // could refer to the entire programm or main feature

    hauptfilmFormat: string | undefined;
    hauptfilmRegie: string | undefined;
    hauptfilmJahr: number | undefined;
    hauptfilmLaufzeit: number | undefined;
    hauptfilmbesonderheit: string | undefined;

    tnr: number;
    terminBesonderheit: string | undefined;
}

export default function TerminFilmGalleryCard({
                                                  screeningWeekday,
                                                  screeningDate,
                                                  screeningTime,
                                                  screeningSonderfarbe,
                                                  bild,
                                                  offsetImageInGallery,
                                                  titel,
                                                  kurztext,
                                                  hauptfilmFormat,
                                                  hauptfilmRegie,
                                                  hauptfilmJahr,
                                                  hauptfilmLaufzeit,
                                                  hauptfilmbesonderheit, // inhaltliche Besonderheit des main features
                                                  tnr,
                                                  terminBesonderheit, // bezieht sich auf Koop, Festival, Gäste, Ort & Zeit etc. des Termins(!)
                                              }: Readonly<Props>) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/details/${tnr}`);
    };

    return (
        <Card
            className={`terminFilmGallery-card ${selectSonderfarbeFromString(screeningSonderfarbe)} zoom-effect`}
        >
            {bild && (
                <div
                    className="image-aspect-ratio-container"
                    onClick={handleClick}
                    role="button"
                >
                    <Card.Img
                        variant="top"
                        // src={`https://www.pupille.org/bilder/filmbilder/${bild}`}
                        // src={import.meta.env.VITE_STATIC_FILEPATH + bild}
                        src={staticFilePathFrontend + bild}
                        alt={titel ? `Bild der Vorführung von ${titel}` : ""}

                        // 0) always pass a style prop
                        style={{ objectPosition: `center ${offsetImageInGallery || "center"}` }}

                        // Conditionally set style if offsetImageInGallery prop exists
                        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                        // these 2 alternatives of conditionally passing style DOESN'T work somehow :(
                        // 1) Conditional spread skips the entire prop including presence/removal, which can cause React or your UI library to act differently during reconciliation.
                        //      Conditional spreading with {...(condition && { prop: value })} is a neat way to pass a prop only when the condition is truthy.
                        // {...(offsetImageInGallery && { style: { objectPosition: `center ${offsetImageInGallery}%` } })}

                        // 2) React treats style={undefined} as omitted, which is safer than adding/removing style prop.
                        //      i.e. when style is undefined, React does not render the style attribute on the DOM element at all, effectively omitting it.
                        //      If you pass an empty object {}, React will render style="", which still adds the attribute but empty.
                        // style={
                        //     offsetImageInGallery !== undefined
                        //         ? { objectPosition: `center ${offsetImageInGallery}%` }
                        //         : undefined
                        // }
                    />

                    {/*empty tag for stronger gradient effect*/}
                    <div className="gradient-overlay"></div>

                    <div className="gradient-overlay">
                        <Card.Text className="overlay-analog-date">
                            {hauptfilmFormat?.includes("mm") && (
                                <span className="analog-box">{hauptfilmFormat}</span>
                            )}
                            <span className="overlay-time">
                                {screeningWeekday || screeningDate || screeningTime ? (
                                    <>
                                        {screeningWeekday} {screeningDate} {screeningTime}
                                    </>
                                ) : (
                                    'keine Terminangabe'
                                )}
                            </span>
                        </Card.Text>

                        {titel && (
                            <Card.Title as="h3" className="overlay-title">
                                {renderHtmlText(titel)}
                            </Card.Title>
                        )}

                        {(hauptfilmRegie || hauptfilmJahr || hauptfilmLaufzeit) && (
                            <Card.Text className="filminfo-and-stab-gallery">
                                {[hauptfilmRegie, hauptfilmJahr, hauptfilmLaufzeit !== undefined ? hauptfilmLaufzeit + " Min." : undefined]
                                    .filter(Boolean)
                                    .join(' | ')}
                            </Card.Text>
                        )}
                    </div>
                </div>
            )}
            {/*Here with Card.Text (p tag) and renderHtmlText (span tag)*/}
            {/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/}
            {/*<Card.Body>*/}
            {/*    {kurztext && (*/}
            {/*        <Card.Text className="card-kurztext">*/}
            {/*            {renderHtmlText(kurztext)}*/}
            {/*        </Card.Text>*/}
            {/*    )}*/}

            {/*    {hauptfilmbesonderheit && (*/}
            {/*        <Card.Text style={{ borderTop: kurztext ? undefined : 'none' }}>*/}
            {/*            <div className="card-filmBesonderheit">*/}
            {/*                {renderHtmlText(hauptfilmbesonderheit)}*/}
            {/*            </div>*/}
            {/*        </Card.Text>*/}
            {/*    )}*/}

            {/*    {terminBesonderheit && (*/}
            {/*        <Card.Text className="card-terminBesonderheit">*/}
            {/*            {renderHtmlText(terminBesonderheit)}*/}
            {/*        </Card.Text>*/}
            {/*    )}*/}
            {/*</Card.Body>*/}

            {/*Here with div tag instead of Card.Text (p tag) and renderHtmlText (in div tag)*/}
            {/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/}
            <Card.Body>
                {kurztext && (
                    <div className="card-kurztext">
                        {renderHtmlContent(kurztext)}
                    </div>
                )}

                {hauptfilmbesonderheit && (
                    <div
                        className="card-filmBesonderheit"
                        style={{ borderTop: kurztext ? undefined : 'none' }}
                    >
                        {renderHtmlContent(hauptfilmbesonderheit)}
                    </div>
                )}

                {terminBesonderheit && (
                    <div className="card-terminBesonderheit">
                        {renderHtmlContent(terminBesonderheit)}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}
