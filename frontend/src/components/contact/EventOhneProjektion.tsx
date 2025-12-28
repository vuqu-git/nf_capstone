import React from "react";
import {Badge} from "react-bootstrap";
import HinweisWerbungVeranstaltungsort from "./HinweisWerbungVeranstaltungsort.tsx";

// caller of this component: ContactForm.tsx

const EventOhneProjektion: React.FC = () => {

    return (
        <section>
            <h5>Kontak zum AStA</h5>
            <p>Das Pupille-Kino ist auch nur Mieter beim AStA und ist <strong>nicht</strong> für die Räumlichkeit des Festsaals im Studierendenhaus verantwortlich.</p>
            <p>
                Bitte kontaktiert direkt das <a className="custom-link" href="https://asta-frankfurt.de/kontakt" target="_blank" rel="noopener noreferrer">AStA-Sekretariat</a> für die Verfügbarkeit und Mietung des Festsaals.
                Je nach Projekt bzw. Veranstaltung kann die Nutzung auch kostenlos sein, siehe <a className="custom-link" href="https://asta-frankfurt.de/angebote/studierendenhaus/raeume-nutzen-mieten" target="_blank" rel="noopener noreferrer">Preisliste</a>.
            </p>
            <Badge bg="warning" text="dark">
                Hinweis:
            </Badge>
            <HinweisWerbungVeranstaltungsort />
        </section>
    );
};

export default EventOhneProjektion;