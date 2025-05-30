import Card from 'react-bootstrap/Card';
import { renderHtmlText } from "../../utils/renderHtmlText.tsx";
import '../termine/TerminFilmGalleryCard.css';
import { useNavigate } from "react-router-dom";

interface Props {
    screeningWeekday: string | null;
    screeningDate: string | null;
    screeningTime: string | null;
    screeningSonderfarbe: string;

    bild: string | null;
    offsetImageInGallery: number | undefined;

    titel: string | null;
    kurztext: string | null;
    jahr: number | undefined;
    besonderheit: string | null;

    filmFormat: string | undefined;
    laufzeit: number | undefined;
    regie: string | undefined;

    tnr: number;
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
                                                  jahr,
                                                  besonderheit,
                                                  filmFormat,
                                                  laufzeit,
                                                  regie,
                                                  tnr,
                                              }: Props) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/details/${tnr}`);
    };

    return (
        <>
            <Card
                className={`custom-card ${screeningSonderfarbe} zoom-effect`}
                onClick={handleClick}
                role="button"
            >
                {bild && (
                    <div className="image-aspect-ratio-container" style={{paddingTop: '52.25%'}}>
                        <Card.Img
                            variant="top"
                            src={`https://www.pupille.org/bilder/filmbilder/${bild}`}
                            {...(offsetImageInGallery && { style: { objectPosition: `center ${offsetImageInGallery}%` } })}
                        />
                        {/*empty tag for stringer gradient effect*/}
                        <div className="gradient-overlay"></div>

                        <div className="gradient-overlay">
                            <Card.Text className="overlay-analog-date">
                                {filmFormat?.includes("mm") && (
                                    <span className="analog-box"
                                          style={{
                                              fontSize: '1.5rem',
                                          }}
                                    >{filmFormat}</span>
                                )}
                                <span className="overlay-time"
                                      style={{
                                          fontSize: '2.5rem',
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
                                                fontSize: '3.0rem',
                                            }}
                                >
                                    {renderHtmlText(titel)}
                                </Card.Title>
                            )}

                            {(regie || jahr || laufzeit) && (
                                <Card.Text className="filminfo-and-stab-gallery"
                                           style={{
                                               fontSize: '2.0rem',
                                           }}
                                >
                                    {[regie, jahr, laufzeit !== undefined ? laufzeit + " Min." : undefined]
                                        .filter(Boolean)
                                        .join(', ')}
                                </Card.Text>
                            )}
                        </div>
                    </div>
                )}

                <Card.Body
                    style={{
                        paddingTop: '0rem',
                    }}
                >
                    {kurztext && (
                        <Card.Text className="card-kurztext"
                                   style={{
                                       fontSize: '2.0rem',
                                   }}
                        >
                            {renderHtmlText(kurztext)}
                        </Card.Text>
                    )}

                    {besonderheit && (
                        <Card.Text className="card-besonderheit"
                                   style={{ fontSize: '2.0rem', borderTop: kurztext ? undefined : 'none', padding: '0 0' }}
                        >
                            {renderHtmlText(besonderheit)}
                        </Card.Text>
                    )}
                </Card.Body>
            </Card>
        </>
    );
}