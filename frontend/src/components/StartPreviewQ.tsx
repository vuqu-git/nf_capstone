import React, {useEffect, useState} from "react";
// import axios from "axios";
import styles from "./PreviewQ.module.css";
import {formatDateTime} from "../utils/formatDateTime.ts";
import TerminDTOWithFilmAndReiheDTOGallery from "../types/TerminDTOWithFilmAndReiheDTOGallery.ts";
import TerminFilmPreviewCard from "./preview/TerminFilmPreviewCard.tsx";
import { useLocation } from "react-router-dom";


const initialSlides: TerminDTOWithFilmAndReiheDTOGallery[] = [
    {
        "tnr": 850,
        "vorstellungsbeginn": "2025-05-16T19:00:00",
        "titel": null,
        "kurztext": null,
        "besonderheit": null,
        "bild": null,
        "sonderfarbe": null,
        "veroeffentlichen": 1,
        "mainfilms": [
            {
                "fnr": 1259,
                "titel": "Komponiertes Kino &ndash; Werkschau Johannes Kreidler",
                "kurztext": "In dem Filmen des Komponisten Johannes Kreidler wird das Komponieren zu einer multimedialen Arbeit mit Klang als Bild.",
                "besonderheit": "In Anwesenheit von Johannes Kreidler. Eine Kooperation mit der Frankfurter Gesellschaft f&uuml;r Neue Musik und dem Institut f&uuml;r Musikwissenschaft.",
                "bild": "Johannes_Kreidler.jpg",
                "jahr": null,
                "format": null,
                "laufzeit": 67
            }
        ]
    },
    {
        "tnr": 851,
        "vorstellungsbeginn": "2025-05-19T20:15:00",
        "titel": null,
        "kurztext": null,
        "besonderheit": null,
        "bild": null,
        "sonderfarbe": null,
        "veroeffentlichen": 1,
        "mainfilms": [
            {
                "fnr": 1260,
                "titel": "A Killer Romance",
                "kurztext": "Ein Collegeprofessor, der als Undercoverkiller arbeitet, verstrickt sich in ein gef&auml;hrliches Spiel aus L&uuml;gen und Begierde, als er sich in eine Auftraggeberin verliebt.",
                "besonderheit": null,
                "bild": "A_Killer-Romance.jpg",
                "jahr": 2023,
                "format": "DCP",
                "laufzeit": 116
            }
        ]
    },
    {
        "tnr": 852,
        "vorstellungsbeginn": "2025-05-21T20:15:00",
        "titel": null,
        "kurztext": null,
        "besonderheit": null,
        "bild": null,
        "sonderfarbe": null,
        "veroeffentlichen": 1,
        "mainfilms": [
            {
                "fnr": 1261,
                "titel": "Ich bin ein Elefant, Madame",
                "kurztext": "Peter Zadek inszeniert die Schule als Miniatur der Gesellschaft, in der die 68er f&uuml;r Umschwung und Unruhe sorgen. Voller anarchistischer Momente bringt der Film diesen Geist auf die Leinwand.",
                "besonderheit": null,
                "bild": "Ich_bin_ein_Elefant_Madame.jpg",
                "jahr": 1969,
                "format": "DCP",
                "laufzeit": 102
            }
        ]
    },
    {
        "tnr": 853,
        "vorstellungsbeginn": "2025-05-26T20:15:00",
        "titel": null,
        "kurztext": null,
        "besonderheit": null,
        "bild": null,
        "sonderfarbe": null,
        "veroeffentlichen": 1,
        "mainfilms": [
            {
                "fnr": 1262,
                "titel": "Der Schatz",
                "kurztext": "Zwei Filme &uuml;ber schatzsuchende V&auml;ter: eine lakonische Kom&ouml;die aus der rum&auml;nischen Nouvelle Vague, in der drei M&auml;nner aneinandergeraten und ein explosiver, englischer Kindergeburtstag.",
                "besonderheit": null,
                "bild": "Der_Schatz.jpg",
                "jahr": 2015,
                "format": "DCP",
                "laufzeit": 89
            }
        ]
    },
    {
        "tnr": 854,
        "vorstellungsbeginn": "2025-05-28T17:00:00",
        "titel": null,
        "kurztext": null,
        "besonderheit": null,
        "bild": null,
        "sonderfarbe": null,
        "veroeffentlichen": 1,
        "mainfilms": [
            {
                "fnr": 1263,
                "titel": "Hazy Life",
                "kurztext": "Das Japanische Filmfestival Nippon Connection wird 25 und kehrt am 29. Mai in die Pupille zur&uuml;ck, wo das Festival die ersten Jahre stattgefunden hat! Wir feiern das Jubil&auml;um mit drei Filmen der allerersten Festivalausgabe: Nobuhiro Yamashitas Hazy Life (1999), Toshiaki Toyodas Pornostar (1998) und Tetsuro Takeuchis Wild Zero (1999).",
                "besonderheit": "Im Rahmen von Nippon Connection Filmfestival. In Anwesenheit von Nobuhiro Yamashita. Tickets gibt es ab dem 3. Mai auf der Festivalwebseite: NipponConnection.com",
                "bild": "Hazy_Life.jpg",
                "jahr": 1999,
                "format": "16mm",
                "laufzeit": 84
            }
        ]
    },
    {
        "tnr": 855,
        "vorstellungsbeginn": "2025-05-28T19:15:00",
        "titel": null,
        "kurztext": null,
        "besonderheit": null,
        "bild": null,
        "sonderfarbe": null,
        "veroeffentlichen": 1,
        "mainfilms": [
            {
                "fnr": 1264,
                "titel": "Pornostar",
                "kurztext": null,
                "besonderheit": "Im Rahmen von Nippon Connection Filmfestival. In Anwesenheit von Toshiaki Toyoda. Tickets gibt es ab dem 3. Mai auf der Festivalwebseite: NipponConnection.com",
                "bild": "Pornostar.jpg",
                "jahr": 1998,
                "format": "35mm",
                "laufzeit": 98
            }
        ]
    },
    {
        "tnr": 856,
        "vorstellungsbeginn": "2025-05-28T21:30:00",
        "titel": null,
        "kurztext": null,
        "besonderheit": null,
        "bild": null,
        "sonderfarbe": null,
        "veroeffentlichen": 1,
        "mainfilms": [
            {
                "fnr": 1265,
                "titel": "Wild Zero",
                "kurztext": null,
                "besonderheit": "Im Rahmen von Nippon Connection Filmfestival. Tickets gibt es ab dem 3. Mai auf der Festivalwebseite: NipponConnection.com",
                "bild": "Wild_Zero.jpg",
                "jahr": 1999,
                "format": null,
                "laufzeit": 98
            }
        ]
    },
    {
        "tnr": 857,
        "vorstellungsbeginn": "2025-06-02T20:15:00",
        "titel": null,
        "kurztext": null,
        "besonderheit": null,
        "bild": null,
        "sonderfarbe": null,
        "veroeffentlichen": 1,
        "mainfilms": [
            {
                "fnr": 1266,
                "titel": "Einfach mal was Sch&ouml;nes",
                "kurztext": "Karla, kurz vor ihrem 40. Geburtstag, hat einen gro&szlig;en Wunsch: ein eigenes Kind. Da der passende Mann fehlt, beschlie&szlig;t sie, ihren Kinderwunsch allein in die Hand zu nehmen, doch ihre chaotische Familie und eine ungeplante Liebschaft wirbeln ihre Pl&auml;ne durcheinander.",
                "besonderheit": null,
                "bild": "Einfach_mal_was_Schoenes.jpg",
                "jahr": 2022,
                "format": "DCP",
                "laufzeit": 116
            }
        ]
    }

];

