import Card from 'react-bootstrap/Card';
import { renderHtmlText } from "../../utils/renderHtmlText.tsx";
import '../termine/TerminFilmGalleryCard.css';
import { useNavigate } from "react-router-dom";
import {renderHtmlContent} from "../../utils/renderHtmlContent.tsx";

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

export default function TerminFilmPreviewCard({
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

    // ***********
    // random selection of screeningSonderfarbe when multiple were entered (comma separated)
    // maybe shift to backend

    let screeningSonderfarbeSelected;
    const screeningSonderfarbeList = screeningSonderfarbe.split(",");
    const length = screeningSonderfarbe.split(",").length;
    if (length > 0) {
        const randomIndex = Math.floor(Math.random() * length);
        screeningSonderfarbeSelected = screeningSonderfarbeList[randomIndex].trim();
    }

    // ***********

    return (
            <Card
                className={`terminFilmGallery-card ${screeningSonderfarbeSelected} zoom-effect`}
                onClick={handleClick}
                role="button"
            >
                {bild && (
                    // <div className="image-aspect-ratio-container">
                    <div className="image-aspect-ratio-container">
                        <Card.Img
                            variant="top"
                            src={`https://www.pupille.org/bilder/filmbilder/${bild}`}
                            // 0) always pass a style prop
                            style={{ objectPosition: `center ${offsetImageInGallery || "center"}` }}
                        />

                        {/*empty tag for stronger gradient effect*/}
                        <div className="gradient-overlay"></div>

                        <div className="gradient-overlay">
                            <Card.Text className="overlay-analog-date">
                                {hauptfilmFormat?.includes("mm") && (
                                    <span className="analog-box"
                                          style={{
                                              fontSize: '1.5rem',
                                          }}
                                    >{hauptfilmFormat}</span>
                                )}
                                <span className="overlay-time"
                                      style={{
                                          fontSize: '2.75rem',
                                      }}
                                >
                                    {screeningWeekday || screeningDate || screeningTime ? (
                                        <>
                                            {screeningWeekday} | {screeningDate} | {screeningTime}
                                        </>
                                    ) : (
                                        'keine Terminangaben'
                                    )}
                                </span>
                            </Card.Text>

                            {titel && (
                                <Card.Title as="h3"
                                            className="overlay-title"
                                            style={{
                                                fontSize: '3.25rem',
                                            }}
                                >
                                    {renderHtmlText(titel)}
                                </Card.Title>
                            )}

                            {(hauptfilmRegie || hauptfilmJahr || hauptfilmLaufzeit) && (
                                <Card.Text className="filminfo-and-stab-gallery"
                                           style={{
                                               fontSize: '2.0rem',
                                           }}
                                >
                                    {[hauptfilmRegie, hauptfilmJahr, hauptfilmLaufzeit !== undefined ? hauptfilmLaufzeit + " Min." : undefined]
                                        .filter(Boolean)
                                        .join(' | ')}
                                </Card.Text>
                            )}
                        </div>
                    </div>
                )}

                {/*<Card.Body*/}
                {/*    style={{*/}
                {/*        paddingTop: '0rem',*/}
                {/*    }}*/}
                {/*>*/}
                {/*    {kurztext && (*/}
                {/*        <Card.Text className="card-kurztext"*/}
                {/*                   style={{*/}
                {/*                       fontSize: '2.0rem',*/}
                {/*                   }}*/}
                {/*        >*/}
                {/*            {renderHtmlText(kurztext)}*/}
                {/*        </Card.Text>*/}
                {/*    )}*/}

                {/*    {besonderheit && (*/}
                {/*        <Card.Text className="card-besonderheit"*/}
                {/*                   style={{ fontSize: '2.0rem', borderTop: kurztext ? undefined : 'none', padding: '0 0' }}*/}
                {/*        >*/}
                {/*            {renderHtmlText(besonderheit)}*/}
                {/*        </Card.Text>*/}
                {/*    )}*/}
                {/*</Card.Body>*/}

                <Card.Body
                    style={{
                        paddingTop: '0rem',
                    }}
                >
                    {kurztext && (
                        <div className="card-kurztext"
                                   style={{
                                       fontSize: '2.0rem',
                                   }}
                        >
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
                        <div className="card-terminBesonderheit"
                                   // style={{ fontSize: '2.0rem', borderTop: kurztext ? undefined : 'none', padding: '0 0' }}
                                   style={{ fontSize: '2.0rem' }}
                        >
                            {renderHtmlContent(terminBesonderheit)}
                        </div>
                    )}
                </Card.Body>
            </Card>

    );
}