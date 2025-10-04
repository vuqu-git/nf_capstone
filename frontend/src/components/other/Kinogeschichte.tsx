import './NomalContent.css';
import {Accordion, Carousel, CarouselItem} from "react-bootstrap";
import styles from './Kinogeschichte.module.css';
import {useState} from "react";

import {ColumnsPhotoAlbum, RowsPhotoAlbum} from "react-photo-album";
import "react-photo-album/rows.css";
import "react-photo-album/columns.css";

import Lightbox, {TeaserVimeoSlide, Slide} from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import {Fullscreen, Zoom, Slideshow, Captions, Inline} from "yet-another-react-lightbox/plugins";

import "yet-another-react-lightbox/plugins/captions.css";
import {staticFilePathFrontend} from "../../utils/config.ts";
import {useLoaderData} from "react-router-dom";
import {OtherDataValuesMap} from "../../types/OtherDataValuesMap.ts";


declare module "yet-another-react-lightbox" {
    export interface TeaserVimeoSlide extends GenericSlide {
        type: "teaser-vimeo";
    }

    interface SlideTypes {
        "teaser-vimeo": TeaserVimeoSlide;
    }
}

function isTeaserVimeoSlide(slide: Slide): slide is TeaserVimeoSlide {
    return slide.type === "teaser-vimeo";
}

const path = staticFilePathFrontend + "bilder/kinogeschichte"

const photosLogo = [
    { src: path + "/1952_Film_Studio.svg", width: 900, height: 300, description: "1952 Film Studio" },
    { src: path + "/1973_Pupille_Logo.svg", width: 900, height: 303, description: "1973 Pupille Logo" },
    { src: path + "/1975_Pupille_Logo.svg", width: 900, height: 210, description: "1975 Pupille Logo" },
    { src: path + "/1992_Schoene_Neue_Welt_Logo.svg", width: 900, height: 183, description: "1992 Schöne Neue Welt Logo" },
    { src: path + "/1992_Pupille_Logo.svg", width: 900, height: 420, description: "1992 Pupille Logo" },
];

const photosA = [
    { src: path + "/1952_Pupille_Nr_1.jpg", width: 1491, height: 1080, description: "1952 Pupille Nr 1"},
    { src: path + "/1953_Studierende_am_Projektor.jpg", width: 1437, height: 1430, description: "1953 Studierende am Projektor" },
    { src: path + "/1950er_Hoersaal_H_Juegelhaus.jpg", width: 1500, height: 964, description: "1950er Hoersaal H Juegelhaus" },
];

const photosB = [
    { src: path + "/1963_Heftcover_10_Jahre_Filmstudio.jpg", width: 1500, height: 1098, description: "1963 Heftcover 10 Jahre Filmstudio" },
    { src: path + "/1963_Agitationsfilm_Frankfurt_63.jpg", width: 1500, height: 1134, description: "1963 Agitationsfilm Frankfurt 63" },
];

const photosC = [
    { src: path + "/1979_Pupille_Programmheft_Schwule_im_Film.jpg", width: 1500, height: 1481, description: "1979 Pupille Programmheft Schwule im Film" },
    { src: path + "/1978_Poster_Reduipers_mit_Pupille_Aufkleber.jpg", width: 1500, height: 2124, description: "1978 Poster Reduipers mit Pupille Aufkleber" },
    { src: path + "/1989_Camera_Die_Fremde_Sehen_01.jpg", width: 1500, height: 2107, description: "1989 Camera Die Fremde Sehen" },
    { src: path + "/1989_Innenraum_Camera.jpg", width: 1500, height: 1029, description: "1989 Innenraum Camera" },
];

const photosD = [
    { src: path + "/2017_Pupille.jpg", width: 1080, height: 1350, description: "2017 Pupille" },
    { src: path + "/2023_Ansicht_in_die_Ausstellung_01.jpg", width: 1500, height: 999, description: "2023 Ansicht in die Ausstellung 1" },
    { src: path + "/2023_Ansicht_in_die_Ausstellung_02.jpg", width: 1500, height: 999, description: "2023 Ansicht in die Ausstellung 2" },
];


