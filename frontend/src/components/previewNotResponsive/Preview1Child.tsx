import TerminDTOWithFilmAndReiheDTOGallery from "../../types/TerminDTOWithFilmAndReiheDTOGallery.ts";
import styles from "../PreviewQ.module.css";
import {useEffect, useState} from "react";
import {formatDateTime} from "../../utils/formatDateTime.ts";
import TerminFilmPreviewCard from "../preview/TerminFilmPreviewCard.tsx";

interface Preview1ChildProps {
    selectedSemesterTermine: TerminDTOWithFilmAndReiheDTOGallery[];
    slideDuration: number;
    setShowPreview: (value: boolean) => void;
}

const FADE_DURATION = 2000; // 1000 = 1 second

const Preview1Child: React.FC<Preview1ChildProps> = ({ selectedSemesterTermine, slideDuration, setShowPreview }) => {
    const [termineForSlides, setTermineForSlides] = useState<TerminDTOWithFilmAndReiheDTOGallery[]>(selectedSemesterTermine);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isFadingIn, setIsFadingIn] = useState(false);

    useEffect(() => {
        setTermineForSlides(selectedSemesterTermine); // Update when selectedObjects prop changes
    }, [selectedSemesterTermine]);

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
    }, [slideDuration, termineForSlides]); // Include termineForSlides in dependency array

    if (termineForSlides.length === 0) {
        return (
            <div className={styles.slideshowContainer}>
                <h1>No screenings for preview &#128546;</h1>
            </div>
        );
    }

    const termin = termineForSlides[currentIndex];
    const screeningDateObj = formatDateTime(termin.vorstellungsbeginn, false, false);

    const screeningCardProps = {
        screeningWeekday: screeningDateObj?.weekday ?? '',
        screeningDate: screeningDateObj?.date ?? '',
        screeningTime: screeningDateObj?.time ?? '',
        offsetImageInGallery: undefined, // instead of undefined, insert a number from 0 to 100. 50 is default i.e. vertically centered, value>50 pushes the image up and value<50 pushes down
        tnr: termin.tnr,
    };

    return (
        <div className={styles.slideshowContainer}>
            <div
                className={`${styles.slideshowContent} ${isFadingOut ? styles.fadeOut : ''} ${
                    isFadingIn ? styles.fadeIn : ''
                }`}
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

export default Preview1Child;