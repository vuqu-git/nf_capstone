import {Badge, CardGroup} from "react-bootstrap";
import Card from "react-bootstrap/Card";

export default function ProjektionAufLeinwand() {

    return (
        <section className="normal-content-container">
            <h2 className="header2NormalContainer">
                Veranstaltungen mit Projektion im Festsaal
            </h2>

            <p>
                Für Projektionen im Festsaal des Studierendenhauses gibt es verschiedene Durchführungsarten:
            </p>

            <h3 className="header3NormalContainer text-center mb-4">eigenverantwortlich 🏋️</h3>

            <CardGroup>
                <Card bg="dark" text="white" border="secondary">
                    <Card.Header><Card.Title>&#10112; ganz eigenständig</Card.Title></Card.Header>
                    <Card.Body>
                        <Card.Text>
                            Dazu müsstet Ihr als Erstes den Festsaal beim AStA buchen und eigene Technik mitbringen (z.B. Boxen und Beamer). Dann wärt ihr zeitlich und organisatorisch ganz unabhängig von uns.
                            Unsere Leinwand könnt ihr auf jeden Fall nutzen. Der Schlüssel zum Ausrollen liegt bei der Pforte des Studierendenhauses.
                        </Card.Text>
                        <Badge bg="success">Hinweis:</Badge>
                        <Card.Text>
                            Das <a className="custom-link" href="https://asta-frankfurt.de/angebote/studierendenhaus/raeume-nutzen-mieten" target="_blank" rel="noopener noreferrer">Technik-Team</a> des AStA verleiht Technik (bspw. Boxen, Beamer, Mikrofone) für Veranstaltungen und erklärt bei Bedarf den Aufbau.
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card bg="dark" text="white" border="secondary">
                    <Card.Header><Card.Title>&#10113; mit professioneller Kinotechnik</Card.Title></Card.Header>
                    <Card.Body>
                        <Card.Text>
                            Dafür müsstet Ihr den Festsaal zuerst vom AStA selber mieten. Für die Nutzung unserer Kinotechnik (Ton und/oder Projektoren) müsste der Termin mit uns abgesprochen werden,
                            damit jemand vom Team die technische Betreuung übernimmt.
                        </Card.Text>
                        <Card.Text>
                            Unsere Vorführer*innen nehmen für diese Dienstleistung ein kleines Honorar. Die genauen Konditionen erfahrt ihr auf Anfrage.
                        </Card.Text>
                        <Card.Text>
                            Wir bekommen regelmäßig viele Anfragen und können nicht alle berücksichtigen, da wir komplett ehrenamtlich tätig sind.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </CardGroup>

            <Badge bg="danger" className="mt-4">Wichtig:</Badge>
            <p className="mb-0">
                Bevor Ihr uns kontaktiert, bitte klärt immer <b>selber vorher</b>
            </p>
            <ul>
                <li>die Mietung und Verfügbarkeit des Festsaals mit dem  <a className="custom-link" href="https://asta-frankfurt.de/kontakt" target="_blank" rel="noopener noreferrer">AStA</a> (je nach Projekt bzw. Veranstaltung
                    kann die Nutzung auch kostenlos sein, siehe <a className="custom-link" href="https://asta-frankfurt.de/angebote/studierendenhaus/raeume-nutzen-mieten" target="_blank" rel="noopener noreferrer">Preisliste</a>)
                </li>
                <li>und im Fall einer öffentlichen Filmvorführung die Lizenz mit dem Rechteinhaber des Films.</li>
            </ul>
            <p>
                Bei Film-Vorführungen ist es ratsam direkt beim AStA zu erfragen, ob nicht gleichzeitig im Café KoZ oder vor dem Haus laute Konzerte oder Partys stattfinden.
            </p>


            <h3 className="header3NormalContainer text-center mb-4">gemeinsam 🤝</h3>

            <Card bg="dark" text="white" border="secondary">
                <Card.Header><Card.Title>&#10114; Film zeigen als Kooperation in unserem Programm</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        Es gibt ebenso die Möglichkeit eine Filmvorstellung als Kooperation innerhalb unseres regulären Programms zu veranstalten. Der Termin liegt dann i.d.R. während der Vorlesungszeit des Uni-Semesters.
                        Außerdem wird die gemeinsame Veranstaltung im gedruckten Programmheft sowie auf der Webseite und den Social-Media-Kanälen der Pupille beworben.
                    </Card.Text>
                    <Card.Text>
                        Um die Saalnutzung und die Kinotechnik kümmern wir uns, während die Fragen zu Ticketeinnahmen, Filmbestellung und Filmmiete individuell geklärt werden.
                    </Card.Text>
                    <Badge bg="danger">Wichtig:</Badge>
                    <Card.Text>
                        Bitte richtet in diesem Fall eure Anfrage an uns bis zum Einsendeschluss am 31. Januar (für das Sommersemester) bzw.
                        am 31. Juli (für das Wintersemester).
                    </Card.Text>
                </Card.Body>
            </Card>
        </section>
    );
}