export default function Kinogeschichte() {

    const [indexL, setIndexL] = useState(-1);
    const [indexA, setIndexA] = useState(-1);
    const [indexB, setIndexB] = useState(-1);
    const [indexC, setIndexC] = useState(-1);
    const [indexD, setIndexD] = useState(-1);

    const [open, setOpen] = useState(false);

    const valuesMap = useLoaderData<OtherDataValuesMap>();

    return (
        <article className="normal-content-container">
            {/*----------------------*/}
            {/* row album with logos */}
            {/*----------------------*/}
            {/*<RowsPhotoAlbum*/}
            {/*    photos={photosLogo}*/}
            {/*    targetRowHeight={80}*/}
            {/*    // rowConstraints={{ singleRowMaxHeight: 250 }}*/}

            {/*    onClick={({index}) => setIndexL(index)}*/}
            {/*    componentsProps={() => ({*/}
            {/*        image: {*/}
            {/*            className: styles.photoAlbumLogo,*/}
            {/*        },*/}
            {/*    })}*/}
            {/*/>*/}
            {/*<Lightbox*/}
            {/*    slides={photosLogo}*/}
            {/*    open={indexL >= 0}*/}
            {/*    index={indexL}*/}
            {/*    close={() => setIndexL(-1)}*/}
            {/*    // enable optional lightbox plugins*/}
            {/*    plugins={[Captions, Fullscreen, Slideshow]}*/}
            {/*    captions={{descriptionTextAlign: "center", descriptionMaxLines: 1}}*/}
            {/*    styles={ {slide: {backgroundColor: "dimgrey"}} }*/}
            {/*/>*/}


            {/*---------------------*/}
            {/* carousel with logos */}
            {/*---------------------*/}
            <Lightbox
                slides={photosLogo}
                open={indexL >= 0}
                index={indexL}
                close={() => setIndexL(-1)}
                // enable optional lightbox plugins
                plugins={[Captions, Fullscreen, Slideshow, Inline]}
                captions={{descriptionTextAlign: "center", showToggle: true, hidden: true}}
                inline={{
                    style: {width: "100%", maxHeight: "130px", aspectRatio: "5 / 2"},
                }}
                slideshow={{autoplay: true,}}
                styles={ {slide: {backgroundColor: "grey", borderRadius: "10px"}} }
            />

            <p className="mt-4">
                Die Geschichte studentischer Filmkultur in Frankfurt ist von vielen unterschiedlichen Personen und Gruppen geprägt.
                Ähnlich verstreut sind auch die Quellen zur Geschichtsschreibung.
                Die folgenden Absätze können daher nur einige Punkte hervorheben und erheben keinerlei Anspruch auf Vollständigkeit. History is a work in process.
            </p>

            <h2 className="h2NormalContainer mt-4">
                Geschichte der Pupille: Studentische Filmkultur in Frankfurt
            </h2>

            <h3 className="h3NormalContainer">Die Anfänge des Film-Studios</h3>
            <p>
                Die Wurzeln des späteren universitären Film-Studios in Frankfurt lassen sich bis ins Jahr 1950
                zurückverfolgen, als filmbegeisterte Studierende dem Film-Club Frankfurt beitraten. Dort spielte die
                Künstlerin, Filmemacherin und Filmaktivistin Ella Bergmann-Michel als Art Mentorin eine bedeutende
                Rolle.
            </p>
            <p>
                Die erste studentisch organisierte Filmvorführung fand am 17. Dezember 1951 statt, als Horst
                Blüm und Harri Deutsch im Hörsaal F der Goethe-Universität ihren Film <em>Sommerfest in St.
                Goar</em> zeigten.
                Mit weiteren engagierten Studierenden gründeten sie das Film-Studio, das sich sowohl theoretisch als
                auch praktisch mit dem Medium Film auseinandersetzte.
            </p>
            <p>
                Bereits 1952 wurde mit der <em>Pupille Nr. 1</em> eine
                Semesterschau als Format etabliert. Technisch aufgerüstet mit einer Bolex H16-Kamera war das Film-Studio
                bald Teil der studentischen Medienöffentlichkeit.
            </p>
            <p>
                Mit der Einweihung des Studierendenhauses
                Anfang 1953 bekam das Film-Studio eigene Räume und Zugang zu einem kinotauglichen Saal. Die
                Gründung der bundesweiten FIAG (Filmarbeitsgemeinschaften an den deutschen Hochschulen) im Juli
                1953 mit Beteiligung des Film-Studios markierte die wachsende institutionelle Verankerung.
            </p>
            <p>
                Zum Winter 1954 erschien die Zeitschrift <em>filmstudio</em> als erweitertes Heft und wurde in den
                folgenden Jahren zu einer zentralen Plattform für Filmkritik in der BRD.
            </p>

            <RowsPhotoAlbum
                photos={photosA}
                targetRowHeight={250}
                // rowConstraints={{ singleRowMaxHeight: 250 }}

                onClick={({index}) => setIndexA(index)}
                componentsProps={() => ({
                    image: {
                        className: styles.photoAlbumImage,
                    },
                })}
            />

            <Lightbox
                slides={photosA}
                open={indexA >= 0}
                index={indexA}
                close={() => setIndexA(-1)}
                // enable optional lightbox plugins
                plugins={[Captions, Fullscreen, Slideshow, Zoom]}
                captions={{descriptionTextAlign: "center", descriptionMaxLines: 1}}
            />

            <div className={styles.sectionContentWrapper}>

                <h3 className="h3NormalContainer">Ausweitung der Aktivitäten und fortschreitende Politisierung</h3>
                {/* left */}
                <div className={styles.textColumn}>
                    <p>
                        Anschließend veranstaltete das Film-Studio verstärkt Filmreihen und zeigte im Studierendenhaus
                        Ausstellungen zu Filmtechnik, Filmplakaten und internationaler Filmkunst. Große Aufmerksamkeit
                        erlangte die Ausstellung „Zur Entwicklung der Filmtechnik“ (1961), welche in Zusammenarbeit mit
                        Paul Sauerlaenders privatem Archiv für Filmkunde Exponate aus der Frühzeit der Kinematographie
                        präsentierte.
                    </p>
                    <p>
                        Mit dem CAMERA-Kino in der Gräfstraße erschloss das Film-Studio ab 1960 einen neuen
                        Ort mit modernster Projektionstechnik, der vorübergehend regelmäßig genutzt wurde. Doch 1964
                        kündigte die Universität diese Nutzung. Nach jahrelangem Drängen wurde die
                        Cinemascope-Anlage 1967 immerhin vom CAMERA-Kino in das Studierendenhaus überführt.
                    </p>
                    <p>
                        Mit zunehmender Politisierung an der Universität gegen Ende der 1960er Jahre zeigte das
                        Film-Studio nur begrenzte Resonanz, etwa auf die anti-imperialistische Bewegung. Weil der
                        Filmstudio e.V. seinen satzungsgemäßen Aufgaben nicht mehr nachkam, wurde die Nutzung und
                        Verwaltung der Kinotechnik im März 1970 an den als GmbH vom AStA betriebenen Studentischen
                        Reise- und Informationsdienst übertragen – das Kino wurde in <em>Pupille</em> umbenannt.
                    </p>
                </div>

                {/* right */}
                <div className={styles.albumColumn}>
                    {/*<ColumnsPhotoAlbum*/}
                    {/*    photos={photosB}*/}
                    {/*    columns={1}*/}
                    {/*    onClick={({index}) => setIndexB(index)}*/}
                    {/*    componentsProps={() => ({*/}
                    {/*        image: {*/}
                    {/*            className: styles.photoAlbumImage,*/}
                    {/*        },*/}
                    {/*    })}*/}
                    {/*/>*/}

                    <RowsPhotoAlbum
                        photos={photosB}
                        targetRowHeight={220}
                        // rowConstraints={{ singleRowMaxHeight: 250 }}

                        onClick={({index}) => setIndexB(index)}
                        componentsProps={() => ({
                            image: {
                                className: styles.photoAlbumImage,
                            },
                        })}
                    />
                </div>

                <Lightbox
                    slides={photosB}
                    open={indexB >= 0}
                    index={indexB}
                    close={() => setIndexB(-1)}
                    // enable optional lightbox plugins
                    plugins={[Captions, Fullscreen, Slideshow, Zoom]}
                    captions={{descriptionTextAlign: "center"}}
                />
            </div>

            <h3 className="h3NormalContainer">Neue Strukturen und der Beginn des Vereins Pupille</h3>
            <p>
                Nach einer kurzen Wiederbelebung des Film-Studios mit Fokus auf politischen Dokumentarfilmen,
                mitinitiiert durch Personen wie Claudia von Alemann oder Jürgen Karg, wird am 6. Dezember 1974 der
                Verein <em>Pupille e.V.</em> gegründet Er wird im Kollektiv betrieben und vom AStA jährlich mit 7.000 DM
                unterstützt.
            </p>
            <p>
                Mit eigenem Programm und einem Fokus auf politisch konzipierten Filmreihen, z.B. zu
                Science-Fiction oder Hexenfilmen, entwickelte sich die Pupille zur Keimzelle der Frankfurter
                Programmkinoszene.
            </p>
            <p>
                Besonders hervorzuheben ist eine Filmreihe aus dem April 1975. Unter dem Titel
                „Homosexualität & Gesellschaft am Beispiel Film“ zeigte die Gruppe <em>Rote Zelle Schwul
                (RotZSchwul)</em> einen Monat lang Filme zum Thema, z.B. von Andy Warhol, Rosa von Praunheim und
                Kenneth Anger.
            </p>
            <p>
                Auch die Gruppe <em>Frauenkino FFM</em>, gegründet 1981, setzte mit ihrem Fokus auf Filme von und für
                Frauen neue Maßstäbe. Der 1983 gegründete Verein <em>Schöne Neue Welt</em> brachte weitere neue Impulse:
                Ausgiebige thematische Filmreihen mit Podiumsdiskussionen folgten.
            </p>
            <p>
                Gemeinsam mit dem Pupille e.V. und der neu
                gegründeten Filmprofessur wurde versucht das ehemalige CAMERA-Kino als unabhängiges studentische
                Kino zu etablieren. 1992 wurden beide Gruppen für ihr Engagement mit dem Frankfurter Kinopreis
                ausgezeichnet. Doch nur ein Jahr später scheiterte der neue Plan für die Nutzung des CAMERA-Kinos
                endgültig und die dazugehörigen persönlichen Strukturen der Kinoarbeit lösten sich auf.
            </p>

            <RowsPhotoAlbum
                photos={photosC}
                targetRowHeight={250}
                // rowConstraints={{ singleRowMaxHeight: 150 }}
                onClick={({index}) => setIndexC(index)}
                componentsProps={() => ({
                    image: {
                        className: styles.photoAlbumImage,
                    },
                })}
            />

            <Lightbox
                slides={photosC}
                open={indexC >= 0}
                index={indexC}
                close={() => setIndexC(-1)}
                // enable optional lightbox plugins
                plugins={[Captions, Fullscreen, Slideshow, Zoom]}
                captions={{descriptionTextAlign: "start"}}
            />

            <h3 className="h3NormalContainer">Kontinuität und Wandel</h3>
            <p>
                Erst mit der Wiedereröffnung des Festsaals im Studierendenhaus 1997 nahm die Pupille mit neuen
                Personen ihre regulären Vorführungen wieder auf. Der Saal wurde 1998 akustisch modernisiert und mit
                zwei Bauer-35mm-Projektoren ausgestattet.
            </p>
            <p>
                Die Pupille entwickelte sich wieder zu einem festen
                Bestandteil der Frankfurter Kinolandschaft und unterstützte u. a. das Festival Nippon Connection, das
                von
                2000-2012 regelmäßig im Festsaal stattfand. Trotz des Umzugs der Universität auf den Campus Westend
                2001 und geplanten, aber nicht realisiertem Studierendenhaus-Neubau, blieb die Pupille im
                Studierendenhaus in Bockenheim aktiv.
            </p>
            <p>
                Ab 2012 erhielt sie jährlich den Hessischen Kinokulturpreis und
                führte mit einem 4K-Projektor ab 2014 auch digitale Vorführungen ein.
                Während der COVID-19-Pandemie musste der Betrieb 2020 erstmals nach 20 Jahren pausieren.
            </p>
            <p>
                Von 12/2023 bis 2/2024 fand im Schopenhauer Studio in der Zentralbibliothek der Goethe-Universität
                eine Ausstellung mit dem Titel "Bilder werfen. Grabungsarbeiten zur studentischen Filmkultur in
                Frankfurt" statt, welche aus einem Seminar am Institut für Theater-, Film- und Medienwissenschaft
                entstand.
            </p>
            <p>
                Die Filmfestivals <em>Remake - Frankfurter Frauenfilmtage</em> (seit 2018) von der Kinothek Asta Nielsen
                sowie <em>exf.f - tage des experimentellen films frankfurt</em> (seit 2021) als eigene Veranstaltung
                werden in der Pupille ausgerichtet und unterstreichen den Anspruch des Kinos als einen Ort für
                vielfältige Filmkultur.
            </p>

            {/*<RowsPhotoAlbum*/}
            {/*    photos={photosD}*/}
            {/*    targetRowHeight={250}*/}
            {/*    // rowConstraints={{ singleRowMaxHeight: 150 }}*/}
            {/*    onClick={({ index }) => setIndexD(index)}*/}
            {/*    componentsProps={() => ({*/}
            {/*        image: {*/}
            {/*            className: styles.photoAlbumImage,*/}
            {/*        },*/}
            {/*    })}*/}
            {/*/>*/}

            {/*/!*ordinary only with images, no embedded video*!/*/}
            {/*<Lightbox*/}
            {/*    slides={photosD}*/}
            {/*    open={indexD >= 0}*/}
            {/*    index={indexD}*/}
            {/*    close={() => setIndexD(-1)}*/}
            {/*    // enable optional lightbox plugins*/}
            {/*    plugins={[Captions, Fullscreen, Slideshow, Zoom, Inline]}*/}
            {/*    captions={{descriptionTextAlign: "center", showToggle: true}}*/}
            {/*    inline={{*/}
            {/*        style: {width: "100%", maxHeight: "400px", aspectRatio: "3 / 2"},*/}
            {/*    }}*/}
            {/*    slideshow={{autoplay: true,}}*/}
            {/*/>*/}


            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={[
                    ...photosD,
                    {
                        type: "teaser-vimeo",
                        description: "Teaser zur Ausstellung"
                    },
                ]}
                render={{
                    slide: ({ slide }) =>
                        // slide.type === "teaser-vimeo" ? (
                        isTeaserVimeoSlide(slide) ? (
                            // <MyCustomSlide slide={slide} />

                            // <div style={{
                            //     display: "flex",
                            //     justifyContent: "center",
                            //     alignItems: "center",
                            //     height: "100vh"
                            // }}>
                            <div className="d-flex justify-content-center align-items-center">
                                <iframe
                                    src="https://player.vimeo.com/video/899523098?badge=0&autopause=0&player_id=0&app_id=58479"
                                    frameBorder="0"
                                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    style={{
                                        position: "absolute",
                                        width: "85%",
                                        height: "85%",
                                        transform: "translateY(-9%)"  // Shift the iframe up by 10% of its own height
                                    }}
                                    title='Ausstellungsteaser "Bilder werfen"'
                                />
                            </div>

                        ) : undefined,
                }}
                plugins={[Captions, Fullscreen, Inline]}
                captions={{descriptionTextAlign: "center", showToggle: true}}
                inline={{
                    style: {width: "100%", maxHeight: "400px", aspectRatio: "3 / 2"},
                }}
            />



            {/*<video width="320" height="240" controls>*/}
            {/*    <source src={path + "/Bilder_Werfen_Teaser_FINAL.mp4"} type="video/mp4"/>*/}
            {/*</video>*/}

            {/*<div style={{padding: "72.29% 0 0 0", position: "relative"}}>*/}
            {/*    <iframe*/}
            {/*        src="https://player.vimeo.com/video/899523098?badge=0&autopause=0&player_id=0&app_id=58479"*/}
            {/*        frameBorder="0"*/}
            {/*        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"*/}
            {/*        referrerPolicy="strict-origin-when-cross-origin"*/}
            {/*        style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}*/}
            {/*        title='Ausstellungsteaser "Bilder werfen"'*/}
            {/*    />*/}
            {/*</div>*/}

            {/*<Carousel*/}
            {/*    // controls={false}*/}
            {/*    interval={null}*/}
            {/*>*/}
            {/*    <Carousel.Item>*/}
            {/*        <div className={styles.carouselItemWrapper}>*/}
            {/*            <Carousel.Caption>*/}
            {/*                <p className={styles.carouselCaption}>2017 Festsaal im Studihaus</p>*/}
            {/*            </Carousel.Caption>*/}
            {/*            <img*/}
            {/*                src="https://pupille.org/bilder/kinogeschichte/2017_Pupille.jpg"*/}
            {/*                className={styles.carouselImage}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </Carousel.Item>*/}
            {/*    <Carousel.Item>*/}
            {/*        <div className={styles.carouselItemWrapper}>*/}
            {/*            <Carousel.Caption>*/}
            {/*                <p className={styles.carouselCaption}>2023 Ansicht in die Ausstellung 1</p>*/}
            {/*            </Carousel.Caption>*/}
            {/*            <img*/}
            {/*                src="https://pupille.org/bilder/kinogeschichte/2023_Ansicht_in_die_Ausstellung_01.jpg"*/}
            {/*                className={styles.carouselImage}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </Carousel.Item>*/}
            {/*    <Carousel.Item>*/}
            {/*        <div className={styles.carouselItemWrapper}>*/}
            {/*            <Carousel.Caption>*/}
            {/*                <p className={styles.carouselCaption}>2023 Ansicht in die Ausstellung 2</p>*/}
            {/*            </Carousel.Caption>*/}
            {/*            <img*/}
            {/*                src="https://pupille.org/bilder/kinogeschichte/2023_Ansicht_in_die_Ausstellung_02.jpg"*/}
            {/*                className={styles.carouselImage}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </Carousel.Item>*/}
            {/*    <CarouselItem>*/}
            {/*        <div style={{ position: "relative", height: "350px"}}>*/}
            {/*            <iframe*/}
            {/*                src="https://player.vimeo.com/video/899523098?badge=0&autopause=0&player_id=0&app_id=58479"*/}
            {/*                frameBorder="0"*/}
            {/*                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"*/}
            {/*                referrerPolicy="strict-origin-when-cross-origin"*/}
            {/*                // style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}*/}
            {/*                style={{*/}
            {/*                    position: "absolute",*/}
            {/*                    top: 0,*/}
            {/*                    left: 0,*/}
            {/*                    width: "100%",*/}
            {/*                    height: "100%",*/}
            {/*                    // zIndex: 10*/}
            {/*                }}*/}
            {/*                title='Ausstellungsteaser "Bilder werfen"'*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </CarouselItem>*/}
            {/*</Carousel>*/}


            <h3 className="h3NormalContainer">Kinopreise</h3>
            <p className="mb-0">
                Das Programm der Pupille ist in den letzten Jahren wiederholt ausgezeichnet worden:
            </p>
            <ul>
                {/*<li>Hessischer Kinopreis (für nicht gewerbliche Kinos) 2012 &ndash; {new Date() < new Date((new Date()).getFullYear(), 9, 25) ? (new Date()).getFullYear()-1 : (new Date()).getFullYear()}</li>*/}
                {/*<li>Kinopreis des Kinematheksverbunds 2013, 2020 &ndash; 2024</li>*/}
                <li>{valuesMap.hessischerKinopreis}</li>
                <li>{valuesMap.kinematheksKinopreis}</li>
            </ul>

            <br/>

            <Accordion
                data-bs-theme="dark"
            >
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Quellen und Bildnachweise</Accordion.Header>
                    <Accordion.Body>
                        <h4>Bildbeschreibung und -nachweise:</h4>
                        <ul>
                            <li>Hörsaal H im Jügelhaus der Goethe Universität, Undatiert, Universitätsarchiv Frankfurt
                                am Main
                            </li>
                            <li>Mitglieder des Film-Studio am Filmprojektor im neu eröffneten Studierendenhaus, 1953
                                Aus: “Frankfurter Studentenhaus”, Diskus – Frankfurter Studentenzeitung, Nr.2/1953
                                Archiv: Universitätsbibliothek Johann Christian Senckenberg
                            </li>
                            <li>Titel aus der Semesterschau Pupille Nr. 1, 1952, Film-Studio an der
                                Johann-Wolfgang-Goethe-Universität Frankfurt am Main DFF – Deutsches
                                Filminstitut &amp; Filmmuseum / Filmarchiv
                            </li>
                            <li>10 Jahre filmstudio Heftumschlag, 1963 Archiv: Universitätsbibliothek Johann Christian
                                Senckenberg
                            </li>
                            <li>Frankfurt 63 - Agitationsfilm, 1963, Film-Studio an der
                                Johann-Wolfgang-Goethe-Universität Frankfurt am Main - Herbert Birett, Hartmut Birett,
                                Archiv: Institut für Stadtgeschichte Frankfurt am Main
                            </li>
                            <li>Plakat des Films „Reduipers“ mit Pupille Aufkleber, 1978 Archiv: Institut für
                                Stadtgeschichte Frankfurt am Main
                            </li>
                            <li>Pupille Programmheft vom Juli 1979, Pupille-Archiv</li>
                            <li>Banner zur Filmreihe "Die Fremde sehen" am CAMERA-Kino, 1989 Foto: Bettina Schulte
                                Strathaus
                            </li>
                            <li>Innenraum des CAMERA-Kinos, 1989 Foto: Bettina Schulte Strathaus</li>
                            <li>Festsaal während einer Pupille Veranstaltung, 2017 Foto: Meghann Munro</li>
                            <li>Ausstellungsansicht in „Bilder werfen“, 2024 Foto: Simon Oetken</li>
                        </ul>

                        <br/>

                        <h4 className="mt=4">Literaturverzeichnis:</h4>
                        <ul>
                            <li><em>Bilder werfen. Grabungsarbeiten zur studentischen Filmkultur in Frankfurt</em>;
                                Ausstellung im Schopenhauer Studio, Frankfurt am Main, 2023
                            </li>
                            <li><em>Vom Studierendenhaus zum Offenen Haus der Kulturen 1951-2021</em>; Frankfurter
                                Bauheft 01; Lothar Augustin, Julia Reusing, Jörg Schilling, Tim Schuster; Schaff-Verlag,
                                Hamburg, 2021
                            </li>
                            <li><em>Kunst der Revolte/Revolte der Kunst: Perspektiven auf die langen 60er Jahre in
                                Frankfurt am Main</em>; Michaela Filla-Raquin und Andrea Caroline Keppler; Hochschule
                                für Gestaltung, Offenbach am Main, 2019
                            </li>
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

        </article>
    );
}