const FADE_DURATION = 1000; // 1000 = 1 second
const DEFAULT_SLIDE_DURATION = 10000; // 10 seconds

const StartPreviewQ: React.FC = () => {
    const [termineForSlides, setTermineForSlides] = useState<TerminDTOWithFilmAndReiheDTOGallery[]>(initialSlides);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isFadingIn, setIsFadingIn] = useState(false);

    const location = useLocation();


    // Parse query parameter duration
    const searchParams = new URLSearchParams(location.search);
    let slideDuration = DEFAULT_SLIDE_DURATION;
    const durationParam = searchParams.get("duration");
    if (
        durationParam !== null &&
        /^\d+$/.test(durationParam)
    ) {
        const durationSec = parseInt(durationParam, 10);
        if (durationSec >= 0) {
            slideDuration = durationSec * 1000;
        }
    }

    // Parse and validate query parameter next
    let nextLimit: number | undefined = undefined;
    const nextParam = searchParams.get("next");
    if (nextParam !== null && /^\d+$/.test(nextParam)) {
        const nextNum = parseInt(nextParam, 10);
        if (nextNum >= 0) {
            nextLimit = nextNum;
        }
    }

    // Parse query parameter skipfirst
    const skipFirst = searchParams.get("skipfirst") === "true";

    // useEffect(() => {
    //     axios
    //         .get<TerminDTOWithFilmDTOGallery[]>("/api/screenings")
    //         .then((response) => {
    //             let slides = response.data;
    //
    //             if (skipFirst) {
    //                 slides = slides.slice(1); // Remove first item if requested
    //             }
    //
    //             if (typeof nextLimit === "number") {
    //                 slides = slides.slice(0, nextLimit); // Safe even if nextLimit > slides.length
    //             }
    //
    //             setTermineForSlides(slides);
    //         })
    //         .catch((error) => {
    //             console.error("Failed to fetch slideshow data:", error);
    //         });
    // }, [nextLimit]);

    // this useEffect only for testing in-memory initialSlides (i.e. without fetching from API)
    useEffect(() => {
                let slides = initialSlides;
                if (skipFirst) {
                    slides = slides.slice(1); // Remove first item if requested
                }
                if (typeof nextLimit === "number") {
                    slides = slides.slice(0, nextLimit); // Safe even if nextLimit > slides.length
                }
                setTermineForSlides(slides);
    }, [nextLimit]);


    useEffect(() => {
        const interval = setInterval(() => {
            setIsFadingOut(true); // Start fade out
            setTimeout(() => {
                setCurrentIndex((prevIndex) =>
                    termineForSlides.length > 0 ? (prevIndex + 1) % termineForSlides.length : 0
                );
                setIsFadingOut(false);
                setIsFadingIn(true); // Start fade in
                setTimeout(() => {
                    setIsFadingIn(false);
                }, FADE_DURATION);
            }, FADE_DURATION);
        }, slideDuration);

        return () => clearInterval(interval);
    }, [termineForSlides, slideDuration]);

    if (termineForSlides.length === 0) {
        return <div className={styles.slideshowContainer}><h1>No screenings for preview &#128546;</h1></div>;
    }

    const termin = termineForSlides[currentIndex];
    const screeningDateObj = formatDateTime(termin.vorstellungsbeginn, false, false);

    const screeningCardProps = {
        screeningWeekday: screeningDateObj?.weekday ?? "",
        screeningDate: screeningDateObj?.date ?? "",
        screeningTime: screeningDateObj?.time ?? "",
        offsetImageInGallery: undefined, // instead of undefined, insert a number from 0 to 100. 50 is default i.e. vertically centered, value>50 pushes the image up and value<50 pushes down
        tnr: termin.tnr
    };

    return (
        <div className={styles.slideshowContainer}>
            <div
                className={
                    `${styles.slideshowContent} ` +
                    `${isFadingOut ? styles.fadeOut : ""} ` +
                    `${isFadingIn ? styles.fadeIn : ""}`
                }
            >
                {termin.titel ? (
                    <TerminFilmPreviewCard
                        {...screeningCardProps}
                        screeningSonderfarbe="red-glow"
                        bild={termin.bild || null}
                        titel={termin.titel}
                        kurztext={termin.kurztext || null}
                        jahr={undefined}
                        besonderheit={termin.besonderheit || null}
                        filmFormat={undefined} // for filmFormat treatment with undefined (instead of null)
                        laufzeit={undefined} // for filmFormat treatment with undefined (instead of null)
                        regie={undefined} // for regie treatment with undefined (instead of null)
                    />
                ) : (
                    termin.mainfilms?.length > 0 && (
                        <>
                            {/*screening consists of 1 main film + shorts possibly*/}
                            {/*****************************************************/}
                            <TerminFilmPreviewCard
                                {...screeningCardProps}
                                screeningSonderfarbe="pupille-glow"
                                bild={termin.mainfilms[0]?.bild || null}
                                titel={termin.mainfilms[0]?.titel || null}
                                kurztext={termin.mainfilms[0]?.kurztext || null}
                                jahr={termin.mainfilms[0]?.jahr}
                                besonderheit={termin.mainfilms[0]?.besonderheit || null}
                                filmFormat={termin.mainfilms[0]?.format || undefined}
                                laufzeit={termin.mainfilms[0]?.laufzeit ?? undefined}
                                regie={undefined} // for regie treatment with undefined (instead of null)
                            />
                        </>
                    )
                )}
            </div>
        </div>
    );

};

