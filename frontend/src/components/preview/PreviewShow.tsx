import TerminDTOWithFilmAndReiheDTOGallery from "../../types/TerminDTOWithFilmAndReiheDTOGallery.ts";
import styles from "./PreviewShow.module.css";
import {useEffect, useRef, useState} from "react";
import {formatDateTime} from "../../utils/formatDateTime.ts";
import TerminFilmPreviewCard from "./TerminFilmPreviewCard.tsx";

interface Props {
    selectedSemesterTermine: TerminDTOWithFilmAndReiheDTOGallery[];
    slideDuration: number;
    setShowPreview: (value: boolean) => void;
}

const FADE_DURATION = 2000; // 1000 = 1 second

const PreviewShow: React.FC<Props> = ({ selectedSemesterTermine, slideDuration, setShowPreview }) => {
    const [termineForSlides, setTermineForSlides] = useState(selectedSemesterTermine);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isFadingIn, setIsFadingIn] = useState(false);
    const [scale, setScale] = useState(1);
    const [isTopHovering, setIsTopHovering] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

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

    // Monitor mouse position for top hover bar
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (event.clientY <= 44) { // Top 44px of the screen
                setIsTopHovering(true);
            } else {
                setIsTopHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Handle click on top hover bar
    const handleTopBarClick = () => {
        setShowPreview(false);
    };

    // Auto-scale the card to fit the viewport
    useEffect(() => {
        function resizeCardToFit() {
            if (!containerRef.current || !contentRef.current || !cardRef.current) return;

            // Reset any previous scaling to get accurate measurements
            setScale(1);

            // Wait for DOM to update with scale=1
            setTimeout(() => {
                // Type assertion to handle the null check properly
                const container = containerRef.current as HTMLDivElement | null;
                const card = cardRef.current as HTMLDivElement | null;

                // Double-check refs are still valid after timeout
                if (!container || !card) return;

                const containerHeight = container.clientHeight;
                const cardHeight = card.offsetHeight;


                // overhaul here?!
                // Check if card is taller than container
                if (cardHeight > containerHeight * 0.96) {
                    const newScale = (containerHeight * 0.96) / cardHeight;
                    setScale(newScale);
                } else {
                    setScale(1);
                }
            }, 50);
        }

        // Run on mount and when currentIndex changes
        resizeCardToFit();

        // Add resize listener
        window.addEventListener('resize', resizeCardToFit);

        // Clean up
        return () => window.removeEventListener('resize', resizeCardToFit);
    }, [currentIndex]);

    if (termineForSlides.length === 0) {
        return (
            <div className={styles.slideshowContainer} ref={containerRef}>
                <h1>No screenings for preview &#128546;</h1>
            </div>
        );
    }

    const termin = termineForSlides[currentIndex];
    const screeningDateObj = formatDateTime(termin.vorstellungsbeginn, false, true);

    const screeningCardProps = {
        screeningWeekday: screeningDateObj?.weekday ?? '',
        screeningDate: screeningDateObj?.date ?? '',
        screeningTime: screeningDateObj?.time ?? '',
        offsetImageInGallery: undefined,
        tnr: termin.tnr,
    };

    return (
        <div className={styles.slideshowContainer} ref={containerRef}>
            {/* Top hover bar - now outside the card component and correctly positioned */}
            {isTopHovering && (
                <div
                    className={styles.topHoverBar}
                    onClick={handleTopBarClick}
                    role="button"
                    aria-label="Stop Preview"
                >
                    Click here to stop preview.
                </div>
            )}
            <div
                className={`${styles.slideshowContent} ${isFadingOut ? styles.fadeOut : ''} ${
                    isFadingIn ? styles.fadeIn : ''
                }`}
                ref={contentRef}
            >
                <div
                    ref={cardRef}
                    style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
                >
                    {termin.titel ? (
                        <TerminFilmPreviewCard
                            {...screeningCardProps}
                            screeningSonderfarbe="red-glow"
                            bild={termin.bild ?? null}
                            titel={termin.titel}
                            kurztext={termin.kurztext ?? null}
                            jahr={undefined}
                            besonderheit={termin.besonderheit ?? null}
                            filmFormat={undefined}
                            laufzeit={undefined}
                            regie={undefined}
                        />
                    ) : (
                        termin.mainfilms?.length > 0 && (
                            <TerminFilmPreviewCard
                                {...screeningCardProps}
                                screeningSonderfarbe="pupille-glow"
                                bild={termin.mainfilms[0]?.bild ?? null}
                                titel={termin.mainfilms[0]?.titel ?? null}
                                kurztext={termin.mainfilms[0]?.kurztext ?? null}
                                jahr={termin.mainfilms[0]?.jahr}
                                besonderheit={termin.mainfilms[0]?.besonderheit ?? null}
                                filmFormat={termin.mainfilms[0]?.format ?? undefined}
                                laufzeit={termin.mainfilms[0]?.laufzeit ?? undefined}
                                regie={undefined}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreviewShow;