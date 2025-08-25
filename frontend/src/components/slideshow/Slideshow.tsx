
import React, {useEffect, useState} from "react";
// import axios from "axios";
import TerminDTOWithFilmDTOSlideshow from "../../types/TerminDTOWithFilmDTOSlideshow.ts";
import styles from "./Slideshow.module.css";
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";
import {formatDateTime} from "../../utils/formatDateTime.ts";

const initialSlides: TerminDTOWithFilmDTOSlideshow[] = [
    {
        tnr: 850,
        vorstellungsbeginn: "2025-05-16T19:00:00",
        titel: null,
        kurztext: null,
        besonderheit: null,
        bild: null,
        sonderfarbe: null,
        veroeffentlichen: 1,
        mainfilms: [
            {
                titel: "Komponiertes Kino – Werkschau Johannes Kreidler",
                originaltitel: null,
                originaltitelAnzeigen: null,
                text: "Lorem ipsum",
                kurztext: "In dem Filmen des Komponisten Johannes Kreidler wird das Komponieren zu einer multimedialen Arbeit mit Klang als Bild.",
                besonderheit: "In Anwesenheit von Johannes Kreidler. Eine Kooperation mit der Frankfurter Gesellschaft für Neue Musik und dem Institut für Musikwissenschaft.",
                land: null,
                jahr: null,
                farbe: null,
                laufzeit: null,
                sprache: null,
                untertitel: null,
                format: null,
                fsk: null,
                stab: null,
                bild: "Johannes_Kreidler.jpg",
                sonderfarbeTitel: null,
                sonderfarbe: null,
                trailer: "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube-nocookie.com/embed/IVqj-KKdiQo?si=Z2vdc3RS38gMZoyN&autoplay=1&mute=1&modestbranding=1\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
            }
        ]
    },
    {
        tnr: 851,
        vorstellungsbeginn: "2025-05-19T20:15:00",
        titel: null,
        kurztext: null,
        besonderheit: null,
        bild: null,
        sonderfarbe: null,
        veroeffentlichen: 1,
        mainfilms: [
            {
                titel: "A Killer Romance",
                originaltitel: "Hit Man",
                originaltitelAnzeigen: null,
                text: "Lorem ipsum",
                kurztext: "Ein Collegeprofessor, der als Undercoverkiller arbeitet, verstrickt sich in ein gefährliches Spiel aus Lügen und Begierde, als er sich in eine Auftraggeberin verliebt.",
                besonderheit: null,
                land: "USA",
                jahr: 2023,
                farbe: "Farbe",
                laufzeit: 116,
                sprache: "eng",
                untertitel: "deu",
                format: "DCP",
                fsk: null,
                stab: "R: Richard Linklater\nB: Richard Linklater, Glen Powell nach Skip Hollandsworth\nK: Shane F. Kelly\nS: Sandra Adair\nM: Dr. John, Allen Toussaint u.a.\nD: Glen Powell, Adria Arjona, Austin Amelio, Retta, Sanjay Rao, Molly Bernard u.a.\nV: Leonine",
                bild: "A_Killer-Romance.jpg",
                sonderfarbeTitel: null,
                sonderfarbe: null,
                trailer: "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube-nocookie.com/embed/9a7C7Bxsm90?si=XWsDDVg1aVJtibxD&autoplay=1&mute=1&modestbranding=1\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
}
        ]
    },
    // ... alle weiteren Vorstellungen analog ...
];

interface SlideshowProps {
    slideDuration?: number;
}

const Slideshow: React.FC<SlideshowProps> = ({
                                                 slideDuration = 15000,
                                             }) => {
    const [termineForSlides, setTermineForSlides] = useState<TerminDTOWithFilmDTOSlideshow[]>(initialSlides);
    const [currentIndex, setCurrentIndex] = useState(0);

    // useEffect(() => {
    //     axios
    //         .get<TerminDTOWithFilmDTOSlideshow[]>("/api/screenings/slideshow")
    //         .then((response) => {
    //             setSlides(response.data);
    //         })
    //         .catch((error) => {
    //             console.error("Failed to fetch slideshow data:", error);
    //         });
    // }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                termineForSlides.length > 0 ? (prevIndex + 1) % termineForSlides.length : 0
            );
        }, slideDuration);

        return () => clearInterval(interval);
    }, [termineForSlides]);

    if (termineForSlides.length === 0) {
        return <div>Loading slideshow...</div>;
    }

    const termin = termineForSlides[currentIndex];
    const screeningDateObj = formatDateTime(termin.vorstellungsbeginn, false, false);

    return (
        <div className={styles.slideshowContainer}>
            {/*<h2*/}
            {/*    className={styles.slideshowTitle}*/}
            {/*    style={{ color: slide.sonderfarbe ? `#${slide.sonderfarbe.toString(16)}` : undefined }}*/}
            {/*>*/}
            {/*    {slide.titel}*/}
            {/*</h2>*/}
            {/*{slide.bild && (*/}
            {/*    <img className={styles.slideshowImage} src={slide.bild} alt={slide.titel || "Slide"} />*/}
            {/*)}*/}
            {/*{slide.besonderheit && <p className={styles.slideshowText}>{slide.besonderheit}</p>}*/}

            {termin.vorstellungsbeginn && (
                <div className={styles.screeningDate}>
                    {screeningDateObj?.weekday} | {screeningDateObj?.date} | {screeningDateObj?.time}
                </div>
            )}

            {termin.mainfilms[0].titel && (
                <div className={styles.filmTitle}>
                    {renderHtmlText(termin.mainfilms[0].titel)}
                </div>
            )}

            {(termin.mainfilms[0]?.regie || termin.mainfilms[0]?.jahr || termin.mainfilms[0]?.laufzeit) &&
                <div className={styles.filmMeta}>
                    {[
                        termin.mainfilms[0]?.regie,
                        termin.mainfilms[0]?.jahr,
                        termin.mainfilms[0]?.laufzeit !== undefined ? termin.mainfilms[0]?.laufzeit + " Min." : undefined
                    ].filter(Boolean).join(', ')}
                </div>
            }

            {/*{termin.mainfilms[0].text && (*/}
            {/*    <div className={styles.filmText}>*/}
            {/*        {renderHtmlText(termin.mainfilms[0].text)}*/}
            {/*    </div>*/}
            {/*)}*/}

            {termin.mainfilms[0].trailer && (
                <div className={styles.filmTrailer}>
                    {renderHtmlText(termin.mainfilms[0].trailer)}
                </div>
            )}

            {termin.mainfilms[0].kurztext && (
                <div className={styles.filmShortText}>
                    {renderHtmlText(termin.mainfilms[0].kurztext)}
                </div>
            )}

            {termin.mainfilms[0].besonderheit && (
                <div className={styles.filmSpecial}>
                    {renderHtmlText(termin.mainfilms[0].besonderheit)}
                </div>
            )}
        </div>
    );
};

export default Slideshow;