export default StartPreviewQ;


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// this variant has no transition effects
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// interface SlideshowProps {
//     slideDuration?: number;
// }

// const StartPreview: React.FC<SlideshowProps> = ({
//                                                  slideDuration = 5000,
//                                              }) => {
//     const [termineForSlides, setTermineForSlides] = useState<TerminDTOWithFilmDTOGallery[]>(initialSlides);
//     const [currentIndex, setCurrentIndex] = useState(0);
//
//     // useEffect(() => {
//     //     axios
//     //         .get<TerminDTOWithFilmDTOGallery[]>("/api/screenings"),
//     //         .then((response) => {
//     //             setSlides(response.data);
//     //         })
//     //         .catch((error) => {
//     //             console.error("Failed to fetch slideshow data:", error);
//     //         });
//     // }, []);
//
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentIndex((prevIndex) =>
//                 termineForSlides.length > 0 ? (prevIndex + 1) % termineForSlides.length : 0
//             );
//         }, slideDuration);
//
//         return () => clearInterval(interval);
//     }, [termineForSlides]);
//
//     if (termineForSlides.length === 0) {
//         return <div>Loading slideshow...</div>;
//     }
//
//     const termin = termineForSlides[currentIndex];
//     const screeningDateObj = formatDateTime(termin.vorstellungsbeginn, false, false);
//
//     const screeningCardProps = {
//         screeningWeekday: screeningDateObj?.weekday ?? "",
//         screeningDate: screeningDateObj?.date ?? "",
//         screeningTime: screeningDateObj?.time ?? "",
//         offsetImageInGallery: undefined, // instead of undefined, insert a number from 0 to 100. 50 is default i.e. vertically centered, value>50 pushes the image up and value<50 pushes down
//         tnr: termin.tnr
//     };
//
//     return (
//         <div className={styles.slideshowContainer}>
//             <div className={styles.slideshowContent}>
//
//                 {termin.titel ? (
//                     <TerminFilmGalleryCard
//                         {...screeningCardProps}
//                         screeningSonderfarbe="red-glow"
//                         bild={termin.bild || null}
//                         titel={termin.titel}
//                         kurztext={termin.kurztext || null}
//                         jahr={undefined}
//                         besonderheit={termin.besonderheit || null}
//                         filmFormat={undefined} // for filmFormat treatment with undefined (instead of null) to have this prop be optional
//                         laufzeit={undefined} // for filmFormat treatment with undefined (instead of null) to have this prop be optional
//                         regie={undefined} // for regie treatment with undefined (instead of null) to have this prop be optional
//                     />
//                 ) : (
//                     termin.films?.length > 0 && (
//                         <>
//                             {/*screening consists of 1 main film + shorts possibly*/}
//                             {/*****************************************************/}
//                             <TerminFilmGalleryCard
//                                 {...screeningCardProps}
//                                 screeningSonderfarbe="pupille-glow"
//                                 bild={termin.films[0]?.bild || null}
//                                 titel={termin.films[0]?.titel || null}
//                                 kurztext={termin.films[0]?.kurztext || null}
//                                 jahr={termin.films[0]?.jahr}
//                                 besonderheit={termin.films[0]?.besonderheit || null}
//                                 filmFormat={termin.films[0]?.format || undefined} // concise: filmFormat={termin.films[0]?.format || undefined}
//                                 laufzeit={termin.films[0]?.laufzeit ?? undefined}
//                                 regie={undefined} // for regie treatment with undefined (instead of null) to have this prop be optional
//                             />
//                         </>
//                     )
//                 )}
//             </div>
//         </div>
//
//     );
// };
//
// export default StartPreview;