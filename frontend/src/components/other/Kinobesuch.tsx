import '../styles/NomalContent.css';
import styles from './Kinobesuch.module.css';
import {RowsPhotoAlbum} from "react-photo-album";
import {useState} from "react";
import Lightbox from "yet-another-react-lightbox";
import {Captions, Fullscreen, Slideshow, Zoom} from "yet-another-react-lightbox/plugins";
import {staticFilePathFrontend} from "../../utils/config.ts";

const path = staticFilePathFrontend + "bilder/allgemein"

const photos = [
    { src: path + "/Map_Campus_Bockenheim.png", width: 587, height: 643, description: "Karte vom Campus Bockenheim" },
    { src: path + "/Kinoansicht1B.jpg", width: 1500, height: 1004, description: "Eingang des Studierendenhauses von außen" },
    { src: path + "/Kinoansicht2.jpg", width: 1500, height: 849, description: "Festsaal Innenansicht" },
    { src: path + "/Kinoansicht3.jpg", width: 1500, height: 1125, description: "Festsaal aus dem Vorführraum" },
];

export default function Kinobesuch() {
    const [indexA, setIndexA] = useState(-1);
    const [indexS, setIndexS] = useState(-1);

    return (
        <div>
            <section className="normal-content-container">
                <h2 className="h2NormalContainer">Informationen zum Kinobesuch</h2>

                {/*usual syntax: className={styles.yourClassName}*/}
                {/*The more common and often preferred syntax for accessing CSS Module class names in JSX is indeed using dot notation when the class name in your CSS file is a valid JavaScript identifier (i.e., it doesn't contain hyphens and doesn't start with a number)*/}
                {/*JavaScript doesn't allow hyphens in variable or property names. When CSS Modules processes your Kinobesuch.module.css with hyphenated class names like section-row, the styles object will have keys that reflect these names as strings. To access a property of an object using a string key that contains characters not allowed in standard JavaScript identifiers (like a hyphen), you need to use bracket notation (styles["section-row"]).*/}
                <div className={styles["section-row"]}>
                    <h3 className={styles["section-row"]}>Eintrittspreis</h3>
                    <div className={styles["section-content"]}>
                        <p>2,50 Euro</p>
                        <p>Nur Barzahlung ist möglich.</p>
                        <p>Das Kino ist für alle offen (d.h. insbesondere unabhängig vom Studierendenstatus). Es gibt keine Überlängenzuschläge und keine Ermäßigungen.</p>
                        <p>Abweichende Preise werden auf der Webseite in den Filmeinträgen bzw. im Programmheft kenntlich gemacht.</p>
                    </div>
                </div>

                <div className={styles["section-row"]}>
                    <h3 className={styles["section-row"]}>Reservierung</h3>
                    <div className={styles["section-content"]}>
                        <p>Reservierungen oder Vorbestellungen sind leider nicht möglich. Der Ticketverkauf startet ca. 40 Minuten vor Beginn der Vorführung.</p>
                        <p>Für ausgewählte Veranstaltungen bieten wir Reservierungen an, die beim Klicken auf den entsprechenden Link vorgenommen werden können.</p>
                    </div>
                </div>

                <div className={styles["section-row"]}>
                    <h3 className={styles["section-row"]}>Spielbetrieb</h3>
                    <div className={styles["section-content"]}>
                        <p>Während der Vorlesungszeit jedes Semester veranstalten wir jeweils montags und mittwochs Filmvorführungen (außer an gesetzlichen Feiertagen). Darüber hinaus können vereinzelt auch an anderen Wochentagen – einschließlich der vorlesungsfreien Zeit – Filme gezeigt werden.</p>
                    </div>
                </div>

                <div className={styles["section-row"]}>
                    <h3 className={styles["section-row"]}>Content Notes</h3>
                    <div className={styles["section-content"]}>
                        <p>
                            Wir verstehen uns als Kino mit einem vielfältigen und auch risikobereiten Programm &ndash; gleichzeitig möchten wir einen Ort herstellen, an dem ein kollektives Kinoerlebnis so inklusiv wie möglich stattfinden kann.
                            Deshalb haben wir bei jeder Filmbeschreibung (falls zutreffend) ein Ausklappmenü "Hinweis auf sensible Inhalt" eingefügt, in dem ihr Triggerwarnungen und andere inhaltliche Hinweise sehen könnt.
                        </p>
                        <p>
                            Wir haben uns bei den Triggerwarnungen zu sexueller Gewalt an der Seite <a className="custom-link" href="https://www.unconsentingmedia.org" target="_blank" rel="noopener noreferrer">www.unconsentingmedia.org</a> orientiert, die aber vor allem US-amerikanische Filme abdeckt.
                            Die Einschätzung der Inhalte erfolgt daher nach bestem Wissen und Gewissen durch unser Team und/oder unsere Kooperationspartner*innen.
                            Da dies aber immer auch ein subjektiver Prozess ist, können wir die Vollständigkeit dieser Angaben leider nicht garantieren.
                        </p>
                    </div>
                </div>

                <div className={styles["section-row"]}>
                    <h3 className={styles["section-row"]}>Adresse</h3>
                    <div className={styles["section-content"]}>
                        <p>
                            Festsaal (1. OG) im Studierendenhaus<br/>
                            Mertonstr. 26-28<br/>
                            60325 Frankfurt am Main
                        </p>
                    </div>
                </div>

                <div className={styles["section-row"]}>
                    <h3 className={styles["section-row"]}>Anfahrt</h3>
                    <div className={styles["section-content"]}>
                        <p>
                            Haltestelle "Bockenheimer Warte"<br/>
                            U-Bahn: U4, U6, U7<br/>
                            Bus: M32, M36, 50, 75; N4, N7<br/>
                            Tram: 16
                        </p>

                        <RowsPhotoAlbum
                            photos={photos.slice(0, 2)}
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
                            slides={photos}
                            open={indexA >= 0}
                            index={indexA}
                            close={() => setIndexA(-1)}
                            // enable optional lightbox plugins
                            plugins={[Captions, Fullscreen, Slideshow, Zoom]}
                            captions={{descriptionTextAlign: "center"}}
                        />
                    </div>
                </div>

                <div className={styles["section-row"]}>
                    <h3 className={styles["section-row"]}>Saal</h3>
                    <div className={styles["section-content"]}>
                        <p>Fassungsvermögen von ca. 200 Sitzplätze</p>

                        <RowsPhotoAlbum
                            photos={photos.slice(-2)}
                            targetRowHeight={250}
                            // rowConstraints={{ singleRowMaxHeight: 250 }}

                            onClick={({index}) => setIndexS(index)}
                            componentsProps={() => ({
                                image: {
                                    className: styles.photoAlbumImage,
                                },
                            })}
                        />

                        <Lightbox
                            slides={photos.slice(-2).concat(photos.slice(0, 2))}
                            open={indexS >= 0}
                            index={indexS}
                            // close={() => setIndexS(-1)}
                            close={() => setIndexS(-1)}
                            // enable optional lightbox plugins
                            plugins={[Captions, Fullscreen, Slideshow, Zoom]}
                            captions={{descriptionTextAlign: "center"}}
                        />
                    </div>
                </div>

                <div className={styles["section-row"]}>
                    <h3 className={styles["section-row"]}>Barrierefreiheit</h3>
                    <div className={styles["section-content"]}>
                        <p>Menschen mit Mobilitätseinschränkung</p>
                        <p>Der Festsaal liegt im 1. OG des Studierendenhauses und ist über einen Fahrstuhl zugänglich. Bitte wendet euch an die Pforte (am Eingang des Studierendenhauses) für die Benutzung des Fahrstuhls. Während der Einlasszeiten steht die Tür zum Festsaal offen. Im Saal gibt es keine ausgewiesenen Plätze für Menschen mit Mobilitätseinschränkung. Wir leisten gerne Hilfe einen präferierten Platz einzunehmen.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}