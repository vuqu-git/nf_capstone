import { useLoaderData } from "react-router-dom";
import { useState } from "react";

import {Badge, Form, Stack} from "react-bootstrap";
import Button from "react-bootstrap/Button";

import TerminDTOWithFilmAndReiheDTOGallery from "../../types/TerminDTOWithFilmAndReiheDTOGallery.ts";

import OverviewAndFormLayout from "../LayoutWrapper/OverviewAndFormLayout.tsx";

import PreviewShow from "../preview/PreviewShow.tsx";
import Header2 from "../structural_components/Header2.tsx";

import PreviewFormWithinSlides from "../preview/PreviewFormWithinSlides.tsx";
import IdentSlideFaintGradient from "./IdentSlideFaintGradient.tsx";
import IdentSlideDotGrid from "./IdentSlideDotGrid.tsx";
import IdentSlideGradient from "./IdentSlideGradient.tsx";
import IdentSlideChromaticLogo from "./IdentSlideChromaticLogo.tsx";

export default function Slides() {
    const [mode, setMode] = useState<"menu" | "identSlideFaintGradient" | "identSlideDotGrid" | "identSlideGradient" | "identSlideChromaticLogo" | "identSlideWithLetterbox" | "preview">("menu");

    const semesterTermine = useLoaderData<TerminDTOWithFilmAndReiheDTOGallery[]>();

    const [selectedTnrs, setSelectedTnrs] = useState<number[]>([]);
    const [slideDuration, setSlideDuration] = useState<number>(20);
    const [showPreview, setShowPreview] = useState<boolean>(false);

    const [letterboxHeight, setLetterboxHeight] = useState<string | number>("20%");
    const [selectedTheme, setSelectedTheme] = useState<"faintGradient" | "gradient" | "dotGrid" | "chromatic">("gradient");

    // Reset preview state when leaving preview mode
    const handleBack = () => {
        setShowPreview(false);
        setMode("menu");
    };

    // Helper function to handle input change
    const handleLetterboxHeightChange = (value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && value === numValue.toString()) {
            setLetterboxHeight(numValue);
        } else {
            setLetterboxHeight(value);
        }
    };

    // Helper to launch slide with theme
    const launchSlide = (theme: typeof selectedTheme, withLetterbox: boolean = false) => {
        setSelectedTheme(theme);

        // setMode(
        //     withLetterbox
        //         ? "identSlideWithLetterbox"
        //         : theme === "faintGradient"
        //             ? "identSlideFaintGradient"
        //             : theme === "gradient"
        //                 ? "identSlideGradient"
        //                 : theme === "dotGrid"
        //                     ? "identSlideDotGrid"
        //                     : "identSlideChromaticLogo"
        // );

        let newMode: "menu" | "identSlideFaintGradient" | "identSlideDotGrid" | "identSlideGradient" | "identSlideChromaticLogo" | "identSlideWithLetterbox" | "preview";
        newMode = "menu"
        if (withLetterbox) {
            newMode = "identSlideWithLetterbox";
        } else if (theme === "faintGradient") {
            newMode = "identSlideFaintGradient";
        } else if (theme === "gradient") {
            newMode = "identSlideGradient";
        } else if (theme === "dotGrid") {
            newMode = "identSlideDotGrid";
        } else if (theme === "chromatic") {
            newMode = "identSlideChromaticLogo";
        }

        setMode(newMode);
    };

    switch (mode) {
        // -- Idle slides
        case "identSlideFaintGradient":
            return (
                <section>
                    <IdentSlideFaintGradient onBack={handleBack} letterboxHeight={0} />
                </section>
            );
        case "identSlideGradient":
            return (
                <section>
                    <IdentSlideGradient onBack={handleBack} letterboxHeight={0} />
                </section>
            );
        case "identSlideDotGrid":
            return (
                <section>
                    <IdentSlideDotGrid onBack={handleBack} letterboxHeight={0} />
                </section>
            );
        case "identSlideChromaticLogo":
            return (
                <section>
                    <IdentSlideChromaticLogo onBack={handleBack} letterboxHeight={0} />
                </section>
            );
        // -- Slides with letterbox
        case "identSlideWithLetterbox":
            return (
                <section>
                    {selectedTheme === "faintGradient" && <IdentSlideFaintGradient onBack={handleBack} letterboxHeight={letterboxHeight} />}
                    {selectedTheme === "gradient" && <IdentSlideGradient onBack={handleBack} letterboxHeight={letterboxHeight} />}
                    {selectedTheme === "dotGrid" && <IdentSlideDotGrid onBack={handleBack} letterboxHeight={letterboxHeight} />}
                    {selectedTheme === "chromatic" && <IdentSlideChromaticLogo onBack={handleBack} letterboxHeight={letterboxHeight} />}
                </section>
            );
        // -- Slides for preview
        case "preview":
            return (
                <section>
                    {!showPreview ? (
                        <PreviewFormWithinSlides
                            semesterTermine={semesterTermine}
                            selectedTnrs={selectedTnrs}
                            setSelectedTnrs={setSelectedTnrs}
                            slideDuration={slideDuration}
                            setSlideDuration={setSlideDuration}
                            setShowPreview={setShowPreview}
                            handleBack={handleBack}
                        />
                    ) : (
                        <PreviewShow
                            selectedSemesterTermine={semesterTermine.filter(termin => selectedTnrs.includes(termin.tnr))}
                            slideDuration={slideDuration * 1000}
                            setShowPreview={setShowPreview}
                        />
                    )}
                </section>
            );
        default:
            return (
                <div className="app-container">
                    <Header2 />

                    <OverviewAndFormLayout>
                        <section>
                            <h1>Holding slides</h1>

                            <h3 className="mt-3">Anmerkungen</h3>
                            <p>Im Firefox und Edge Browser ist das Aktivieren sowie Deaktivieren der <b>kompletten</b> Vollbildansicht (ohne jegliche Menüs und Leisten, d.h. complete full screen - kiosk-like) mit der Taste F11 möglich.</p>
                            <p>Wenn nach F11-Klick im Firefox die Toolbar (mit Adressleiste, Suche etc.) noch zu sehen ist, dann Right-click on any empty space on the toolbar and select "Hide Toolbars".</p>

                            <Badge bg="danger" className="mt-3">Hinweis:</Badge>
                            <p>Während der Slideshow den Cursor zum oberen Bildrand bewegen für Beendigung.</p>

                            <h3 className="mt-3">Idle screen with Pupille logo</h3>

                            <Stack gap={3} className="mb-3" direction="vertical">
                                <Button
                                    variant="info"
                                    className="align-self-start"
                                    onClick={() => setMode("identSlideFaintGradient")}
                                >
                                    theme: faint gradient yellow/orange
                                </Button>
                                <Button
                                    variant="info"
                                    className="align-self-start"
                                    onClick={() => setMode("identSlideGradient")}
                                >
                                    theme: gradient sundown + waves
                                </Button>
                                <Button
                                    variant="info"
                                    className="align-self-start"
                                    onClick={() => setMode("identSlideDotGrid")}
                                >
                                    theme: luminescent dot grid
                                </Button>
                                <Button
                                    variant="info"
                                    className="align-self-start"
                                    onClick={() => setMode("identSlideChromaticLogo")}
                                >
                                    theme: chromatic logo
                                </Button>
                            </Stack>

                            <h3 className="mt-3">Q&A screen with Pupille logo and bottom letterbox</h3>

                            {/* Letterbox Height Form Field */}
                            <Form.Group className="mb-3" data-bs-theme="dark">
                                <Form.Label htmlFor="letterboxHeightInput">
                                    Bottom letterbox height e.g. 25% or 20vh or 300 (i.e. 300 pixel):
                                </Form.Label>
                                <div className="d-flex gap-2 mb-2">
                                    <Form.Control
                                        id="letterboxHeightInput"
                                        type="text"
                                        value={letterboxHeight}
                                        onChange={(e) => handleLetterboxHeightChange(e.target.value)}
                                        placeholder="e.g., 20%, 150, 15vh"
                                        style={{ maxWidth: '100px' }}
                                    />
                                </div>

                                <Form.Text className="text-muted">
                                    Current value with unit: {typeof letterboxHeight === 'number' ? `${letterboxHeight}px` : letterboxHeight}
                                </Form.Text>
                            </Form.Group>

                            <Stack gap={3} className="mb-3" direction="vertical">
                                <Button
                                    variant="outline-info"
                                    className="align-self-start"
                                    onClick={() => launchSlide("faintGradient", true)}
                                >
                                    letterbox & theme: faint gradient yellow/orange
                                </Button>
                                <Button
                                    variant="outline-info"
                                    className="align-self-start"
                                    onClick={() => launchSlide("gradient", true)}
                                >
                                    letterbox & theme: gradient sundown + waves
                                </Button>
                                <Button
                                    variant="outline-info"
                                    className="align-self-start"
                                    onClick={() => launchSlide("dotGrid", true)}
                                >
                                    letterbox & theme: luminescent dot grid
                                </Button>
                                <Button
                                    variant="outline-info"
                                    className="align-self-start"
                                    onClick={() => launchSlide("chromatic", true)}
                                >
                                    letterbox & theme: chromatic logo
                                </Button>
                            </Stack>

                            <h3 className="mt-3">Preview of upcoming films</h3>
                            <Button variant="primary" onClick={() => setMode("preview")}>
                                Setup preview slides
                            </Button>
                        </section>
                    </OverviewAndFormLayout>
                </div>
            );
    }
}
