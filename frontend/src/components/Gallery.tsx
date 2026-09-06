import {useState, useEffect} from "react";
import {News} from "../types/News.ts";

import axios from "axios";
import NewsCard from "./news/NewsCard.tsx";
import {useAllNews} from "../hooks/useAllNews.ts";
import TerminDTOWithFilmAndReiheDTOGallery from "../types/TerminDTOWithFilmAndReiheDTOGallery.ts";

import { formatDateTime } from '../utils/formatDateTime.ts';
import TerminFilmGalleryCard from "./termine/TerminFilmGalleryCard.tsx";

import './Gallery.css';

export default function Gallery() {

    const {
        setError,
    } = useAllNews(false);

    const [validNews, setValidNews] = useState<News[]>([]);
    const [isLoadingNews, setIsLoadingNews] = useState(false);
    const [isLoadingScreenings, setIsLoadingScreenings] = useState(false);


    const getValidNews = () => {
        setIsLoadingNews(true);

        axios.get("/api/news/valid")
            .then((response) => {
                setValidNews(response.data)
            })
            .catch((error) => {
                const errorMessage =
                    error instanceof Error ? error.message : "Fetching valid news failed";
                setError(errorMessage);
            })
            .finally(() => {
                setIsLoadingNews(false);
        });
    }

    const [screeningGalleryEntries, setScreeningGalleryEntries] = useState<TerminDTOWithFilmAndReiheDTOGallery[]>([]);

    const getScreeningGalleryEntries = () => {
        setIsLoadingScreenings(true);

        axios.get("api/screenings")
            .then((response) => {
                setScreeningGalleryEntries(response.data)
            })
            .catch((error) => {
                const errorMessage =
                    error instanceof Error ? error.message : "Fetching TerminDTOWithFilmDTOGallery Gallery Entries failed";
                setError(errorMessage);
            })
            .finally(() => {
                setIsLoadingScreenings(false);
            });
    }

    useEffect(() => {
        getValidNews();
        getScreeningGalleryEntries();
    }, [])

    const [readyToRender, setReadyToRender] = useState(false);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // scroll tracking logic
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    useEffect(() => {
        const saveScrollPosition = () => {
            // Only store if user has scrolled down s, not on every scroll event (including those at 0)
            if (window.scrollY > 0) { // this is really important!!!
                sessionStorage.setItem('overviewScroll', window.scrollY.toString());
                console.log("Saved Y-position:", window.scrollY);
            }
        };

        // const saveScrollPosition = () => {
        //     if (window.scrollY === 0) {
        //         // User scrolled to top, save 0
        //         sessionStorage.setItem('overviewScroll', '0');
        //         console.log("Saved Y-position: 0");
        //             // Only store if user(!) has scrolled down, not on every scroll event (including those at 0)
        //     } else if (window.scrollY > 0) { // this is really important!!!
        //         // User(!) scrolled down, save current position
        //         sessionStorage.setItem('overviewScroll', window.scrollY.toString());
        //         console.log("Saved Y-position:", window.scrollY);
        //     }
        // };

        window.addEventListener('scroll', saveScrollPosition);

        return () => {
            window.removeEventListener('scroll', saveScrollPosition);
        };
    }, []);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // scroll restoration logic
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // useEffect(() => {
    //     const storedY = sessionStorage.getItem('overviewScroll');
    //
    //     if (!isLoadingNews && !isLoadingScreenings) {
    //         const scrollY = storedY ? parseInt(storedY) : 0;
    //
    //         // Delay until DOM height is long enough to scroll
    //         const checkAndScroll = () => {
    //             if (document.body.scrollHeight < scrollY + window.innerHeight) {
    //                 // Wait a bit and try again
    //                 setTimeout(checkAndScroll, 50);
    //                 return;
    //             }
    //
    //             // Now it's safe to scroll
    //             window.scrollTo(0, scrollY);
    //
    //             // Now reveal the page
    //             setReadyToRender(true);
    //         };
    //
    //         checkAndScroll();
    //     }
    // }, [isLoadingNews, isLoadingScreenings]);

    useEffect(() => {
        const storedY = sessionStorage.getItem('overviewScroll');

        if (!isLoadingNews && !isLoadingScreenings) {
            const scrollY = storedY ? parseInt(storedY) : 0;

            const checkAndScroll = () => {
                if (document.body.scrollHeight < scrollY + window.innerHeight) {
                    setTimeout(checkAndScroll, 50);
                    return;
                }

                // Smooth scroll here
                window.scrollTo({
                    top: scrollY,
                    behavior: 'smooth',
                });

                // Optional: delay reveal just a bit to match scroll speed
                setTimeout(() => setReadyToRender(true), 350); // Adjust if needed
            };

            checkAndScroll();
        }
    }, [isLoadingNews, isLoadingScreenings]);

    return (
        // <div style={{ visibility: readyToRender ? 'visible' : 'hidden' }}>

        // adjust the time duration here if needed
        <div style={{
            opacity: readyToRender ? 1 : 0,
            transition: 'opacity 0.4s ease-in-out'
        }}>
            <section>
                {
                    validNews && screeningGalleryEntries && (
                        <>
                            {/*<h3 style={{paddingTop: '2rem', paddingBottom: '2rem'}}>Neuigkeiten</h3>*/}
                            {validNews.map(n => (
                                <NewsCard key={n.id} variant={n.newsVariant} text={n.text} imageUrl={n.image}/>
                            ))
                            }
                        </>
                    )
                }
            </section>

            <section>
                {
                    validNews && screeningGalleryEntries && (
                        <>
                            {/*<h3>Programm</h3>*/}
                            {screeningGalleryEntries
                                .filter(termin => termin.finalVeroeffentlichen)
                                .map(termin => {
                                    // Add logic here

                                    const screeningDateObj = formatDateTime(termin.vorstellungsbeginn, false, true);

                                    if (termin.titel) {
                                        return (
                                            <div
                                                key={termin.tnr}
                                                style={{
                                                    paddingTop: "1.5rem",
                                                    paddingBottom: "1.5rem"
                                                }}
                                            >
                                                {/*for programms of (multiple) films*/}
                                                {/***********************************/}
                                                <TerminFilmGalleryCard
                                                    screeningWeekday={screeningDateObj ? screeningDateObj.weekday : null}
                                                    screeningDate={screeningDateObj ? screeningDateObj.date : null}
                                                    screeningTime={screeningDateObj ? screeningDateObj.time : null}
                                                    screeningSonderfarbe={"red-glow"}
                                                    // bild={termin.films[0]?.bild ? termin.films[0]?.bild : null}
                                                    bild={termin.bild ? termin.bild : null}
                                                    offsetImageInGallery={undefined} // // instead of undefined, insert a number from 0 to 100. 50 is default i.e. vertically centered, value>50 pushes the image up and value<50 pushes down
                                                    titel={termin.titel}
                                                    kurztext={termin.kurztext ? termin.kurztext : null}
                                                    hauptfilmJahr={undefined}
                                                    hauptfilmbesonderheit={termin.besonderheit ? termin.besonderheit : undefined}
                                                    hauptfilmFormat={undefined} // for filmFormat treatment with undefined (instead of null) to have this prop be optional
                                                    hauptfilmLaufzeit={undefined}
                                                    hauptfilmRegie={undefined}

                                                    tnr={termin.tnr} // for navigation to certain route
                                                    terminBesonderheit={undefined}
                                                    terminIsCanceled={undefined}                                                />
                                            </div>
                                        );
                                    } else if (termin.mainfilms?.length > 0) {
                                        return (
                                            <div
                                                key={termin.tnr}
                                                style={{
                                                    paddingTop: "1.5rem",
                                                    paddingBottom: "1.5rem"
                                                }}
                                            >
                                                {/*screening consists of 1 main film + shorts possibly*/}
                                                {/*****************************************************/}
                                                <TerminFilmGalleryCard
                                                    screeningWeekday={screeningDateObj ? screeningDateObj.weekday : ""}
                                                    screeningDate={screeningDateObj ? screeningDateObj.date : ""}
                                                    screeningTime={screeningDateObj ? screeningDateObj.time : ""}
                                                    screeningSonderfarbe={"pupille-glow"}
                                                    bild={termin.mainfilms[0]?.bild ? termin.mainfilms[0]?.bild : null}
                                                    offsetImageInGallery={undefined} // instead of undefined, insert a number from 1 to 100. 50 is default i.e. vertically centered, value>50 pushes the image up and value<50 pushes down
                                                    titel={termin.mainfilms[0]?.titel ? termin.mainfilms[0]?.titel : null}
                                                    kurztext={termin.mainfilms[0]?.kurztext ? termin.mainfilms[0]?.kurztext : null}
                                                    hauptfilmJahr={termin.mainfilms[0]?.jahr}
                                                    hauptfilmbesonderheit={termin.mainfilms[0]?.besonderheit ? termin.mainfilms[0]?.besonderheit : undefined}
                                                    hauptfilmFormat={termin.mainfilms[0]?.format ? termin.mainfilms[0]?.format : undefined} // for filmFormat treatment with undefined (instead of null) to have this prop be optional
                                                    hauptfilmLaufzeit={undefined}
                                                    hauptfilmRegie={undefined}

                                                    tnr={termin.tnr} // for navigation to certain route
                                                    terminBesonderheit={undefined}
                                                    terminIsCanceled={undefined}                                                />
                                            </div>
                                        );
                                    }
                                    return null; // Add a default return to handle cases where neither condition is met
                                })}
                        </>
                    )
                }
            </section>
        </div>
    );
}