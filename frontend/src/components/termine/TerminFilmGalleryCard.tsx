import Card from 'react-bootstrap/Card';
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";
import {renderHtmlContent} from "../../utils/renderHtmlContent.tsx";
import './TerminFilmGalleryCard.css';
import './CancellationStyle.css';
import { useNavigate } from "react-router-dom";
import {selectSonderfarbeFromString} from "../../utils/selectSonderfarbeFromString.ts";
import {staticFilePathFrontend} from "../../utils/config.ts";
import {useIsMobile} from "../../hooks/useIsMobile.ts";
import {safeTruncate} from '../../utils/safeTruncate.ts';

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

    tnr: number | undefined;
    terminBesonderheit: string | undefined;

    terminIsCanceled: boolean | undefined;
}

// Set the maximum length for the truncated text
// Default limit (when no Besonderheit (hauptfilmbesonderheit or terminbesonderheit is present)
const MAX_LENGTH_KURZTEXT_DEFAULT = 250;

// Shorter limit (when a Besonderheit IS present)
const MAX_LENGTH_KURZTEXT_SHORTER = 175;

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
                                                  terminIsCanceled
                                              }: Readonly<Props>) {
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const handleClick = () => {
        navigate(`/details/${tnr}`);
    };

    // -------------------------------------------------
    // 1. Determine if a "Besonderheit" field is present
    const hasBesonderheit = !!hauptfilmbesonderheit || !!terminBesonderheit;

    // 2. Select the correct maximum length based on screen size and presence of "Besonderheit"
    let maxLength: number | null = null;

    if (isMobile) {
        // If a Besonderheit exists, use the SHORTER limit
        if (hasBesonderheit) {
            maxLength = MAX_LENGTH_KURZTEXT_SHORTER;
        }
        // Otherwise, use the DEFAULT (longer) limit
        else {
            maxLength = MAX_LENGTH_KURZTEXT_DEFAULT;
        }
    }
    // If not mobile, maxLength remains null, so full text is used.

    // 3. Apply the truncation logic
    const displayedKurztext = (isMobile && kurztext && maxLength !== null) // maxLength !== null is not required here,
                                                                                     // but prevents this warning in safeTruncate's argument maxLength: "TS2345: Argument of type number | null is not assignable to parameter of type number"
        ? safeTruncate(kurztext, maxLength)
        : kurztext;

    return (
        <Card
            className={`terminFilmGallery-card ${selectSonderfarbeFromString(screeningSonderfarbe)} zoom-effect ${terminIsCanceled ? 'termin-cancellation-text' : ''}`}
        >
            {/*{bild && (*/}
                <div
                    className="image-aspect-ratio-container"
                    // onClick={handleClick}
                    // role="button"
                    onClick={tnr ? handleClick : undefined}
                    role={tnr ? "button" : undefined}
                >
                    <Card.Img
                        variant="top"
                        src={staticFilePathFrontend + "bilder/filmbilder/" + bild}
                        alt={titel ? `Screening-Bild von ${titel}` : ""}

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

                    {/* div for the cancellation text overlay over the image (in gallery card) */}
                    {terminIsCanceled && (
                        <div className="cancellation-image-overlay">
                            <span className="cancellation-image-overlay-text">Termin abgesagt!</span>
                        </div>
                    )}

                    {/*empty tag for stronger gradient effect for transition from image to text*/}
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
            {/*)}*/}

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
                {/*{kurztext && (*/}
                {/*    <div className="card-kurztext">*/}
                {/*        {renderHtmlContent(kurztext)}*/}
                {/*    </div>*/}
                {/*)}*/}

                {/* Use the conditionally truncated text here */}
                {displayedKurztext && (
                    <div className="card-kurztext">
                        {renderHtmlContent(displayedKurztext)}
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
                    <div
                        className="card-terminBesonderheit"
                        style={{ borderTop: kurztext ? undefined : 'none' }}
                    >
                        {renderHtmlContent(terminBesonderheit)}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}
