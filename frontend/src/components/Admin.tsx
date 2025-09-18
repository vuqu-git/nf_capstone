import {Link} from "react-router-dom";
import Logout from "./security/Logout.tsx";

// interface Props {
//
// }

// export default function OverviewArchive({ }: Props) {
export default function Admin() {

    return (
        <>
            <Logout />
            <h1>Administratives</h1>
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
                <details>
                    <summary><span className="text-info fs-5">Manual zur Erstellung von Screenings</span></summary>
                    <h5>Empfohlene Reihenfolge bei der Erstellung von Film- bz. Termin-Einträgen</h5>
                    <ol>
                        <li>alle Reihen erstellen</li>
                        <li>Film erstellen</li>
                        <li>Termin erstellen</li>
                        <li>Film und Termin verknüpfen</li>
                        <li>Termin und Reihe verbinden</li>
                    </ol>

                    <hr/>

                    <p>
                        Die Screeningdetail-Ansicht kann getestet werden unter pupille.org/details/TNR <br/>
                        Dabei ist TNR die ID des betrachteten Termins. Die Route ist auch erreichbar, selbst wenn der
                        Termin noch nicht über das Feld „veröffentlichen“ publiziert wurde.
                    </p>

                    <hr/>

                    <p>Zu unterscheiden sind 2 Arten von Screeningterminen</p>
                    <h5><em>"Standard"-Termin</em></h5>
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
                    <p className="mt-3">Der 1 Langfilm kann auch ein ganzes Kurzfilmprogramm repräsentieren, wenn die einzelnen Kurzfilme keine eigenen Filmeinträge haben sollen,
                        z. B. <Link to="/details/844" className="custom-link">Kämpfe um Solidarität und Emanzipation</Link> oder  <Link to={"/details/843"} className="custom-link">LICHTER – Regionale Kurzfilmrolle I</Link>
                    </p>

                    <h5 className="mt-3"><em>Programmtermin bzw. Filmprogramm an einem Termin</em></h5>
                    <p>d.h. 1 Termin mit mehreren Filmen</p>
                    <p>Beispiel: <Link to="/details/875" className="custom-link">Antoine-Doinel-Zyklus Teil II</Link></p>
                    <p>Die einzelnen Filme haben jeweils keine eigene Startzeit, da nur 1 Termineintrag für alle Filme.</p>
                    <p>Geeignet bspw. für Kurzfilmprogramm oder Double-Features (bei dem kein Einzelticketverkauf pro Filmvorstellung erfolgt).</p>
                    <span>Vorgehen:</span>
                    <ul>
                        <li>Termineintrag erstellen <u>und</u> dabei einen Titel für den Termin wählen sowie ein Bild für den Termin angeben.</li>
                        <li>Filmeintrag bzw. -einträge machen und anschließend Verknüpfung(en) zw. Termin und Film(e) herstellen.</li>
                    </ul>

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

            <section>
                <h3>Programmhefte/Flyer</h3>
                <ul className="list-unstyled">
                    <li>
                        <Link to="/adminprogrammhefte" className="btn btn-light mb-2">
                            Add, Edit, Delete
                        </Link>
                    </li>
                </ul>
            </section>
        </>
    )
};