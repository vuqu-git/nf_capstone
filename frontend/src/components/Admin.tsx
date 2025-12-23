import {Link} from "react-router-dom";
import Logout from "./security/Logout.tsx";
import {Badge} from "react-bootstrap";

export default function Admin() {

    return (
        <>
            <Logout />
            <h1>Administratives</h1>
            <section>
                <Badge bg="danger">Hinweis:</Badge>
                <p className="text-danger">
                    Nach einiger Inaktivität bitte ein Logout + Login durchführen,
                    sodass die eingeloggte Session wieder "frisch" und ein add/edit/delete erneut möglich ist.
                </p>
            </section>

            <section>
                <h3>News</h3>
                <ul className="list-unstyled">
                    <li>
                        <Link to="/addnews" className="btn btn-dark mb-2">
                            Add
                        </Link>
                    </li>
                    <li>
                        <Link to="/editnews" className="btn btn-dark mb-2">
                            Edit
                        </Link>
                    </li>
                    <li>
                        <Link to="/deletenews" className="btn btn-dark mb-2">
                            Delete
                        </Link>
                    </li>
                </ul>
            </section>

            <section className="mt-3 mb-3">
                <details className="summary-style general-info">
                    <summary><span className="text-info fs-5">Manual zur Erstellung von Screenings</span></summary>
                    <h5>Empfohlene Reihenfolge bei der Erstellung von Film- bzw. Termin-Einträgen</h5>
                    <ol>
                        <li>alle Reihen erstellen</li>
                        <li>Film erstellen</li>
                        <li>Termin erstellen, hier das Feld "veroeffentlichen" leer lassen oder 0 wählen</li>
                        <li>Film und Termin verknüpfen</li>
                        <li>Termin und Reihe verbinden</li>
                        <li>alle Termine publik machen indem das Feld "veroeffentlichen" auf eine Zahl &gt; 0 gesetzt wird</li>
                    </ol>

                    <hr/>

                    <p>
                        Die Screeningdetail-Ansicht kann getestet werden unter pupille.org/details/TNR <br/>
                        Dabei ist TNR die ID des betrachteten Termins. Die Route ist auch erreichbar, selbst wenn der
                        Termin noch nicht über das Feld „veröffentlichen“ publiziert wurde.
                    </p>

                    <hr/>

                    <p>Zu unterscheiden sind 2 Arten von Screenings</p>
                    <h5><em>"Standard"-Screening</em></h5>
                    <p>d.h. 1 Termin mit genau 1 Langfilm + optionale Vorfilme</p>
                    <p>Beispiel: <Link to="/details/879" className="custom-link">Sie küssten und sie schlugen ihn</Link></p>
                    <span>Vorgehen:</span>
                    <ul>
                        <li>Termineintrag erstellen und den Titel im Termin leerlassen!</li>
                        <li>Filmeintrag für Langfilm und Filmeinträge für Vorfilme machen und anschließend Verknüpfung(en) zw. Termin und Film(e) herstellen.</li>
                    </ul>
                    <p>
                        Wenn ein einem Tag bzw. mehrere Filme mit eigener Startzeit laufen sollen, dann mehrere Einzeltermine erstellen und mit den entsprechenden Filmen verbinden.
                        Anzuwenden bei Double-Feature mit Einzelticketverkauf pro Film.
                    </p>

                    <p className="mt-3"><Badge bg="success" text="dark">Tipp:</Badge> Der 1 Langfilm kann auch ein ganzes Kurzfilmprogramm repräsentieren, wenn die einzelnen Kurzfilme keine eigenen Filmeinträge haben sollen,
                        d.h. 1 Termin mit genau 1 Filmeintrag, welcher aber mehrere (Kurz-)Filme repräsentiert: im Langtext des 1 Filmeintrags alle (Kurz-)Filme reintun;
                        Bsp. <Link to="/details/844" className="custom-link">Kämpfe um Solidarität und Emanzipation</Link> oder  <Link to={"/details/843"} className="custom-link">LICHTER – Regionale Kurzfilmrolle I</Link>
                    </p>

                    <h5 className="mt-3"><em>Programmscreening bzw. Filmprogramm an einem Termin</em></h5>
                    <p>d.h. 1 Termin mit mehreren Filmen</p>
                    <p>bspw.: <Link to="/details/875" className="custom-link">Antoine-Doinel-Zyklus Teil II</Link></p>
                    <p>Die einzelnen Filme haben jeweils keine eigene Startzeit, da nur 1 Termineintrag für alle Filme.</p>
                    <p>Geeignet bspw. für Kurzfilmprogramm oder Double-Features (bei dem kein Einzelticketverkauf pro Filmvorstellung erfolgt).</p>
                    <span>Vorgehen:</span>
                    <ul>
                        <li>Termineintrag erstellen <u>und</u> dabei einen Titel für den Termin wählen sowie ein Bild für den Termin angeben.</li>
                        <li>Filmeintrag bzw. -einträge machen und anschließend Verknüpfung(en) zw. Termin und Film(e) herstellen.</li>
                    </ul>

                    {/*<h5 className="mt-3"><em>Sonderfall: Programm als Standard-Screening</em></h5>*/}
                    {/*<p>d.h. 1 Termin mit genau 1 Filmeintrag, welcher aber mehrere (Kurz-)Filme repräsentiert</p>*/}
                    {/*<p>Beispiel: <Link to="/details/843" className="custom-link">LICHTER – Regionale Kurzfilmrolle I</Link>*/}
                    {/*    oder <Link to="/details/844" className="custom-link">Kämpfe um Solidarität und Emanzipation</Link></p>*/}
                    {/*<p>Nachteil: nur 1 Bild wird angezeigt</p>*/}
                    {/*<span>Vorgehen:</span>*/}
                    {/*<ul>*/}
                    {/*    <li>wie beim Standard-Screening, wobei im Filmeintrag alle (Kurz-)Filme im Langtext eingetragen werden</li>*/}
                    {/*</ul>*/}

                    <h5 className="mt-3"><em>Screening ohne Film(e)</em> <Badge bg="danger" text="dark">nicht machen!</Badge></h5>
                    <p>d.h. nur 1 Termin wird erstellt und im Termin-Text bzw. -Titel den/die Film(e) beschrieben</p>
                    <p>Beispiel: <Link to="/details/880" className="custom-link">collecting images: peter hutton & mark lapore pt. 1</Link></p>
                    <p>Das Problem ist, dass keine Filmlänge  angegeben wird und dadurch der Kalendereintrag eine Dauer von 0 Minuten hat.</p>

                    <hr/>
                </details>
            </section>

            <section>
                <h3>Film</h3>
                <ul className="list-unstyled">
                    <li>
                        <Link to="/adminfilme" className="btn btn-secondary mb-2">
                            Add, Edit, Delete
                        </Link>
                    </li>
                </ul>
            </section>

            <section>
                <h3>Termin</h3>
                <ul className="list-unstyled">
                    <li>
                        <Link to="/admintermine" className="btn btn-secondary mb-2">
                            Add, Edit, Delete
                        </Link>
                    </li>
                </ul>
            </section>

            <section>
                <h3>Reihe</h3>
                <ul className="list-unstyled">
                    <li>
                        <Link to="/adminreihen" className="btn btn-secondary mb-2">
                            Add, Edit, Delete
                        </Link>
                    </li>
                </ul>
            </section>

            <section>
                <h3>Terminverknüpfung (Termin ↔ Film)</h3>
                <ul className="list-unstyled">
                    <li>
                        <Link to="/admintven" className="btn btn-outline-secondary mb-2">
                            Add, Edit, Delete
                        </Link>
                    </li>
                </ul>
            </section>

            <section>
                <h3>Reiheverknüpfung (Reihe ↔ Termin)</h3>
                <ul className="list-unstyled">
                    <li>
                        <Link to="/adminrven" className="btn btn-outline-secondary mb-2">
                            Add, Edit, Delete
                        </Link>
                    </li>
                </ul>
            </section>

            <section className="mt-4">
                <h3>Programmhefte/Flyer</h3>
                <ul className="list-unstyled">
                    <li>
                        <Link to="/adminprogrammhefte" className="btn btn-light mb-2">
                            Add, Edit, Delete
                        </Link>
                    </li>
                </ul>
            </section>

            <section className="mt-4">
                <h3>Survey bzw. Abstimmungen</h3>
                <ul className="list-unstyled">
                    <li>
                        <Link to="/adminumfragen" className="btn btn-dark mb-2">
                            Umfragen verwalten
                        </Link>
                    </li>
                    <li>
                        <Link to="/adminstimmabgaben" className="btn btn-dark mb-2">
                            Stimmabgaben verwalten
                        </Link>
                    </li>
                </ul>
            </section>
        </>
    )
};