import './NomalContent.css';
import {Link, useLoaderData} from "react-router-dom";
import {OtherDataValuesMap} from "../../types/OtherDataValuesMap.ts";

export default function Impressum() {

    const valuesMap = useLoaderData<OtherDataValuesMap>();

    return (
        <section className="normal-content-container">
            <h2 className="header2NormalContainer">Impressum</h2>

            <h3 className="header3NormalContainer">Adresse</h3>
            <p>
                Pupille e.V.<br/>
                Studierendenhaus an der Goethe-Universität<br/>
                Mertonstr. 26-28<br/>
                60325 Frankfurt am Main
            </p>

            <h3 className="header3NormalContainer">Kontakt</h3>
            <p>
                fernmündlich unter der Telefonnummer 069 7982 8976
            </p>
            <p>
                schriftlich über das <Link to={`/kontakt`} className="custom-link">Kontaktformular</Link>
            </p>

            <h3 className="header3NormalContainer">Verein</h3>
            <p>
                Verantwortlich im Sinne des § 6 Teledienstegesetzes und des § 10 Mediendienste-Staatsvertrags.
            </p>
            <p>
                Die Pupille e.V. ist ein gemeinnütziger eingetragener Verein an der Johann Wolfgang Goethe-Universität Frankfurt.
                Sie wird durch die Vorstände {valuesMap.aktuelleVorstaende} vertreten.
            </p>
            <p>
                Vereinsregisternummer: VR 6640 beim Amtsgericht Frankfurt am Main
            </p>
            <p>
                Steuernummer: 047 250 93187
            </p>

            <h3 className="header3NormalContainer">Jugendschutzbeauftragter</h3>
            <p>
                {valuesMap.jugendschutzbeauftragter}<br/>
                jugendschutz(at)kommunale-kinos.de
            </p>

            <h3 className="header3NormalContainer">Urheberrechtshinweis</h3>
            <p>
                Alle Bilder auf diesem Webauftritt wurden von den jeweiligen Filmverleihern zur Verfügung gestellt.
                Alle Texte wurden, falls nicht anders gekennzeichnet, von der Pupille e.V. verfaßt. Alle Texte,
                Bilder und Grafiken auf diesem Webauftritt sind urheberrechtlich geschützt.
            </p>
            <p>
                Es wird darum gebeten, sie nicht zu kopieren, zu verändern oder auf anderen Webauftritten zu
                verwenden.
            </p>

            {/*<section id="datenschutzerklaerung">*/}
            {/*    <h3 className="header3NormalContainer">Datenschutzerklärung</h3>*/}

            {/*    <p>Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von*/}
            {/*        personenbezogenen Daten (nachfolgend kurz "Daten") innerhalb unseres Onlineangebotes und der mit*/}
            {/*        ihm verbundenen Webseiten, Funktionen und Inhalte sowie externen Onlinepräsenzen, wie z.B. unser*/}
            {/*        Social Media Profile auf (nachfolgend gemeinsam bezeichnet als "Onlineangebot"). Im Hinblick auf*/}
            {/*        die verwendeten Begrifflichkeiten, wie z.B. "Verarbeitung" oder "Verantwortlicher" verweisen wir*/}
            {/*        auf die Definitionen im Art. 4 der Datenschutzgrundverordnung (DSGVO).</p>*/}

            {/*    <h4 className="header4NormalContainer">Verantwortlicher</h4>*/}

            {/*    <p>Pupille e.V.<br/>*/}
            {/*        Mertonstraße 26-28<br/>*/}
            {/*        60325 Frankfurt am Main<br/>*/}
            {/*        Deutschland<br/>*/}
            {/*        <br/>*/}
            {/*        E-Mailadresse: info(at)pupille.org<br/>*/}
            {/*        <br/>*/}
            {/*        Vorstände: {aktuelleVorstaende}</p>*/}

            {/*    <h4 className="header4NormalContainer">Arten der verarbeiteten Daten:</h4>*/}
            {/*    <ul>*/}
            {/*        <li>Bestandsdaten (z.B., Namen, Adressen).</li>*/}
            {/*        <li>Kontaktdaten (z.B., E-Mail, Telefonnummern).</li>*/}
            {/*        <li>Inhaltsdaten (z.B., Texteingaben, Fotografien, Videos).</li>*/}
            {/*        <li>Nutzungsdaten (z.B., besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten).</li>*/}
            {/*        <li>Meta-/Kommunikationsdaten (z.B., Geräte-Informationen, IP-Adressen).</li>*/}
            {/*    </ul>*/}

            {/*    <p>Kategorien betroffener Personen<br/>*/}
            {/*        Besucher und Nutzer des Onlineangebotes (Nachfolgend bezeichnen wir die betroffenen Personen*/}
            {/*        zusammenfassend auch als "Nutzer").</p>*/}

            {/*    <h4 className="header4NormalContainer">Zweck der Verarbeitung:</h4>*/}
            {/*    <ul>*/}
            {/*        <li>Zurverfügungstellung des Onlineangebotes, seiner Funktionen und Inhalte.</li>*/}
            {/*        <li>Beantwortung von Kontaktanfragen und Kommunikation mit Nutzern.</li>*/}
            {/*        <li>Sicherheitsmaßnahmen.</li>*/}
            {/*        <li>Reichweitenmessung/Marketing</li>*/}
            {/*    </ul>*/}

            {/*    <h4 className="header4NormalContainer">Verwendete Begrifflichkeiten</h4>*/}
            {/*    <p>"Personenbezogene Daten" sind alle Informationen, die sich auf eine identifizierte oder*/}
            {/*        identifizierbare natürliche Person (im Folgenden "betroffene Person") beziehen; als*/}
            {/*        identifizierbar wird eine natürliche Person angesehen, die direkt oder indirekt, insbesondere*/}
            {/*        mittels Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten, zu*/}
            {/*        einer Online-Kennung (z.B. Cookie) oder zu einem oder mehreren besonderen Merkmalen*/}
            {/*        identifiziert werden kann, die Ausdruck der physischen, physiologischen, genetischen,*/}
            {/*        psychischen, wirtschaftlichen, kulturellen oder sozialen Identität dieser natürlichen Person*/}
            {/*        sind.</p>*/}

            {/*    <p>"Verarbeitung" ist jeder mit oder ohne Hilfe automatisierter Verfahren ausgeführte Vorgang oder*/}
            {/*        jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten. Der Begriff reicht weit*/}
            {/*        und umfasst praktisch jeden Umgang mit Daten.</p>*/}

            {/*    <p>"Pseudonymisierung" die Verarbeitung personenbezogener Daten in einer Weise, dass die*/}
            {/*        personenbezogenen Daten ohne Hinzuziehung zusätzlicher Informationen nicht mehr einer*/}
            {/*        spezifischen betroffenen Person zugeordnet werden können, sofern diese zusätzlichen*/}
            {/*        Informationen gesondert aufbewahrt werden und technischen und organisatorischen Maßnahmen*/}
            {/*        unterliegen, die gewährleisten, dass die personenbezogenen Daten nicht einer identifizierten*/}
            {/*        oder identifizierbaren natürlichen Person zugewiesen werden.</p>*/}

            {/*    <p>"Profiling" jede Art der automatisierten Verarbeitung personenbezogener Daten, die darin besteht,*/}
            {/*        dass diese personenbezogenen Daten verwendet werden, um bestimmte persönliche Aspekte, die sich*/}
            {/*        auf eine natürliche Person beziehen, zu bewerten, insbesondere um Aspekte bezüglich*/}
            {/*        Arbeitsleistung, wirtschaftliche Lage, Gesundheit, persönliche Vorlieben, Interessen,*/}
            {/*        Zuverlässigkeit, Verhalten, Aufenthaltsort oder Ortswechsel dieser natürlichen Person zu*/}
            {/*        analysieren oder vorherzusagen.</p>*/}

            {/*    <p>Als "Verantwortlicher" wird die natürliche oder juristische Person, Behörde, Einrichtung oder*/}
            {/*        andere Stelle, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung*/}
            {/*        von personenbezogenen Daten entscheidet, bezeichnet.</p>*/}

            {/*    <p>"Auftragsverarbeiter" eine natürliche oder juristische Person, Behörde, Einrichtung oder andere*/}
            {/*        Stelle, die personenbezogene Daten im Auftrag des Verantwortlichen verarbeitet.</p>*/}

            {/*    <h4 className="header4NormalContainer">Maßgebliche Rechtsgrundlagen</h4>*/}

            {/*    <p>Nach Maßgabe des Art. 13 DSGVO teilen wir Ihnen die Rechtsgrundlagen unserer Datenverarbeitungen*/}
            {/*        mit. Sofern die Rechtsgrundlage in der Datenschutzerklärung nicht genannt wird, gilt Folgendes:*/}
            {/*        Die Rechtsgrundlage für die Einholung von Einwilligungen ist Art. 6 Abs. 1 lit. a und Art. 7*/}
            {/*        DSGVO, die Rechtsgrundlage für die Verarbeitung zur Erfüllung unserer Leistungen und*/}
            {/*        Durchführung vertraglicher Maßnahmen sowie Beantwortung von Anfragen ist Art. 6 Abs. 1 lit. b*/}
            {/*        DSGVO, die Rechtsgrundlage für die Verarbeitung zur Erfüllung unserer rechtlichen*/}
            {/*        Verpflichtungen ist Art. 6 Abs. 1 lit. c DSGVO, und die Rechtsgrundlage für die Verarbeitung zur*/}
            {/*        Wahrung unserer berechtigten Interessen ist Art. 6 Abs. 1 lit. f DSGVO. Für den Fall, dass*/}
            {/*        lebenswichtige Interessen der betroffenen Person oder einer anderen natürlichen Person eine*/}
            {/*        Verarbeitung personenbezogener Daten erforderlich machen, dient Art. 6 Abs. 1 lit. d DSGVO als*/}
            {/*        Rechtsgrundlage.</p>*/}

            {/*    <h4 className="header4NormalContainer">Sicherheitsmaßnahmen</h4>*/}

            {/*    <p>Wir treffen nach Maßgabe des Art. 32 DSGVO unter Berücksichtigung des Stands der Technik, der*/}
            {/*        Implementierungskosten und der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung*/}
            {/*        sowie der unterschiedlichen Eintrittswahrscheinlichkeit und Schwere des Risikos für die Rechte*/}
            {/*        und Freiheiten natürlicher Personen, geeignete technische und organisatorische Maßnahmen, um ein*/}
            {/*        dem Risiko angemessenes Schutzniveau zu gewährleisten.<br/>*/}

            {/*        Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit, Integrität und*/}
            {/*        Verfügbarkeit von Daten durch Kontrolle des physischen Zugangs zu den Daten, als auch des sie*/}
            {/*        betreffenden Zugriffs, der Eingabe, Weitergabe, der Sicherung der Verfügbarkeit und ihrer*/}
            {/*        Trennung. Des Weiteren haben wir Verfahren eingerichtet, die eine Wahrnehmung von*/}
            {/*        Betroffenenrechten, Löschung von Daten und Reaktion auf Gefährdung der Daten gewährleisten.*/}
            {/*        Ferner berücksichtigen wir den Schutz personenbezogener Daten bereits bei der Entwicklung, bzw.*/}
            {/*        Auswahl von Hardware, Software sowie Verfahren, entsprechend dem Prinzip des Datenschutzes durch*/}
            {/*        Technikgestaltung und durch datenschutzfreundliche Voreinstellungen (Art. 25 DSGVO).<br/>*/}
            {/*    </p>*/}

            {/*    <h4 className="header4NormalContainer">Zusammenarbeit mit Auftragsverarbeitern und Dritten</h4>*/}

            {/*    <p>Sofern wir im Rahmen unserer Verarbeitung Daten gegenüber anderen Personen und Unternehmen*/}
            {/*        (Auftragsverarbeitern oder Dritten) offenbaren, sie an diese Übermitteln oder ihnen sonst*/}
            {/*        Zugriff auf die Daten gewähren, erfolgt dies nur auf Grundlage einer gesetzlichen Erlaubnis*/}
            {/*        (z.B. wenn eine Übermittlung der Daten an Dritte, wie an Zahlungsdienstleister, gem. Art. 6 Abs.*/}
            {/*        1 lit. b DSGVO zur Vertragserfüllung erforderlich ist), Sie eingewilligt haben, eine rechtliche*/}
            {/*        Verpflichtung dies vorsieht oder auf Grundlage unserer berechtigten Interessen (z.B. beim*/}
            {/*        Einsatz von Beauftragten, Webhostern, etc.).<br/>*/}

            {/*        Sofern wir Dritte mit der Verarbeitung von Daten auf Grundlage eines sog.*/}
            {/*        "Auftragsverarbeitungsvertrages" beauftragen, geschieht dies auf Grundlage des Art. 28 DSGVO.*/}
            {/*    </p>*/}

            {/*    <h4 className="header4NormalContainer">Übermittlungen in Drittländer</h4>*/}

            {/*    <p>Sofern wir Daten in einem Drittland (d.h. außerhalb der Europäischen Union (EU) oder des*/}
            {/*        Europäischen Wirtschaftsraums (EWR)) verarbeiten oder dies im Rahmen der Inanspruchnahme von*/}
            {/*        Diensten Dritter oder Offenlegung, bzw. Übermittlung von Daten an Dritte geschieht, erfolgt dies*/}
            {/*        nur, wenn es zur Erfüllung unserer (vor)vertraglichen Pflichten, auf Grundlage Ihrer*/}
            {/*        Einwilligung, aufgrund einer rechtlichen Verpflichtung oder auf Grundlage unserer berechtigten*/}
            {/*        Interessen geschieht. Vorbehaltlich gesetzlicher oder vertraglicher Erlaubnisse, verarbeiten*/}
            {/*        oder lassen wir die Daten in einem Drittland nur beim Vorliegen der besonderen Voraussetzungen*/}
            {/*        der Art. 44 ff. DSGVO verarbeiten. D.h. die Verarbeitung erfolgt z.B. auf Grundlage besonderer*/}
            {/*        Garantien, wie der offiziell anerkannten Feststellung eines der EU entsprechenden*/}
            {/*        Datenschutzniveaus (z.B. für die USA durch das "Privacy Shield") oder Beachtung offiziell*/}
            {/*        anerkannter spezieller vertraglicher Verpflichtungen (so genannte*/}
            {/*        "Standardvertragsklauseln").</p>*/}

            {/*    <h4 className="header4NormalContainer">Rechte der betroffenen Personen</h4>*/}

            {/*    <p>Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten verarbeitet*/}
            {/*        werden und auf Auskunft über diese Daten sowie auf weitere Informationen und Kopie der Daten*/}
            {/*        entsprechend Art. 15 DSGVO.<br/>*/}

            {/*        Sie haben entsprechend. Art. 16 DSGVO das Recht, die Vervollständigung der Sie betreffenden*/}
            {/*        Daten oder die Berichtigung der Sie betreffenden unrichtigen Daten zu verlangen.<br/>*/}

            {/*        Sie haben nach Maßgabe des Art. 17 DSGVO das Recht zu verlangen, dass betreffende Daten*/}
            {/*        unverzüglich gelöscht werden, bzw. alternativ nach Maßgabe des Art. 18 DSGVO eine Einschränkung*/}
            {/*        der Verarbeitung der Daten zu verlangen.<br/>*/}

            {/*        Sie haben das Recht zu verlangen, dass die Sie betreffenden Daten, die Sie uns bereitgestellt*/}
            {/*        haben nach Maßgabe des Art. 20 DSGVO zu erhalten und deren Übermittlung an andere*/}
            {/*        Verantwortliche zu fordern.<br/>*/}

            {/*        Sie haben ferner gem. Art. 77 DSGVO das Recht, eine Beschwerde bei der zuständigen*/}
            {/*        Aufsichtsbehörde einzureichen.<br/>*/}
            {/*    </p>*/}

            {/*    <h4 className="header4NormalContainer">Widerrufsrecht</h4>*/}

            {/*    <p>Sie haben das Recht, erteilte Einwilligungen gem. Art. 7 Abs. 3 DSGVO mit Wirkung für die Zukunft*/}
            {/*        zu widerrufen</p>*/}

            {/*    <h4 className="header4NormalContainer">Widerspruchsrecht</h4>*/}

            {/*    <p>Sie können der künftigen Verarbeitung der Sie betreffenden Daten nach Maßgabe des Art. 21 DSGVO*/}
            {/*        jederzeit widersprechen. Der Widerspruch kann insbesondere gegen die Verarbeitung für Zwecke der*/}
            {/*        Direktwerbung erfolgen.</p>*/}

            {/*    <h4 className="header4NormalContainer">Cookies und Widerspruchsrecht bei Direktwerbung</h4>*/}

            {/*    <p>Als "Cookies" werden kleine Dateien bezeichnet, die auf Rechnern der Nutzer gespeichert werden.*/}
            {/*        Innerhalb der Cookies können unterschiedliche Angaben gespeichert werden. Ein Cookie dient*/}
            {/*        primär dazu, die Angaben zu einem Nutzer (bzw. dem Gerät auf dem das Cookie gespeichert ist)*/}
            {/*        während oder auch nach seinem Besuch innerhalb eines Onlineangebotes zu speichern. Als temporäre*/}
            {/*        Cookies, bzw. "Session-Cookies" oder "transiente Cookies", werden Cookies bezeichnet, die*/}
            {/*        gelöscht werden, nachdem ein Nutzer ein Onlineangebot verlässt und seinen Browser schließt. In*/}
            {/*        einem solchen Cookie kann z.B. der Inhalt eines Warenkorbs in einem Onlineshop oder ein*/}
            {/*        Login-Status gespeichert werden. Als "permanent" oder "persistent" werden Cookies bezeichnet,*/}
            {/*        die auch nach dem Schließen des Browsers gespeichert bleiben. So kann z.B. der Login-Status*/}
            {/*        gespeichert werden, wenn die Nutzer diese nach mehreren Tagen aufsuchen. Ebenso können in einem*/}
            {/*        solchen Cookie die Interessen der Nutzer gespeichert werden, die für Reichweitenmessung oder*/}
            {/*        Marketingzwecke verwendet werden. Als "Third-Party-Cookie" werden Cookies bezeichnet, die von*/}
            {/*        anderen Anbietern als dem Verantwortlichen, der das Onlineangebot betreibt, angeboten werden*/}
            {/*        (andernfalls, wenn es nur dessen Cookies sind spricht man von "First-Party Cookies").<br/>*/}

            {/*        Wir können temporäre und permanente Cookies einsetzen und klären hierüber im Rahmen unserer*/}
            {/*        Datenschutzerklärung auf.<br/>*/}

            {/*        Falls die Nutzer nicht möchten, dass Cookies auf ihrem Rechner gespeichert werden, werden sie*/}
            {/*        gebeten die entsprechende Option in den Systemeinstellungen ihres Browsers zu deaktivieren.*/}
            {/*        Gespeicherte Cookies können in den Systemeinstellungen des Browsers gelöscht werden. Der*/}
            {/*        Ausschluss von Cookies kann zu Funktionseinschränkungen dieses Onlineangebotes führen.<br/>*/}

            {/*        Ein genereller Widerspruch gegen den Einsatz der zu Zwecken des Onlinemarketing eingesetzten*/}
            {/*        Cookies kann bei einer Vielzahl der Dienste, vor allem im Fall des Trackings, über die*/}
            {/*        US-amerikanische Seite http://www.aboutads.info/choices/ oder die EU-Seite*/}
            {/*        http://www.youronlinechoices.com/ erklärt werden. Des Weiteren kann die Speicherung von Cookies*/}
            {/*        mittels deren Abschaltung in den Einstellungen des Browsers erreicht werden. Bitte beachten Sie,*/}
            {/*        dass dann gegebenenfalls nicht alle Funktionen dieses Onlineangebotes genutzt werden können.</p>*/}

            {/*    <h4 className="header4NormalContainer">Löschung von Daten</h4>*/}

            {/*    <p>Die von uns verarbeiteten Daten werden nach Maßgabe der Art. 17 und 18 DSGVO gelöscht oder in*/}
            {/*        ihrer Verarbeitung eingeschränkt. Sofern nicht im Rahmen dieser Datenschutzerklärung*/}
            {/*        ausdrücklich angegeben, werden die bei uns gespeicherten Daten gelöscht, sobald sie für ihre*/}
            {/*        Zweckbestimmung nicht mehr erforderlich sind und der Löschung keine gesetzlichen*/}
            {/*        Aufbewahrungspflichten entgegenstehen. Sofern die Daten nicht gelöscht werden, weil sie für*/}
            {/*        andere und gesetzlich zulässige Zwecke erforderlich sind, wird deren Verarbeitung eingeschränkt.*/}
            {/*        D.h. die Daten werden gesperrt und nicht für andere Zwecke verarbeitet. Das gilt z.B. für Daten,*/}
            {/*        die aus handels- oder steuerrechtlichen Gründen aufbewahrt werden müssen.<br/>*/}

            {/*        Nach gesetzlichen Vorgaben in Deutschland, erfolgt die Aufbewahrung insbesondere für 10 Jahre*/}
            {/*        gemäß §§ 147 Abs. 1 AO, 257 Abs. 1 Nr. 1 und 4, Abs. 4 HGB (Bücher, Aufzeichnungen,*/}
            {/*        Lageberichte, Buchungsbelege, Handelsbücher, für Besteuerung relevanter Unterlagen, etc.) und 6*/}
            {/*        Jahre gemäß § 257 Abs. 1 Nr. 2 und 3, Abs. 4 HGB (Handelsbriefe).<br/>*/}

            {/*        Nach gesetzlichen Vorgaben in Österreich erfolgt die Aufbewahrung insbesondere für 7 J gemäß §*/}
            {/*        132 Abs. 1 BAO (Buchhaltungsunterlagen, Belege/Rechnungen, Konten, Belege, Geschäftspapiere,*/}
            {/*        Aufstellung der Einnahmen und Ausgaben, etc.), für 22 Jahre im Zusammenhang mit Grundstücken und*/}
            {/*        für 10 Jahre bei Unterlagen im Zusammenhang mit elektronisch erbrachten Leistungen,*/}
            {/*        Telekommunikations-, Rundfunk- und Fernsehleistungen, die an Nichtunternehmer in*/}
            {/*        EU-Mitgliedstaaten erbracht werden und für die der Mini-One-Stop-Shop (MOSS) in Anspruch*/}
            {/*        genommen wird.<br/>*/}
            {/*    </p>*/}

            {/*    <h4 className="header4NormalContainer">Geschäftsbezogene Verarbeitung</h4>*/}

            {/*    <p>Zusätzlich verarbeiten wir<br/>*/}
            {/*    </p>*/}
            {/*    <ul>*/}
            {/*        <li>Vertragsdaten (z.B., Vertragsgegenstand, Laufzeit, Kundenkategorie).</li>*/}
            {/*        <li>Zahlungsdaten (z.B., Bankverbindung, Zahlungshistorie)</li>*/}
            {/*    </ul>*/}
            {/*    von unseren Kunden, Interessenten und Geschäftspartner zwecks Erbringung vertraglicher Leistungen,*/}
            {/*    Service und Kundenpflege, Marketing, Werbung und Marktforschung.<p></p>*/}

            {/*    <h4 className="header4NormalContainer">Erbringung unserer satzungs- und geschäftsgemäßen Leistungen</h4>*/}

            {/*    <p>Wir verarbeiten die Daten unserer Mitglieder, Unterstützer, Interessenten, Kunden oder sonstiger*/}
            {/*        Personen entsprechend Art. 6 Abs. 1 lit. b. DSGVO, sofern wir ihnen gegenüber vertragliche*/}
            {/*        Leistungen anbieten oder im Rahmen bestehender geschäftlicher Beziehung, z.B. gegenüber*/}
            {/*        Mitgliedern, tätig werden oder selbst Empfänger von Leistungen und Zuwendungen sind. Im Übrigen*/}
            {/*        verarbeiten wir die Daten betroffener Personen gem. Art. 6 Abs. 1 lit. f. DSGVO auf Grundlage*/}
            {/*        unserer berechtigten Interessen, z.B. wenn es sich um administrative Aufgaben oder*/}
            {/*        Öffentlichkeitsarbeit handelt.<br/>*/}

            {/*        Die hierbei verarbeiteten Daten, die Art, der Umfang und der Zweck und die Erforderlichkeit*/}
            {/*        ihrer Verarbeitung bestimmen sich nach dem zugrundeliegenden Vertragsverhältnis. Dazu gehören*/}
            {/*        grundsätzlich Bestands- und Stammdaten der Personen (z.B., Name, Adresse, etc.), als auch die*/}
            {/*        Kontaktdaten (z.B., E-Mailadresse, Telefon, etc.), die Vertragsdaten (z.B., in Anspruch*/}
            {/*        genommene Leistungen, mitgeteilte Inhalte und Informationen, Namen von Kontaktpersonen) und*/}
            {/*        sofern wir zahlungspflichtige Leistungen oder Produkte anbieten, Zahlungsdaten (z.B.,*/}
            {/*        Bankverbindung, Zahlungshistorie, etc.).<br/>*/}

            {/*        Wir löschen Daten, die zur Erbringung unserer satzungs- und geschäftsmäßigen Zwecke nicht mehr*/}
            {/*        erforderlich sind. Dies bestimmt sich entsprechend der jeweiligen Aufgaben und vertraglichen*/}
            {/*        Beziehungen. Im Fall geschäftlicher Verarbeitung bewahren wir die Daten so lange auf, wie sie*/}
            {/*        zur Geschäftsabwicklung, als auch im Hinblick auf etwaige Gewährleistungs- oder*/}
            {/*        Haftungspflichten relevant sein können. Die Erforderlichkeit der Aufbewahrung der Daten wird*/}
            {/*        alle drei Jahre überprüft; im Übrigen gelten die gesetzlichen Aufbewahrungspflichten.</p>*/}

            {/*    <h4 className="header4NormalContainer">Hosting</h4>*/}

            {/*    <p>Die von uns in Anspruch genommenen Hosting-Leistungen dienen der Zurverfügungstellung der*/}
            {/*        folgenden Leistungen: Infrastruktur- und Plattformdienstleistungen, Rechenkapazität,*/}
            {/*        Speicherplatz und Datenbankdienste, Sicherheitsleistungen sowie technische Wartungsleistungen,*/}
            {/*        die wir zum Zwecke des Betriebs dieses Onlineangebotes einsetzen.<br/>*/}

            {/*        Hierbei verarbeiten wir, bzw. unser Hostinganbieter Bestandsdaten, Kontaktdaten, Inhaltsdaten,*/}
            {/*        Vertragsdaten, Nutzungsdaten, Meta- und Kommunikationsdaten von Kunden, Interessenten und*/}
            {/*        Besuchern dieses Onlineangebotes auf Grundlage unserer berechtigten Interessen an einer*/}
            {/*        effizienten und sicheren Zurverfügungstellung dieses Onlineangebotes gem. Art. 6 Abs. 1 lit. f*/}
            {/*        DSGVO i.V.m. Art. 28 DSGVO (Abschluss Auftragsverarbeitungsvertrag).</p>*/}

            {/*    <h4 className="header4NormalContainer">Erhebung von Zugriffsdaten und Logfiles</h4>*/}

            {/*    <p>Wir, bzw. unser Hostinganbieter, erhebt auf Grundlage unserer berechtigten Interessen im Sinne*/}
            {/*        des Art. 6 Abs. 1 lit. f. DSGVO Daten über jeden Zugriff auf den Server, auf dem sich dieser*/}
            {/*        Dienst befindet (sogenannte Serverlogfiles). Zu den Zugriffsdaten gehören Name der abgerufenen*/}
            {/*        Webseite, Datei, Datum und Uhrzeit des Abrufs, übertragene Datenmenge, Meldung über*/}
            {/*        erfolgreichen Abruf, Browsertyp nebst Version, das Betriebssystem des Nutzers, Referrer URL (die*/}
            {/*        zuvor besuchte Seite), IP-Adresse und der anfragende Provider.<br/>*/}

            {/*        Logfile-Informationen werden aus Sicherheitsgründen (z.B. zur Aufklärung von Missbrauchs- oder*/}
            {/*        Betrugshandlungen) für die Dauer von maximal 7 Tagen gespeichert und danach gelöscht. Daten,*/}
            {/*        deren weitere Aufbewahrung zu Beweiszwecken erforderlich ist, sind bis zur endgültigen Klärung*/}
            {/*        des jeweiligen Vorfalls von der Löschung ausgenommen.</p>*/}

            {/*    <h4 className="header4NormalContainer">Onlinepräsenzen in sozialen Medien</h4>*/}

            {/*    <p>Wir unterhalten Onlinepräsenzen innerhalb sozialer Netzwerke und Plattformen, um mit den dort*/}
            {/*        aktiven Kunden, Interessenten und Nutzern kommunizieren und sie dort über unsere Leistungen*/}
            {/*        informieren zu können. Beim Aufruf der jeweiligen Netzwerke und Plattformen gelten die*/}
            {/*        Geschäftsbedingungen und die Datenverarbeitungsrichtlinien deren jeweiligen Betreiber.<br/>*/}

            {/*        Soweit nicht anders im Rahmen unserer Datenschutzerklärung angegeben, verarbeiten wir die Daten*/}
            {/*        der Nutzer sofern diese mit uns innerhalb der sozialen Netzwerke und Plattformen kommunizieren,*/}
            {/*        z.B. Beiträge auf unseren Onlinepräsenzen verfassen oder uns Nachrichten zusenden.</p>*/}

            {/*    <h4 className="header4NormalContainer">Einbindung von Diensten und Inhalten Dritter</h4>*/}

            {/*    <p>Wir setzen innerhalb unseres Onlineangebotes auf Grundlage unserer berechtigten Interessen (d.h.*/}
            {/*        Interesse an der Analyse, Optimierung und wirtschaftlichem Betrieb unseres Onlineangebotes im*/}
            {/*        Sinne des Art. 6 Abs. 1 lit. f. DSGVO) Inhalts- oder Serviceangebote von Drittanbietern ein, um*/}
            {/*        deren Inhalte und Services, wie z.B. Videos oder Schriftarten einzubinden (nachfolgend*/}
            {/*        einheitlich bezeichnet als "Inhalte").<br/>*/}

            {/*        Dies setzt immer voraus, dass die Drittanbieter dieser Inhalte, die IP-Adresse der Nutzer*/}
            {/*        wahrnehmen, da sie ohne die IP-Adresse die Inhalte nicht an deren Browser senden könnten. Die*/}
            {/*        IP-Adresse ist damit für die Darstellung dieser Inhalte erforderlich. Wir bemühen uns nur solche*/}
            {/*        Inhalte zu verwenden, deren jeweilige Anbieter die IP-Adresse lediglich zur Auslieferung der*/}
            {/*        Inhalte verwenden. Drittanbieter können ferner so genannte Pixel-Tags (unsichtbare Grafiken,*/}
            {/*        auch als "Web Beacons" bezeichnet) für statistische oder Marketingzwecke verwenden. Durch die*/}
            {/*        "Pixel-Tags" können Informationen, wie der Besucherverkehr auf den Seiten dieser Website*/}
            {/*        ausgewertet werden. Die pseudonymen Informationen können ferner in Cookies auf dem Gerät der*/}
            {/*        Nutzer gespeichert werden und unter anderem technische Informationen zum Browser und*/}
            {/*        Betriebssystem, verweisende Webseiten, Besuchszeit sowie weitere Angaben zur Nutzung unseres*/}
            {/*        Onlineangebotes enthalten, als auch mit solchen Informationen aus anderen Quellen verbunden*/}
            {/*        werden.</p>*/}

            {/*    <h4 className="header4NormalContainer">Vimeo</h4>*/}

            {/*    <p>Wir können die Videos der Plattform "Vimeo" des Anbieters Vimeo Inc., Attention: Legal*/}
            {/*        Department, 555 West 18th Street New York, New York 10011, USA, einbinden. Datenschutzerklärung:*/}
            {/*        https://vimeo.com/privacy. WIr weisen darauf hin, dass Vimeo Google Analytics einsetzen kann und*/}
            {/*        verweisen hierzu auf die Datenschutzerklärung (https://www.google.com/policies/privacy) sowie*/}
            {/*        Opt-Out-Möglichkeiten für Google-Analytics (http://tools.google.com/dlpage/gaoptout?hl=de) oder*/}
            {/*        die Einstellungen von Google für die Datennutzung zu Marketingzwecken*/}
            {/*        (https://adssettings.google.com/.).</p>*/}

            {/*    <h4 className="header4NormalContainer">Youtube</h4>*/}

            {/*    <p>Wir binden die Videos der Plattform "YouTube" des Anbieters Google LLC, 1600 Amphitheatre*/}
            {/*        Parkway, Mountain View, CA 94043, USA, ein. Datenschutzerklärung:*/}
            {/*        https://www.google.com/policies/privacy/, Opt-Out:*/}
            {/*        https://adssettings.google.com/authenticated.</p>*/}

            {/*    <h4 className="header4NormalContainer">Google Fonts</h4>*/}

            {/*    <p>Wir binden die Schriftarten ("Google Fonts") des Anbieters Google LLC, 1600 Amphitheatre Parkway,*/}
            {/*        Mountain View, CA 94043, USA, ein. Datenschutzerklärung:*/}
            {/*        https://www.google.com/policies/privacy/, Opt-Out:*/}
            {/*        https://adssettings.google.com/authenticated.</p>*/}

            {/*    <h4 className="header4NormalContainer">Instagram</h4>*/}

            {/*    <p>Innerhalb unseres Onlineangebotes können Funktionen und Inhalte des Dienstes Instagram, angeboten*/}
            {/*        durch die Instagram Inc., 1601 Willow Road, Menlo Park, CA, 94025, USA, eingebunden werden.*/}
            {/*        Hierzu können z.B. Inhalte wie Bilder, Videos oder Texte und Schaltflächen gehören, mit denen*/}
            {/*        Nutzer ihr Gefallen betreffend die Inhalte kundtun, den Verfassern der Inhalte oder unsere*/}
            {/*        Beiträge abonnieren können. Sofern die Nutzer Mitglieder der Plattform Instagram sind, kann*/}
            {/*        Instagram den Aufruf der o.g. Inhalte und Funktionen den dortigen Profilen der Nutzer zuordnen.*/}
            {/*        Datenschutzerklärung von Instagram: http://instagram.com/about/legal/privacy/.</p>*/}

            {/*    <h4 className="header4NormalContainer">Google reCAPTCHA</h4>*/}

            {/*    <p>Wir nutzen Google reCAPTCHA zur Abwehr von Spam und Missbrauch bei der Übermittlung von Formularen.*/}
            {/*        Anbieter ist Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Durch den Einsatz*/}
            {/*        von reCAPTCHA werden personenbezogene Daten (u.a. IP-Adresse, Angaben zu Ihrem Browser und*/}
            {/*        Verhalten auf unserer Website) an Google übertragen. Die Nutzung erfolgt auf Grundlage unseres*/}
            {/*        berechtigten Interesses an Sicherheit und Funktionsfähigkeit des Onlineangebots gemäß*/}
            {/*        Art. 6 Abs. 1 lit. f DSGVO. Weitere Informationen finden sich in den Datenschutzhinweisen von*/}
            {/*        Google: https://www.google.com/policies/privacy/ und den zusätzlichen Nutzungsbedingungen:*/}
            {/*        https://www.google.com/recaptcha/intro/android.html.</p>*/}

            {/*    <p>Erstellt mit Datenschutz-Generator.de von RA Dr. Thomas Schwenke</p>*/}
            {/*</section>*/}
        </section>
    );
}