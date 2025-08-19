import {useLoaderData} from "react-router-dom";
import {formatDateTime} from "../utils/formatDateTime.ts";
import TerminFilmGalleryCard from "./termine/TerminFilmGalleryCard.tsx";
import NewsCard from "./news/NewsCard.tsx";

import './Gallery.css';
import {GalleryData} from "../App2.tsx";
import {selectSonderfarbeFromReihenOfTermin} from "../utils/selectSonderfarbeFromReihenOfTermin.ts";

export default function Gallery2() {

    // // syntax for without own type for useLoaderData input
    // const { screeningGalleryEntries, validNews } = useLoaderData<{
    //     screeningGalleryEntries: TerminDTOWithFilmAndReiheDTOGallery[];
    //     validNews: News[];
    // }>();

    const {screeningGalleryEntries, validNews} = useLoaderData<GalleryData>();

    const visibleScreenings = screeningGalleryEntries
        .filter(termin => termin.veroeffentlichen !== null && termin.veroeffentlichen !== 0);

    // for testing semester break
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~
    // const visibleScreenings = [];

    return (
        <>
            {/* Section for news */}
            {validNews && validNews.length > 0 && (
                <section>
                    <h2 className="visually-hidden">Neuigkeiten</h2>
                    {validNews.map(n => (
                        <article key={n.id}>
                            <NewsCard variant={n.newsVariant} text={n.text} imageUrl={n.image}/>
                        </article>
                    ))}
                </section>
            )}

            {/* Section for current program */}
            {
                visibleScreenings.length > 0 ? (
                    <section>
                        <h2 className="visually-hidden">Aktuelles Programm</h2>
                        {visibleScreenings.map(termin => {

                            const screeningDateObj = formatDateTime(termin.vorstellungsbeginn, false, true);

                            const jointTerminFilmGalleryCardPropValuesAsObj = {
                                screeningWeekday: screeningDateObj?.weekday ?? "",
                                screeningDate: screeningDateObj?.date ?? "",
                                screeningTime: screeningDateObj?.time ?? "",
                                tnr: termin.tnr,
                                terminBesonderheit: termin.besonderheit || undefined
                            };

                            // ***********
                            // here: sonderfarbe of termin always preceds against sonderfarbe of reihen
                            // maybe shift to backend
                            const sonderfarbeForTerminFilmGalleryCard = termin.sonderfarbe || selectSonderfarbeFromReihenOfTermin(termin);
                            // ***********

                            return (
                                <article key={termin.tnr} className="gallery-article-padding">
                                    {/*for programms of (multiple) films*/}
                                    {/***********************************/}
                                    {termin.titel ? ( // current implementation: when there is no titel of termin, then the list of mainfilms is empty! (to avoid unnecessary data traffic)
                                        <>
                                            <TerminFilmGalleryCard
                                                screeningSonderfarbe={sonderfarbeForTerminFilmGalleryCard || "pupille-glow"}
                                                // screeningSonderfarbe={termin.sonderfarbe || "pupille-glow"}

                                                bild={termin.bild || "default_film.jpg"}
                                                // bild={termin.bild || (termin.mainfilms[0]?.bild || null)} // i.e. if Programmbild is not present then take the Bild of the 1st mainfeature (when to the termin corresponding mainfeature exist)
                                                offsetImageInGallery={undefined} // // this prop expects undefined or a % number from 0% to 100%. 50% is default i.e. vertically centered, value>50% pushes the image up and value<50% pushes down

                                                titel={termin.titel}
                                                kurztext={termin.kurztext || null}

                                                hauptfilmFormat={undefined} // treatment with undefined (instead of null) here to have this prop be optional
                                                hauptfilmRegie={undefined} // treatment with undefined (instead of null) here to have this prop be optional
                                                hauptfilmJahr={undefined}
                                                hauptfilmLaufzeit={undefined}
                                                hauptfilmbesonderheit={undefined}

                                                {...jointTerminFilmGalleryCardPropValuesAsObj} // the rest of the props are spread here
                                            />
                                            {/*Display 1st reihe*/}
                                            {/*{termin.reihen  && termin.reihen[0].titel}*/}
                                        </>
                                    ) : (
                                        // this condition also holds true für Programmtermine, but it rather ensures that mainfilms[0] exist
                                        termin.mainfilms?.length > 0 && (
                                            <>
                                                {/*screening consists of 1 main film + shorts possibly*/}
                                                {/*****************************************************/}
                                                <TerminFilmGalleryCard
                                                    screeningSonderfarbe={sonderfarbeForTerminFilmGalleryCard || "pupille-glow"}
                                                    // screeningSonderfarbe={termin.sonderfarbe || "pupille-glow"}
                                                    // screeningSonderfarbe={termin.mainfilms[0]?.sonderfarbe || "pupille-glow"}

                                                    bild={termin.mainfilms[0]?.bild || "default_film.jpg"}
                                                    offsetImageInGallery={termin.mainfilms[0]?.offsetImageInGallery || undefined}

                                                    titel={termin.mainfilms[0]?.titel || null}
                                                    kurztext={termin.mainfilms[0]?.kurztext || null}

                                                    hauptfilmFormat={termin.mainfilms[0]?.format || undefined} // concise: filmFormat={termin.films[0]?.format || undefined}
                                                    hauptfilmRegie={termin.mainfilms[0]?.regie || undefined} // for regie treatment with undefined (instead of null) to have this prop be optional
                                                    hauptfilmJahr={termin.mainfilms[0]?.jahr}
                                                    hauptfilmLaufzeit={termin.mainfilms[0]?.laufzeit ?? undefined}
                                                    hauptfilmbesonderheit={termin.mainfilms[0]?.besonderheit || undefined}

                                                    {...jointTerminFilmGalleryCardPropValuesAsObj} // the rest of the props are spread here
                                                />
                                                {/*Display 1st reihe*/}
                                                {/*{Array.isArray(termin.reihen) && termin.reihen.length > 0 && termin.reihen[0].titel}*/}
                                            </>
                                        )
                                    )}
                                </article>
                            );
                        })}
                    </section>
                ) : (
                    <section>
                        <article>
                            <p className="text-center mt-4">Das neue Filmprogramm wird demnächst hier veröffentlicht.</p>
                        </article>
                    </section>
                )
            }
        </>
    );
}