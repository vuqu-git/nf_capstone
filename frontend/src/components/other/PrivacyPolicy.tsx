import styles from './PrivacyPolicy.module.css';
import {useLoaderData} from "react-router-dom";
import {OtherDataValuesMap} from "../../types/OtherDataValuesMap.ts";

const PrivacyPolicy = () => {
    const valuesMap = useLoaderData<OtherDataValuesMap>();

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Datenschutzerklärung</h1>

            <section id="m716" className={styles.section}>
                <h2 className={styles.subheading}>Präambel</h2>
                <p className={styles.text}>
                    Mit der folgenden Datenschutzerklärung möchten wir Sie darüber aufklären, welche Arten Ihrer personenbezogenen Daten (nachfolgend auch kurz als "Daten" bezeichnet) wir zu welchen Zwecken und in welchem Umfang verarbeiten. Die Datenschutzerklärung gilt für alle von uns durchgeführten Verarbeitungen personenbezogener Daten, sowohl im Rahmen der Erbringung unserer Leistungen als auch insbesondere auf unseren Webseiten, in mobilen Applikationen sowie innerhalb externer Onlinepräsenzen, wie z. B. unserer Social-Media-Profile (nachfolgend zusammenfassend bezeichnet als "Onlineangebot").
                </p>
                <p className={styles.text}>
                    Die verwendeten Begriffe sind nicht geschlechtsspezifisch.
                </p>
                <p className={styles.text}>
                    Stand: 11. September 2025
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.subheading}>Inhaltsübersicht</h2>
                <ul className={styles.index}>
                    <li><a className="custom-link" href="#m716">Präambel</a></li>
                    <li><a className="custom-link" href="#m3">Verantwortlicher</a></li>
                    <li><a className="custom-link" href="#mOverview">Übersicht der Verarbeitungen</a></li>
                    <li><a className="custom-link" href="#m2427">Maßgebliche Rechtsgrundlagen</a></li>
                    <li><a className="custom-link" href="#m27">Sicherheitsmaßnahmen</a></li>
                    <li><a className="custom-link" href="#m25">Übermittlung von personenbezogenen Daten</a></li>
                    <li><a className="custom-link" href="#m24">Internationale Datentransfers</a></li>
                    <li><a className="custom-link" href="#m12">Allgemeine Informationen zur Datenspeicherung und Löschung</a></li>
                    <li><a className="custom-link" href="#m10">Rechte der betroffenen Personen</a></li>
                    <li><a className="custom-link" href="#m354">Wahrnehmung von Aufgaben nach Satzung oder Geschäftsordnung</a></li>
                    <li><a className="custom-link" href="#m225">Bereitstellung des Onlineangebots und Webhosting</a></li>
                    <li><a className="custom-link" href="#m134">Einsatz von Cookies</a></li>
                    <li><a className="custom-link" href="#m182">Kontakt- und Anfrageverwaltung</a></li>
                    <li><a className="custom-link" href="#m408">Umfragen und Befragungen</a></li>
                    <li><a className="custom-link" href="#m136">Präsenzen in sozialen Netzwerken (Social Media)</a></li>
                    <li><a className="custom-link" href="#m328">Plug-ins und eingebettete Funktionen sowie Inhalte</a></li>
                    <li><a className="custom-link" href="#m42">Begriffsdefinitionen</a></li>
                </ul>
            </section>

            <section id="m3" className={styles.section}>
                <h2 className={styles.subheading}>Verantwortlicher</h2>
                <p className={styles.text}>
                    Pupille e.V.<br />
                    Mertonstr. 26-28<br />
                    60325 Frankfurt am Main<br />
                    Deutschland
                </p>
                <p className={styles.text}>
                    Vertretungsberechtigte Personen (Vorstände): {valuesMap.aktuelleVorstaende}
                </p>
                <p className={styles.text}>
                    <a href="mailto:info(at)pupille.org" className={styles.link}>E-Mail-Adresse</a>
                </p>
            </section>

            <section id="mOverview" className={styles.section}>
                <h2 className={styles.subheading}>Übersicht der Verarbeitungen</h2>
                <p className={styles.text}>
                    Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung zusammen und verweist auf die betroffenen Personen.
                </p>
                <h3 className={styles.subsubheading}>Arten der verarbeiteten Daten</h3>
                <ul className={styles.list}>
                    <li>Bestandsdaten.</li>
                    <li>Zahlungsdaten.</li>
                    <li>Kontaktdaten.</li>
                    <li>Inhaltsdaten.</li>
                    <li>Vertragsdaten.</li>
                    <li>Nutzungsdaten.</li>
                    <li>Meta-, Kommunikations- und Verfahrensdaten.</li>
                    <li>Protokolldaten.</li>
                    <li>Mitgliederdaten.</li>
                </ul>
                <h3 className={styles.subsubheading}>Kategorien betroffener Personen</h3>
                <ul className={styles.list}>
                    <li>Kommunikationspartner.</li>
                    <li>Nutzer.</li>
                    <li>Mitglieder.</li>
                    <li>Teilnehmer.</li>
                </ul>
                <h3 className={styles.subsubheading}>Zwecke der Verarbeitung</h3>
                <ul className={styles.list}>
                    <li>Erbringung vertraglicher Leistungen und Erfüllung vertraglicher Pflichten.</li>
                    <li>Kommunikation.</li>
                    <li>Sicherheitsmaßnahmen.</li>
                    <li>Reichweitenmessung.</li>
                    <li>Tracking.</li>
                    <li>Zielgruppenbildung.</li>
                    <li>Organisations- und Verwaltungsverfahren.</li>
                    <li>Feedback.</li>
                    <li>Umfragen und Fragebögen.</li>
                    <li>Marketing.</li>
                    <li>Profile mit nutzerbezogenen Informationen.</li>
                    <li>Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.</li>
                    <li>Informationstechnische Infrastruktur.</li>
                    <li>Öffentlichkeitsarbeit.</li>
                </ul>
            </section>

            <section id="m2427" className={styles.section}>
                <h2 className={styles.subheading}>Maßgebliche Rechtsgrundlagen</h2>
                <p className={styles.text}>
                    <strong>Maßgebliche Rechtsgrundlagen nach der DSGVO: </strong>Im Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der DSGVO, auf deren Basis wir personenbezogene Daten verarbeiten. Bitte nehmen Sie zur Kenntnis, dass neben den Regelungen der DSGVO nationale Datenschutzvorgaben in Ihrem bzw. unserem Wohn- oder Sitzland gelten können. Sollten ferner im Einzelfall speziellere Rechtsgrundlagen maßgeblich sein, teilen wir Ihnen diese in der Datenschutzerklärung mit.
                </p>
                <ul className={styles.list}>
                    <li><strong>Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO)</strong> - Die betroffene Person hat ihre Einwilligung in die Verarbeitung der sie betreffenden personenbezogenen Daten für einen spezifischen Zweck oder mehrere bestimmte Zwecke gegeben.</li>
                    <li><strong>Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO)</strong> - Die Verarbeitung ist für die Erfüllung eines Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, die auf Anfrage der betroffenen Person erfolgen.</li>
                    <li><strong>Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO)</strong> - die Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten notwendig, vorausgesetzt, dass die Interessen, Grundrechte und Grundfreiheiten der betroffenen Person, die den Schutz personenbezogener Daten verlangen, nicht überwiegen.</li>
                    <li>Vertrag über die Mitgliedschaft (Satzung) (Art. 6 Abs. 1 S. 1 lit. b) DSGVO).</li>
                </ul>
                <p className={styles.text}>
                    <strong>Nationale Datenschutzregelungen in Deutschland: </strong>Zusätzlich zu den Datenschutzregelungen der DSGVO gelten nationale Regelungen zum Datenschutz in Deutschland. Hierzu gehört insbesondere das Gesetz zum Schutz vor Missbrauch personenbezogener Daten bei der Datenverarbeitung (Bundesdatenschutzgesetz – BDSG). Das BDSG enthält insbesondere Spezialregelungen zum Recht auf Auskunft, zum Recht auf Löschung, zum Widerspruchsrecht, zur Verarbeitung besonderer Kategorien personenbezogener Daten, zur Verarbeitung für andere Zwecke und zur Übermittlung sowie automatisierten Entscheidungsfindung im Einzelfall einschließlich Profiling. Ferner können Landesdatenschutzgesetze der einzelnen Bundesländer zur Anwendung gelangen.
                </p>
            </section>

            <section id="m27" className={styles.section}>
                <h2 className={styles.subheading}>Sicherheitsmaßnahmen</h2>
                <p className={styles.text}>
                    Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter Berücksichtigung des Stands der Technik, der Implementierungskosten und der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten und des Ausmaßes der Bedrohung der Rechte und Freiheiten natürlicher Personen geeignete technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau zu gewährleisten.
                </p>
                <p className={styles.text}>
                    Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit, Integrität und Verfügbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs zu den Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der Sicherung der Verfügbarkeit und ihrer Trennung. Des Weiteren haben wir Verfahren eingerichtet, die eine Wahrnehmung von Betroffenenrechten, die Löschung von Daten und Reaktionen auf die Gefährdung der Daten gewährleisten. Ferner berücksichtigen wir den Schutz personenbezogener Daten bereits bei der Entwicklung bzw. Auswahl von Hardware, Software sowie Verfahren entsprechend dem Prinzip des Datenschutzes, durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen.
                </p>
                <p className={styles.text}>
                    Kürzung der IP-Adresse: Sofern IP-Adressen von uns oder von den eingesetzten Dienstleistern und Technologien verarbeitet werden und die Verarbeitung einer vollständigen IP-Adresse nicht erforderlich ist, wird die IP-Adresse gekürzt (auch als "IP-Masking" bezeichnet). Hierbei werden die letzten beiden Ziffern, bzw. der letzte Teil der IP-Adresse nach einem Punkt entfernt, bzw. durch Platzhalter ersetzt. Mit der Kürzung der IP-Adresse soll die Identifizierung einer Person anhand ihrer IP-Adresse verhindert oder wesentlich erschwert werden.
                </p>
                <p className={styles.text}>
                    Sicherung von Online-Verbindungen durch TLS-/SSL-Verschlüsselungstechnologie (HTTPS): Um die Daten der Nutzer, die über unsere Online-Dienste übertragen werden, vor unerlaubten Zugriffen zu schützen, setzen wir auf die TLS-/SSL-Verschlüsselungstechnologie. Secure Sockets Layer (SSL) und Transport Layer Security (TLS) sind die Eckpfeiler der sicheren Datenübertragung im Internet. Diese Technologien verschlüsseln die Informationen, die zwischen der Website oder App und dem Browser des Nutzers (oder zwischen zwei Servern) übertragen werden, wodurch die Daten vor unbefugtem Zugriff geschützt sind. TLS, als die weiterentwickelte und sicherere Version von SSL, gewährleistet, dass alle Datenübertragungen den höchsten Sicherheitsstandards entsprechen. Wenn eine Website durch ein SSL-/TLS-Zertifikat gesichert ist, wird dies durch die Anzeige von HTTPS in der URL signalisiert. Dies dient als ein Indikator für die Nutzer, dass ihre Daten sicher und verschlüsselt übertragen werden.
                </p>
            </section>

            <section id="m25" className={styles.section}>
                <h2 className={styles.subheading}>Übermittlung von personenbezogenen Daten</h2>
                <p className={styles.text}>
                    Im Rahmen unserer Verarbeitung von personenbezogenen Daten kommt es vor, dass diese an andere Stellen, Unternehmen, rechtlich selbstständige Organisationseinheiten oder Personen übermittelt beziehungsweise ihnen gegenüber offengelegt werden. Zu den Empfängern dieser Daten können z. B. mit IT-Aufgaben beauftragte Dienstleister gehören oder Anbieter von Diensten und Inhalten, die in eine Website eingebunden sind. In solchen Fällen beachten wir die gesetzlichen Vorgaben und schließen insbesondere entsprechende Verträge bzw. Vereinbarungen, die dem Schutz Ihrer Daten dienen, mit den Empfängern Ihrer Daten ab.
                </p>
                <p className={styles.text}>
                    Datenübermittlung innerhalb der Organisation: Wir können personenbezogene Daten an andere Abteilungen oder Einheiten innerhalb unserer Organisation übermitteln oder ihnen den Zugriff darauf gewähren. Sofern die Datenweitergabe zu administrativen Zwecken erfolgt, beruht sie auf unseren berechtigten unternehmerischen und betriebswirtschaftlichen Interessen oder erfolgt, sofern sie zur Erfüllung unserer vertragsbezogenen Verpflichtungen erforderlich ist beziehungsweise wenn eine Einwilligung der Betroffenen oder eine gesetzliche Erlaubnis vorliegt.
                </p>
            </section>

            <section id="m24" className={styles.section}>
                <h2 className={styles.subheading}>Internationale Datentransfers</h2>
                <p className={styles.text}>
                    Datenverarbeitung in Drittländern: Sofern wir Daten in ein Drittland (d. h. außerhalb der Europäischen Union (EU) oder des Europäischen Wirtschaftsraums (EWR)) übermitteln oder dies im Rahmen der Nutzung von Diensten Dritter oder der Offenlegung bzw. Übermittlung von Daten an andere Personen, Stellen oder Unternehmen geschieht (was erkennbar wird anhand der Postadresse des jeweiligen Anbieters oder wenn in der Datenschutzerklärung ausdrücklich auf den Datentransfer in Drittländer hingewiesen wird), erfolgt dies stets im Einklang mit den gesetzlichen Vorgaben.
                </p>
                <p className={styles.text}>
                    Für Datenübermittlungen in die USA stützen wir uns vorrangig auf das Data Privacy Framework (DPF), welches durch einen Angemessenheitsbeschluss der EU-Kommission vom 10.07.2023 als sicherer Rechtsrahmen anerkannt wurde. Zusätzlich haben wir mit den jeweiligen Anbietern Standardvertragsklauseln abgeschlossen, die den Vorgaben der EU-Kommission entsprechen und vertragliche Verpflichtungen zum Schutz Ihrer Daten festlegen.
                </p>
                <p className={styles.text}>
                    Diese zweifache Absicherung gewährleistet einen umfassenden Schutz Ihrer Daten: Das DPF bildet die primäre Schutzebene, während die Standardvertragsklauseln als zusätzliche Sicherheit dienen. Sollten sich Änderungen im Rahmen des DPF ergeben, greifen die Standardvertragsklauseln als zuverlässige Rückfalloption ein. So stellen wir sicher, dass Ihre Daten auch bei etwaigen politischen oder rechtlichen Veränderungen stets angemessen geschützt bleiben.
                </p>
                <p className={styles.text}>
                    Bei den einzelnen Diensteanbietern informieren wir Sie darüber, ob sie nach dem DPF zertifiziert sind und ob Standardvertragsklauseln vorliegen. Weitere Informationen zum DPF und eine Liste der zertifizierten Unternehmen finden Sie auf der Website des US-Handelsministeriums unter <a href="https://www.dataprivacyframework.gov/" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.dataprivacyframework.gov/</a> (in englischer Sprache).
                </p>
                <p className={styles.text}>
                    Für Datenübermittlungen in andere Drittländer gelten entsprechende Sicherheitsmaßnahmen, insbesondere Standardvertragsklauseln, ausdrückliche Einwilligungen oder gesetzlich erforderliche Übermittlungen. Informationen zu Drittlandtransfers und geltenden Angemessenheitsbeschlüssen können Sie dem Informationsangebot der EU-Kommission entnehmen: <a href="https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection_en?prefLang=de" target="_blank" rel="noopener noreferrer" className={styles.link}>https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection_en?prefLang=de</a>.
                </p>
            </section>

            <section id="m12" className={styles.section}>
                <h2 className={styles.subheading}>Allgemeine Informationen zur Datenspeicherung und Löschung</h2>
                <p className={styles.text}>
                    Wir löschen personenbezogene Daten, die wir verarbeiten, gemäß den gesetzlichen Bestimmungen, sobald die zugrundeliegenden Einwilligungen widerrufen werden oder keine weiteren rechtlichen Grundlagen für die Verarbeitung bestehen. Dies betrifft Fälle, in denen der ursprüngliche Verarbeitungszweck entfällt oder die Daten nicht mehr benötigt werden. Ausnahmen von dieser Regelung bestehen, wenn gesetzliche Pflichten oder besondere Interessen eine längere Aufbewahrung oder Archivierung der Daten erfordern.
                </p>
                <p className={styles.text}>
                    Insbesondere müssen Daten, die aus handels- oder steuerrechtlichen Gründen aufbewahrt werden müssen oder deren Speicherung notwendig ist zur Rechtsverfolgung oder zum Schutz der Rechte anderer natürlicher oder juristischer Personen, entsprechend archiviert werden.
                </p>
                <p className={styles.text}>
                    Unsere Datenschutzhinweise enthalten zusätzliche Informationen zur Aufbewahrung und Löschung von Daten, die speziell für bestimmte Verarbeitungsprozesse gelten.
                </p>
                <p className={styles.text}>
                    Bei mehreren Angaben zur Aufbewahrungsdauer oder Löschungsfristen eines Datums, ist stets die längste Frist maßgeblich. Daten, die nicht mehr für den ursprünglich vorgesehenen Zweck, sondern aufgrund gesetzlicher Vorgaben oder anderer Gründe aufbewahrt werden, verarbeiten wir ausschließlich zu den Gründen, die ihre Aufbewahrung rechtfertigen.
                </p>
                <p className={styles.text}>
                    Aufbewahrung und Löschung von Daten: Die folgenden allgemeinen Fristen gelten für die Aufbewahrung und Archivierung nach deutschem Recht:
                </p>
                <ul className={styles.list}>
                    <li>10 Jahre - Aufbewahrungsfrist für Bücher und Aufzeichnungen, Jahresabschlüsse, Inventare, Lageberichte, Eröffnungsbilanz sowie die zu ihrem Verständnis erforderlichen Arbeitsanweisungen und sonstigen Organisationsunterlagen (§ 147 Abs. 1 Nr. 1 i.V.m. Abs. 3 AO, § 14b Abs. 1 UStG, § 257 Abs. 1 Nr. 1 i.V.m. Abs. 4 HGB).</li>
                    <li>8 Jahre - Buchungsbelege, wie z. B. Rechnungen und Kostenbelege (§ 147 Abs. 1 Nr. 4 und 4a i.V.m. Abs. 3 Satz 1 AO sowie § 257 Abs. 1 Nr. 4 i.V.m. Abs. 4 HGB).</li>
                    <li>6 Jahre - Übrige Geschäftsunterlagen: empfangene Handels- oder Geschäftsbriefe, Wiedergaben der abgesandten Handels- oder Geschäftsbriefe, sonstige Unterlagen, soweit sie für die Besteuerung von Bedeutung sind, z. B. Stundenlohnzettel, Betriebsabrechnungsbögen, Kalkulationsunterlagen, Preisauszeichnungen, aber auch Lohnabrechnungsunterlagen, soweit sie nicht bereits Buchungsbelege sind und Kassenstreifen (§ 147 Abs. 1 Nr. 2, 3, 5 i.V.m. Abs. 3 AO, § 257 Abs. 1 Nr. 2 u. 3 i.V.m. Abs. 4 HGB).</li>
                    <li>3 Jahre - Daten, die erforderlich sind, um potenzielle Gewährleistungs- und Schadensersatzansprüche oder ähnliche vertragliche Ansprüche und Rechte zu berücksichtigen sowie damit verbundene Anfragen zu bearbeiten, basierend auf früheren Geschäftserfahrungen und üblichen Branchenpraktiken, werden für die Dauer der regulären gesetzlichen Verjährungsfrist von drei Jahren gespeichert (§§ 195, 199 BGB).</li>
                </ul>
                <p className={styles.text}>
                    Fristbeginn mit Ablauf des Jahres: Beginnt eine Frist nicht ausdrücklich zu einem bestimmten Datum und beträgt sie mindestens ein Jahr, so startet sie automatisch am Ende des Kalenderjahres, in dem das fristauslösende Ereignis eingetreten ist. Im Fall laufender Vertragsverhältnisse, in deren Rahmen Daten gespeichert werden, ist das fristauslösende Ereignis der Zeitpunkt des Wirksamwerdens der Kündigung oder sonstige Beendigung des Rechtsverhältnisses.
                </p>
            </section>

            <section id="m10" className={styles.section}>
                <h2 className={styles.subheading}>Rechte der betroffenen Personen</h2>
                <p className={styles.text}>
                    Rechte der betroffenen Personen aus der DSGVO: Ihnen stehen als Betroffene nach der DSGVO verschiedene Rechte zu, die sich insbesondere aus Art. 15 bis 21 DSGVO ergeben:
                </p>
                <ul className={styles.list}>
                    <li><strong>Widerspruchsrecht:</strong> Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen; dies gilt auch für ein auf diese Bestimmungen gestütztes Profiling. Werden die Sie betreffenden personenbezogenen Daten verarbeitet, um Direktwerbung zu betreiben, haben Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten zum Zwecke derartiger Werbung einzulegen; dies gilt auch für das Profiling, soweit es mit solcher Direktwerbung in Verbindung steht.</li>
                    <li><strong>Widerrufsrecht bei Einwilligungen:</strong> Sie haben das Recht, erteilte Einwilligungen jederzeit zu widerrufen.</li>
                    <li><strong>Auskunftsrecht:</strong> Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten verarbeitet werden und auf Auskunft über diese Daten sowie auf weitere Informationen und Kopie der Daten entsprechend den gesetzlichen Vorgaben.</li>
                    <li><strong>Recht auf Berichtigung:</strong> Sie haben entsprechend den gesetzlichen Vorgaben das Recht, die Vervollständigung der Sie betreffenden Daten oder die Berichtigung der Sie betreffenden unrichtigen Daten zu verlangen.</li>
                    <li><strong>Recht auf Löschung und Einschränkung der Verarbeitung:</strong> Sie haben nach Maßgabe der gesetzlichen Vorgaben das Recht, zu verlangen, dass Sie betreffende Daten unverzüglich gelöscht werden, bzw. alternativ nach Maßgabe der gesetzlichen Vorgaben eine Einschränkung der Verarbeitung der Daten zu verlangen.</li>
                    <li><strong>Recht auf Datenübertragbarkeit:</strong> Sie haben das Recht, Sie betreffende Daten, die Sie uns bereitgestellt haben, nach Maßgabe der gesetzlichen Vorgaben in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten oder deren Übermittlung an einen anderen Verantwortlichen zu fordern.</li>
                    <li><strong>Beschwerde bei Aufsichtsbehörde:</strong> Sie haben unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs das Recht auf Beschwerde bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthaltsorts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die Vorgaben der DSGVO verstößt.</li>
                </ul>
            </section>

            <section id="m354" className={styles.section}>
                <h2 className={styles.subheading}>Wahrnehmung von Aufgaben nach Satzung oder Geschäftsordnung</h2>
                <p className={styles.text}>
                    Wir verarbeiten die Daten unserer Mitglieder, Unterstützer, Interessenten, Geschäftspartner oder sonstiger Personen (Zusammenfassend "Betroffene"), wenn wir mit ihnen in einem Mitgliedschafts- oder sonstigem geschäftlichen Verhältnis stehen und unsere Aufgaben wahrnehmen sowie Empfänger von Leistungen und Zuwendungen sind. Im Übrigen verarbeiten wir die Daten Betroffener auf Grundlage unserer berechtigten Interessen, z. B. wenn es sich um administrative Aufgaben oder Öffentlichkeitsarbeit handelt.
                </p>
                <p className={styles.text}>
                    Die hierbei verarbeiteten Daten, die Art, der Umfang und der Zweck und die Erforderlichkeit ihrer Verarbeitung, bestimmen sich nach dem zugrundeliegenden Mitgliedschafts- oder Vertragsverhältnis, aus dem sich auch die Erforderlichkeit etwaiger Datenangaben ergeben (im Übrigen weisen wir auf erforderliche Daten hin).
                </p>
                <p className={styles.text}>
                    Wir löschen Daten, die zur Erbringung unserer satzungs- und geschäftsmäßigen Zwecke nicht mehr erforderlich sind. Dies bestimmt sich entsprechend der jeweiligen Aufgaben und vertraglichen Beziehungen. Wir bewahren die Daten so lange auf, wie sie zur Geschäftsabwicklung, als auch im Hinblick auf etwaige Gewährleistungs- oder Haftungspflichten auf Grundlage unserer berechtigten Interesse an deren Regelung relevant sein können. Die Erforderlichkeit der Aufbewahrung der Daten wird regelmäßig überprüft; im Übrigen gelten die gesetzlichen Aufbewahrungspflichten.
                </p>
                <ul className={styles.list}>
                    <li><strong>Verarbeitete Datenarten:</strong> Bestandsdaten (z. B. der vollständige Name, Wohnadresse, Kontaktinformationen, Kundennummer, etc.); Kontaktdaten (z. B. Post- und E-Mail-Adressen oder Telefonnummern); Vertragsdaten (z. B. Vertragsgegenstand, Laufzeit, Kundenkategorie); Mitgliederdaten (z.B.  persönliche Daten wie Name, Alter, Geschlecht, Kontaktdaten (E-Mail-Adresse, Telefonnummer), Mitgliedsnummer, Informationen über  Mitgliedsbeiträge, Teilnahme an Veranstaltungen, etc.); Zahlungsdaten (z. B. Bankverbindungen, Rechnungen, Zahlungshistorie). Inhaltsdaten (z. B. textliche oder bildliche Nachrichten und Beiträge sowie die sie betreffenden Informationen, wie z. B. Angaben zur Autorenschaft oder Zeitpunkt der Erstellung).</li>
                    <li><strong>Betroffene Personen:</strong> Mitglieder.</li>
                    <li><strong>Zwecke der Verarbeitung:</strong> Kommunikation. Organisations- und Verwaltungsverfahren.</li>
                    <li><strong>Aufbewahrung und Löschung:</strong> Löschung entsprechend Angaben im Abschnitt "Allgemeine Informationen zur Datenspeicherung und Löschung".</li>
                    <li><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO). Vertrag über die Mitgliedschaft (Satzung) (Art. 6 Abs. 1 S. 1 lit. b) DSGVO).</li>
                </ul>
                <p className={styles.text}><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
                <ul className={styles.list}>
                    <li><strong>Mitgliederverwaltung: </strong>Verfahren, die im Rahmen der Mitgliederverwaltung erforderlich sind, umfassen die Akquise und Aufnahme neuer Mitglieder, die Entwicklung und Umsetzung von Strategien zur Mitgliederbindung sowie die Sicherstellung einer effektiven Kommunikation mit den Mitgliedern. Diese Prozesse beinhalten die sorgfältige Erfassung und Pflege von Mitgliederdaten, die regelmäßige Aktualisierung von Mitgliedsinformationen und die Verwaltung von Mitgliedsbeiträgen einschließlich der Rechnungsstellung und Abrechnung; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO), Vertrag über die Mitgliedschaft (Satzung) (Art. 6 Abs. 1 S. 1 lit. b) DSGVO).</span></li>
                    <li><strong>Veranstaltungen und Organisationsbetrieb: </strong>Planung, Durchführung und Nachbereitung von Veranstaltungen sowie den allgemeinen Betrieb der satzungsmäßigen Aktivitäten. Die Planung beinhaltet die Erfassung und Verarbeitung von Teilnehmerdaten, Koordination der logistischen Anforderungen und Festlegung der Veranstaltungsagenda. Die Durchführung umfasst das Management der Teilnehmerregistrierung, die Aktualisierung der Teilnehmerinformationen während der Veranstaltung und die Erfassung der Anwesenheit und Teilnehmeraktivitäten. Die Nachbereitung beinhaltet die Analyse der Teilnehmerdaten zur Bewertung des Veranstaltungserfolgs, die Erstellung von Berichten und die Archivierung relevanter Informationen zur Veranstaltung. Zum allgemeinen Organisationsbetrieb gehören die Verwaltung von Mitgliederdaten, die Kommunikation mit Mitgliedern und Interessenten sowie die Organisation interner Meetings und Sitzungen; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO), Vertrag über die Mitgliedschaft (Satzung) (Art. 6 Abs. 1 S. 1 lit. b) DSGVO).</span></li>
                </ul>
            </section>

            <section id="m225" className={styles.section}>
                <h2 className={styles.subheading}>Bereitstellung des Onlineangebots und Webhosting</h2>
                <p className={styles.text}>
                    Wir verarbeiten die Daten der Nutzer, um ihnen unsere Online-Dienste zur Verfügung stellen zu können. Zu diesem Zweck verarbeiten wir die IP-Adresse des Nutzers, die notwendig ist, um die Inhalte und Funktionen unserer Online-Dienste an den Browser oder das Endgerät der Nutzer zu übermitteln.
                </p>
                <ul className={styles.list}>
                    <li><strong>Verarbeitete Datenarten:</strong> Nutzungsdaten (z. B. Seitenaufrufe und Verweildauer, Klickpfade, Nutzungsintensität und -frequenz, verwendete Gerätetypen und Betriebssysteme, Interaktionen mit Inhalten und Funktionen); Meta-, Kommunikations- und Verfahrensdaten (z. B. IP-Adressen, Zeitangaben, Identifikationsnummern, beteiligte Personen); Protokolldaten (z. B. Logfiles betreffend Logins oder den Abruf von Daten oder Zugriffszeiten.). Inhaltsdaten (z. B. textliche oder bildliche Nachrichten und Beiträge sowie die sie betreffenden Informationen, wie z. B. Angaben zur Autorenschaft oder Zeitpunkt der Erstellung).</li>
                    <li><strong>Betroffene Personen:</strong> Nutzer (z. B. Webseitenbesucher, Nutzer von Onlinediensten).</li>
                    <li><strong>Zwecke der Verarbeitung:</strong> Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit; Informationstechnische Infrastruktur (Betrieb und Bereitstellung von Informationssystemen und technischen Geräten (Computer, Server etc.)); Sicherheitsmaßnahmen. Erbringung vertraglicher Leistungen und Erfüllung vertraglicher Pflichten.</li>
                    <li><strong>Aufbewahrung und Löschung:</strong> Löschung entsprechend Angaben im Abschnitt "Allgemeine Informationen zur Datenspeicherung und Löschung".</li>
                    <li><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).</li>
                </ul>
                <p className={styles.text}><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
                <ul className={styles.list}>
                    <li><strong>Bereitstellung Onlineangebot auf gemietetem Speicherplatz: </strong>Für die Bereitstellung unseres Onlineangebotes nutzen wir Speicherplatz, Rechenkapazität und Software, die wir von einem entsprechenden Serveranbieter (auch "Webhoster" genannt) mieten oder anderweitig beziehen; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).</span></li>
                    <li><strong>Bereitstellung Onlineangebot auf eigener/ dedizierter Serverhardware: </strong>Für die Bereitstellung unseres Onlineangebotes nutzen wir von uns betriebene Serverhardware sowie den damit verbundenen Speicherplatz, die Rechenkapazität und die Software; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).</span></li>
                    <li><strong>Erhebung von Zugriffsdaten und Logfiles: </strong>Der Zugriff auf unser Onlineangebot wird in Form von sogenannten "Server-Logfiles" protokolliert. Zu den Serverlogfiles können die Adresse und der Name der abgerufenen Webseiten und Dateien, Datum und Uhrzeit des Abrufs, übertragene Datenmengen, Meldung über erfolgreichen Abruf, Browsertyp nebst Version, das Betriebssystem des Nutzers, Referrer URL (die zuvor besuchte Seite) und im Regelfall IP-Adressen und der anfragende Provider gehören. Die Serverlogfiles können zum einen zu Sicherheitszwecken eingesetzt werden, z. B. um eine Überlastung der Server zu vermeiden (insbesondere im Fall von missbräuchlichen Angriffen, sogenannten DDoS-Attacken), und zum anderen, um die Auslastung der Server und ihre Stabilität sicherzustellen; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO). </span><strong>Löschung von Daten:</strong> Logfile-Informationen werden für die Dauer von maximal 30 Tagen gespeichert und danach gelöscht oder anonymisiert. Daten, deren weitere Aufbewahrung zu Beweiszwecken erforderlich ist, sind bis zur endgültigen Klärung des jeweiligen Vorfalls von der Löschung ausgenommen.</li>
                    <li><strong>E-Mail-Versand und -Hosting: </strong>Die von uns in Anspruch genommenen Webhosting-Leistungen umfassen ebenfalls den Versand, den Empfang sowie die Speicherung von E-Mails. Zu diesen Zwecken werden die Adressen der Empfänger sowie Absender als auch weitere Informationen betreffend den E-Mailversand (z. B. die beteiligten Provider) sowie die Inhalte der jeweiligen E-Mails verarbeitet. Die vorgenannten Daten können ferner zu Zwecken der Erkennung von SPAM verarbeitet werden. Wir bitten darum, zu beachten, dass E-Mails im Internet grundsätzlich nicht verschlüsselt versendet werden. Im Regelfall werden E-Mails zwar auf dem Transportweg verschlüsselt, aber (sofern kein sogenanntes Ende-zu-Ende-Verschlüsselungsverfahren eingesetzt wird) nicht auf den Servern, von denen sie abgesendet und empfangen werden. Wir können daher für den Übertragungsweg der E-Mails zwischen dem Absender und dem Empfang auf unserem Server keine Verantwortung übernehmen; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).</span></li>
                    <li><strong>1&1 IONOS: </strong>Leistungen auf dem Gebiet der Bereitstellung von informationstechnischer Infrastruktur und verbundenen Dienstleistungen (z. B. Speicherplatz und/oder Rechenkapazitäten); <strong>Dienstanbieter:</strong> 1&1 IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, Deutschland; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO); </span><strong>Website:</strong> <a href="https://www.ionos.de" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.ionos.de</a>; <strong>Datenschutzerklärung:</strong> <a href="https://www.ionos.de/terms-gtc/terms-privacy" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.ionos.de/terms-gtc/terms-privacy</a>. <strong>Auftragsverarbeitungsvertrag:</strong> <a href="https://www.ionos.de/hilfe/datenschutz/allgemeine-informationen-zur-datenschutz-grundverordnung-dsgvo/vereinbarung-zur-auftragsverarbeitung-avv-mit-ionos-abschliessen/" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.ionos.de/hilfe/datenschutz/allgemeine-informationen-zur-datenschutz-grundverordnung-dsgvo/vereinbarung-zur-auftragsverarbeitung-avv-mit-ionos-abschliessen/</a>.</li>
                </ul>
            </section>

            <section id="m134" className={styles.section}>
                <h2 className={styles.subheading}>Einsatz von Cookies</h2>
                <p className={styles.text}>
                    Unter dem Begriff „Cookies" werden Funktionen, die Informationen auf Endgeräten der Nutzer speichern und aus ihnen auslesen, verstanden. Cookies können ferner in Bezug auf unterschiedliche Anliegen Einsatz finden, etwa zu Zwecken der Funktionsfähigkeit, der Sicherheit und des Komforts von Onlineangeboten sowie der Erstellung von Analysen der Besucherströme. Wir verwenden Cookies gemäß den gesetzlichen Vorschriften. Dazu holen wir, wenn erforderlich, vorab die Zustimmung der Nutzer ein. Ist eine Zustimmung nicht notwendig, setzen wir auf unsere berechtigten Interessen. Dies gilt, wenn das Speichern und Auslesen von Informationen unerlässlich ist, um ausdrücklich angeforderte Inhalte und Funktionen bereitstellen zu können. Dazu zählen etwa die Speicherung von Einstellungen sowie die Sicherstellung der Funktionalität und Sicherheit unseres Onlineangebots. Die Einwilligung kann jederzeit widerrufen werden. Wir informieren klar über deren Umfang und welche Cookies genutzt werden.
                </p>
                <p className={styles.text}>
                    <strong>Hinweise zu datenschutzrechtlichen Rechtsgrundlagen: </strong>Ob wir personenbezogene Daten mithilfe von Cookies verarbeiten, hängt von einer Einwilligung ab. Liegt eine Einwilligung vor, dient sie als Rechtsgrundlage. Ohne Einwilligung stützen wir uns auf unsere berechtigten Interessen, die vorstehend in diesem Abschnitt und im Kontext der jeweiligen Dienste und Verfahren erläutert sind.
                </p>
                <p className={styles.text}>
                    <strong>Speicherdauer: </strong>Im Hinblick auf die Speicherdauer werden die folgenden Arten von Cookies unterschieden:
                </p>
                <ul className={styles.list}>
                    <li><strong>Temporäre Cookies (auch: Session- oder Sitzungscookies):</strong> Temporäre Cookies werden spätestens gelöscht, nachdem ein Nutzer ein Onlineangebot verlassen und sein Endgerät (z. B. Browser oder mobile Applikation) geschlossen hat.</li>
                    <li><strong>Permanente Cookies:</strong> Permanente Cookies bleiben auch nach dem Schließen des Endgeräts gespeichert. So können beispielsweise der Log-in-Status gespeichert und bevorzugte Inhalte direkt angezeigt werden, wenn der Nutzer eine Website erneut besucht. Ebenso können die mithilfe von Cookies erhobenen Nutzerdaten zur Reichweitenmessung Verwendung finden. Sofern wir Nutzern keine expliziten Angaben zur Art und Speicherdauer von Cookies mitteilen (z. B. im Rahmen der Einholung der Einwilligung), sollten sie davon ausgehen, dass diese permanent sind und die Speicherdauer bis zu zwei Jahre betragen kann.</li>
                </ul>
                <p className={styles.text}>
                    <strong>Allgemeine Hinweise zum Widerruf und Widerspruch (Opt-out): </strong>Nutzer können die von ihnen abgegebenen Einwilligungen jederzeit widerrufen und zudem einen Widerspruch gegen die Verarbeitung entsprechend den gesetzlichen Vorgaben, auch mittels der Privatsphäre-Einstellungen ihres Browsers, erklären.
                </p>
                <ul className={styles.list}>
                    <li><strong>Verarbeitete Datenarten:</strong> Meta-, Kommunikations- und Verfahrensdaten (z. B. IP-Adressen, Zeitangaben, Identifikationsnummern, beteiligte Personen).</li>
                    <li><strong>Betroffene Personen:</strong> Nutzer (z. B. Webseitenbesucher, Nutzer von Onlinediensten).</li>
                    <li><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).</li>
                </ul>
            </section>

            <section id="m182" className={styles.section}>
                <h2 className={styles.subheading}>Kontakt- und Anfrageverwaltung</h2>
                <p className={styles.text}>
                    Bei der Kontaktaufnahme mit uns (z. B. per Post, Kontaktformular, E-Mail, Telefon oder via soziale Medien) sowie im Rahmen bestehender Nutzer- und Geschäftsbeziehungen werden die Angaben der anfragenden Personen verarbeitet, soweit dies zur Beantwortung der Kontaktanfragen und etwaiger angefragter Maßnahmen erforderlich ist.
                </p>
                <ul className={styles.list}>
                    <li><strong>Verarbeitete Datenarten:</strong> Bestandsdaten (z. B. der vollständige Name, Wohnadresse, Kontaktinformationen, Kundennummer, etc.); Kontaktdaten (z. B. Post- und E-Mail-Adressen oder Telefonnummern); Inhaltsdaten (z. B. textliche oder bildliche Nachrichten und Beiträge sowie die sie betreffenden Informationen, wie z. B. Angaben zur Autorenschaft oder Zeitpunkt der Erstellung); Nutzungsdaten (z. B. Seitenaufrufe und Verweildauer, Klickpfade, Nutzungsintensität und -frequenz, verwendete Gerätetypen und Betriebssysteme, Interaktionen mit Inhalten und Funktionen). Meta-, Kommunikations- und Verfahrensdaten (z. B. IP-Adressen, Zeitangaben, Identifikationsnummern, beteiligte Personen).</li>
                    <li><strong>Betroffene Personen:</strong> Kommunikationspartner.</li>
                    <li><strong>Zwecke der Verarbeitung:</strong> Kommunikation; Organisations- und Verwaltungsverfahren; Feedback (z. B. Sammeln von Feedback via Online-Formular). Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.</li>
                    <li><strong>Aufbewahrung und Löschung:</strong> Löschung entsprechend Angaben im Abschnitt "Allgemeine Informationen zur Datenspeicherung und Löschung".</li>
                    <li><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO). Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO).</li>
                </ul>
                <p className={styles.text}><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
                <ul className={styles.list}>
                    <li><strong>Kontaktformular: </strong>Bei Kontaktaufnahme über unser Kontaktformular, per E-Mail oder anderen Kommunikationswegen, verarbeiten wir die uns übermittelten personenbezogenen Daten zur Beantwortung und Bearbeitung des jeweiligen Anliegens. Dies umfasst in der Regel Angaben wie Name, Kontaktinformationen und gegebenenfalls weitere Informationen, die uns mitgeteilt werden und zur angemessenen Bearbeitung erforderlich sind. Wir nutzen diese Daten ausschließlich für den angegebenen Zweck der Kontaktaufnahme und Kommunikation; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO), Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).</span></li>
                </ul>
            </section>

            <section id="m408" className={styles.section}>
                <h2 className={styles.subheading}>Umfragen und Befragungen</h2>
                <p className={styles.text}>
                    Wir führen Umfragen und Befragungen durch, um Informationen für den jeweils kommunizierten Umfrage-  bzw. Befragungszweck, zu sammeln. Die von uns durchgeführten Umfragen und Befragungen (nachfolgend "Befragungen") werden anonym ausgewertet. Eine Verarbeitung personenbezogener Daten erfolgt nur insoweit, als dies zu Bereitstellung und technischen Durchführung der Umfragen erforderlich ist (z. B. Verarbeitung der IP-Adresse, um die Umfrage im Browser des Nutzers darzustellen oder mithilfe eines Cookies eine Wiederaufnahme der Umfrage zu ermöglichen).
                </p>
                <ul className={styles.list}>
                    <li><strong>Verarbeitete Datenarten:</strong> Bestandsdaten (z. B. der vollständige Name, Wohnadresse, Kontaktinformationen, Kundennummer, etc.); Kontaktdaten (z. B. Post- und E-Mail-Adressen oder Telefonnummern); Inhaltsdaten (z. B. textliche oder bildliche Nachrichten und Beiträge sowie die sie betreffenden Informationen, wie z. B. Angaben zur Autorenschaft oder Zeitpunkt der Erstellung). Nutzungsdaten (z. B. Seitenaufrufe und Verweildauer, Klickpfade, Nutzungsintensität und -frequenz, verwendete Gerätetypen und Betriebssysteme, Interaktionen mit Inhalten und Funktionen).</li>
                    <li><strong>Betroffene Personen:</strong> Teilnehmer.</li>
                    <li><strong>Zwecke der Verarbeitung:</strong> Feedback (z. B. Sammeln von Feedback via Online-Formular). Umfragen und Fragebögen (z. B. Umfragen mit Eingabemöglichkeiten, Multiple-Choice-Fragen).</li>
                    <li><strong>Aufbewahrung und Löschung:</strong> Löschung entsprechend Angaben im Abschnitt "Allgemeine Informationen zur Datenspeicherung und Löschung".</li>
                    <li><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).</li>
                </ul>
                <p className={styles.text}><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
                <ul className={styles.list}>
                    <li><strong>Google-Formular: </strong>Erstellung und Auswertung von Onineformularen, Umfragen, Feedbackbögen, etc; <strong>Dienstanbieter:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO); </span><strong>Website:</strong> <a href="https://www.google.de/intl/de/forms" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.google.de/intl/de/forms</a>; <strong>Datenschutzerklärung:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.link}>https://policies.google.com/privacy</a>; <strong>Auftragsverarbeitungsvertrag:</strong> <a href="https://cloud.google.com/terms/data-processing-addendum" target="_blank" rel="noopener noreferrer" className={styles.link}>https://cloud.google.com/terms/data-processing-addendum</a>. <strong>Grundlage Drittlandtransfers:</strong> Data Privacy Framework (DPF), Standardvertragsklauseln (<a href="https://cloud.google.com/terms/eu-model-contract-clause" target="_blank" rel="noopener noreferrer" className={styles.link}>https://cloud.google.com/terms/eu-model-contract-clause</a>).</li>
                </ul>
            </section>

            <section id="m136" className={styles.section}>
                <h2 className={styles.subheading}>Präsenzen in sozialen Netzwerken (Social Media)</h2>
                <p className={styles.text}>
                    Wir unterhalten Onlinepräsenzen innerhalb sozialer Netzwerke und verarbeiten in diesem Rahmen Nutzerdaten, um mit den dort aktiven Nutzern zu kommunizieren oder Informationen über uns anzubieten.
                </p>
                <p className={styles.text}>
                    Wir weisen darauf hin, dass dabei Nutzerdaten außerhalb des Raumes der Europäischen Union verarbeitet werden können. Hierdurch können sich für die Nutzer Risiken ergeben, weil so zum Beispiel die Durchsetzung der Nutzerrechte erschwert werden könnte.
                </p>
                <p className={styles.text}>
                    Ferner werden die Daten der Nutzer innerhalb sozialer Netzwerke im Regelfall für Marktforschungs- und Werbezwecke verarbeitet. So können beispielsweise anhand des Nutzungsverhaltens und sich daraus ergebender Interessen der Nutzer Nutzungsprofile erstellt werden. Letztere finden möglicherweise wiederum Verwendung, um etwa Werbeanzeigen innerhalb und außerhalb der Netzwerke zu schalten, die mutmaßlich den Interessen der Nutzer entsprechen. Daher werden im Regelfall Cookies auf den Rechnern der Nutzer gespeichert, in denen das Nutzungsverhalten und die Interessen der Nutzer gespeichert werden. Zudem können in den Nutzungsprofilen auch Daten unabhängig der von den Nutzern verwendeten Geräten gespeichert werden (insbesondere, wenn sie Mitglieder der jeweiligen Plattformen und dort eingeloggt sind).
                </p>
                <p className={styles.text}>
                    Für eine detaillierte Darstellung der jeweiligen Verarbeitungsformen und der Widerspruchsmöglichkeiten (Opt-out) verweisen wir auf die Datenschutzerklärungen und Angaben der Betreiber der jeweiligen Netzwerke.
                </p>
                <p className={styles.text}>
                    Auch im Fall von Auskunftsanfragen und der Geltendmachung von Betroffenenrechten weisen wir darauf hin, dass diese am effektivsten bei den Anbietern geltend gemacht werden können. Nur Letztere haben jeweils Zugriff auf die Nutzerdaten und können direkt entsprechende Maßnahmen ergreifen und Auskünfte geben. Sollten Sie dennoch Hilfe benötigen, dann können Sie sich an uns wenden.
                </p>
                <ul className={styles.list}>
                    <li><strong>Verarbeitete Datenarten:</strong> Kontaktdaten (z. B. Post- und E-Mail-Adressen oder Telefonnummern); Inhaltsdaten (z. B. textliche oder bildliche Nachrichten und Beiträge sowie die sie betreffenden Informationen, wie z. B. Angaben zur Autorenschaft oder Zeitpunkt der Erstellung). Nutzungsdaten (z. B. Seitenaufrufe und Verweildauer, Klickpfade, Nutzungsintensität und -frequenz, verwendete Gerätetypen und Betriebssysteme, Interaktionen mit Inhalten und Funktionen).</li>
                    <li><strong>Betroffene Personen:</strong> Nutzer (z. B. Webseitenbesucher, Nutzer von Onlinediensten).</li>
                    <li><strong>Zwecke der Verarbeitung:</strong> Kommunikation; Feedback (z. B. Sammeln von Feedback via Online-Formular). Öffentlichkeitsarbeit.</li>
                    <li><strong>Aufbewahrung und Löschung:</strong> Löschung entsprechend Angaben im Abschnitt "Allgemeine Informationen zur Datenspeicherung und Löschung".</li>
                    <li><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).</li>
                </ul>
                <p className={styles.text}><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
                <ul className={styles.list}>
                    <li><strong>Instagram: </strong>Soziales Netzwerk, ermöglicht das Teilen von Fotos und Videos, das Kommentieren und Favorisieren von Beiträgen, Nachrichtenversand, Abonnieren von Profilen und Seiten; <strong>Dienstanbieter:</strong> Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO); </span><strong>Website:</strong> <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.instagram.com</a>; <strong>Datenschutzerklärung:</strong> <a href="https://privacycenter.instagram.com/policy/" target="_blank" rel="noopener noreferrer" className={styles.link}>https://privacycenter.instagram.com/policy/</a>. <strong>Grundlage Drittlandtransfers:</strong> Data Privacy Framework (DPF).</li>
                    <li><strong>Facebook-Seiten: </strong>Profile innerhalb des sozialen Netzwerks Facebook - Der Verantwortliche ist gemeinsam mit Meta Platforms Ireland Limited für die Erhebung und Übermittlung von Daten der Besucher unserer Facebook-Seite („Fanpage") verantwortlich. Dazu gehören insbesondere Informationen über das Nutzerverhalten (z. B. angesehene oder interagierte Inhalte, durchgeführte Handlungen) sowie Geräteinformationen (z. B. IP-Adresse, Betriebssystem, Browsertyp, Spracheinstellungen, Cookie-Daten). Näheres hierzu findet sich in der Facebook-Datenrichtlinie: <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.facebook.com/privacy/policy/.</a> Facebook verwendet diese Daten auch, um uns über den Dienst „Seiten-Insights" statistische Auswertungen bereitzustellen, die Aufschluss darüber geben, wie Personen mit unserer Seite und deren Inhalten interagieren. Grundlage hierfür ist eine Vereinbarung mit Facebook („Informationen zu Seiten-Insights": <a href="https://www.facebook.com/legal/terms/page_controller_addendum" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.facebook.com/legal/terms/page_controller_addendum</a>), in der unter anderem Sicherheitsmaßnahmen sowie die Wahrnehmung der Betroffenenrechte geregelt sind. Weitere Hinweise finden sich hier: <a href="https://www.facebook.com/legal/terms/information_about_page_insights_data" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.facebook.com/legal/terms/information_about_page_insights_data.</a> Nutzer können Auskunfts- oder Löschungsanfragen daher direkt an Facebook richten. Die Rechte der Nutzer (insbesondere Auskunft, Löschung, Widerspruch, Beschwerde bei einer Aufsichtsbehörde) bleiben hiervon unberührt. Die gemeinsame Verantwortlichkeit beschränkt sich ausschließlich auf die Erhebung der Daten durch Meta Platforms Ireland Limited (EU). Für die weitere Verarbeitung, einschließlich einer möglichen Übermittlung an Meta Platforms Inc. in den USA, ist allein Meta Platforms Ireland Limited verantwortlich; <strong>Dienstanbieter:</strong> Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO); </span><strong>Website:</strong> <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.facebook.com</a>; <strong>Datenschutzerklärung:</strong> <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.facebook.com/privacy/policy/</a>. <strong>Grundlage Drittlandtransfers:</strong> Data Privacy Framework (DPF), Standardvertragsklauseln (<a href="https://www.facebook.com/legal/EU_data_transfer_addendum" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.facebook.com/legal/EU_data_transfer_addendum</a>).</li>
                </ul>
            </section>

            <section id="m328" className={styles.section}>
                <h2 className={styles.subheading}>Plug-ins und eingebettete Funktionen sowie Inhalte</h2>
                <p className={styles.text}>
                    Wir binden Funktions- und Inhaltselemente in unser Onlineangebot ein, die von den Servern ihrer jeweiligen Anbieter (nachfolgend als „Drittanbieter" bezeichnet) bezogen werden. Dabei kann es sich zum Beispiel um Grafiken, Videos oder Stadtpläne handeln (nachfolgend einheitlich als „Inhalte" bezeichnet).
                </p>
                <p className={styles.text}>
                    Die Einbindung setzt immer voraus, dass die Drittanbieter dieser Inhalte die IP-Adresse der Nutzer verarbeiten, da sie ohne IP-Adresse die Inhalte nicht an deren Browser senden könnten. Die IP-Adresse ist damit für die Darstellung dieser Inhalte oder Funktionen erforderlich. Wir bemühen uns, nur solche Inhalte zu verwenden, deren jeweilige Anbieter die IP-Adresse lediglich zur Auslieferung der Inhalte anzuwenden. Drittanbieter können ferner sogenannte Pixel-Tags (unsichtbare Grafiken, auch als „Web Beacons" bezeichnet) für statistische oder Marketingzwecke einsetzen. Durch die „Pixel-Tags" können Informationen, wie etwa der Besucherverkehr auf den Seiten dieser Website, ausgewertet werden. Die pseudonymen Informationen können darüber hinaus in Cookies auf dem Gerät der Nutzer gespeichert werden und unter anderem technische Auskünfte zum Browser und zum Betriebssystem, zu verweisenden Websites, zur Besuchszeit sowie weitere Angaben zur Nutzung unseres Onlineangebots enthalten, aber auch mit solchen Informationen aus anderen Quellen verbunden werden.
                </p>
                <p className={styles.text}>
                    <strong>Hinweise zu Rechtsgrundlagen:</strong> Sofern wir die Nutzer um ihre Einwilligung in den Einsatz der Drittanbieter bitten, stellt die Rechtsgrundlage der Datenverarbeitung die Erlaubnis dar. Ansonsten werden die Nutzerdaten auf Grundlage unserer berechtigten Interessen (d. h. Interesse an effizienten, wirtschaftlichen und empfängerfreundlichen Leistungen) verarbeitet. In diesem Zusammenhang möchten wir Sie auch auf die Informationen zur Verwendung von Cookies in dieser Datenschutzerklärung hinweisen.
                </p>
                <ul className={styles.list}>
                    <li><strong>Verarbeitete Datenarten:</strong> Nutzungsdaten (z. B. Seitenaufrufe und Verweildauer, Klickpfade, Nutzungsintensität und -frequenz, verwendete Gerätetypen und Betriebssysteme, Interaktionen mit Inhalten und Funktionen); Meta-, Kommunikations- und Verfahrensdaten (z. B. IP-Adressen, Zeitangaben, Identifikationsnummern, beteiligte Personen); Kontaktdaten (z. B. Post- und E-Mail-Adressen oder Telefonnummern). Inhaltsdaten (z. B. textliche oder bildliche Nachrichten und Beiträge sowie die sie betreffenden Informationen, wie z. B. Angaben zur Autorenschaft oder Zeitpunkt der Erstellung).</li>
                    <li><strong>Betroffene Personen:</strong> Nutzer (z. B. Webseitenbesucher, Nutzer von Onlinediensten).</li>
                    <li><strong>Zwecke der Verarbeitung:</strong> Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit; Reichweitenmessung (z. B. Zugriffsstatistiken, Erkennung wiederkehrender Besucher); Tracking (z. B. interessens-/verhaltensbezogenes Profiling, Nutzung von Cookies); Zielgruppenbildung; Marketing. Profile mit nutzerbezogenen Informationen (Erstellen von Nutzerprofilen).</li>
                    <li><strong>Aufbewahrung und Löschung:</strong> Löschung entsprechend Angaben im Abschnitt "Allgemeine Informationen zur Datenspeicherung und Löschung". Speicherung von Cookies von bis zu 2 Jahren (Sofern nicht anders angegeben, können Cookies und ähnliche Speichermethoden für einen Zeitraum von zwei Jahren auf den Geräten der Nutzer gespeichert werden.).</li>
                    <li><strong>Rechtsgrundlagen:</strong> Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO). Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).</li>
                </ul>
                <p className={styles.text}><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
                <ul className={styles.list}>
                    <li><strong>Einbindung von Drittsoftware, Skripten oder Frameworks (z. B. jQuery): </strong>Wir binden in unser Onlineangebot Software ein, die wir von Servern anderer Anbieter abrufen (z. B. Funktions-Bibliotheken, die wir zwecks Darstellung oder Nutzerfreundlichkeit unseres Onlineangebotes verwenden). Hierbei erheben die jeweiligen Anbieter die IP-Adresse der Nutzer und können diese zu Zwecken der Übermittlung der Software an den Browser der Nutzer sowie zu Zwecken der Sicherheit, als auch zur Auswertung und Optimierung ihres Angebotes verarbeiten. - Wir binden in unser Onlineangebot Software ein, die wir von Servern anderer Anbieter abrufen (z. B. Funktions-Bibliotheken, die wir zwecks Darstellung oder Nutzerfreundlichkeit unseres Onlineangebotes verwenden). Hierbei erheben die jeweiligen Anbieter die IP-Adresse der Nutzer und können diese zu Zwecken der Übermittlung der Software an den Browser der Nutzer sowie zu Zwecken der Sicherheit, als auch zur Auswertung und Optimierung ihres Angebotes verarbeiten; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).</span></li>
                    <li><strong>Google Fonts (Bereitstellung auf eigenem Server): </strong>Bereitstellung von Schriftarten-Dateien zwecks einer nutzerfreundlichen Darstellung unseres Onlineangebotes; <strong>Dienstanbieter:</strong> Die Google Fonts werden auf unserem Server gehostet, es werden keine Daten an Google übermittelt; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).</span></li>
                    <li><strong>Google Fonts (Bezug vom Google Server): </strong>Bezug von Schriften (und Symbolen) zum Zwecke einer technisch sicheren, wartungsfreien und effizienten Nutzung von Schriften und Symbolen im Hinblick auf Aktualität und Ladezeiten, deren einheitliche Darstellung und Berücksichtigung möglicher lizenzrechtlicher Beschränkungen. Dem Anbieter der Schriftarten wird die IP-Adresse des Nutzers mitgeteilt, damit die Schriftarten im Browser des Nutzers zur Verfügung gestellt werden können. Darüber hinaus werden technische Daten (Spracheinstellungen, Bildschirmauflösung, Betriebssystem, verwendete Hardware) übermittelt, die für die Bereitstellung der Schriften in Abhängigkeit von den verwendeten Geräten und der technischen Umgebung notwendig sind. Diese Daten können auf einem Server des Anbieters der Schriftarten in den USA verarbeitet werden - Beim Besuch unseres Onlineangebotes senden die Browser der Nutzer ihre Browser HTTP-Anfragen an die Google Fonts Web API (d. h. eine Softwareschnittstelle für den Abruf der Schriftarten). Die Google Fonts Web API stellt den Nutzern die Cascading Style Sheets (CSS) von Google Fonts und danach die in der CCS angegebenen Schriftarten zur Verfügung. Zu diesen HTTP-Anfragen gehören (1) die vom jeweiligen Nutzer für den Zugriff auf das Internet verwendete IP-Adresse, (2) die angeforderte URL auf dem Google-Server und (3) die HTTP-Header, einschließlich des User-Agents, der die Browser- und Betriebssystemversionen der Websitebesucher beschreibt, sowie die Verweis-URL (d. h. die Webseite, auf der die Google-Schriftart angezeigt werden soll). IP-Adressen werden weder auf Google-Servern protokolliert noch gespeichert und sie werden nicht analysiert. Die Google Fonts Web API protokolliert Details der HTTP-Anfragen (angeforderte URL, User-Agent und Verweis-URL). Der Zugriff auf diese Daten ist eingeschränkt und streng kontrolliert. Die angeforderte URL identifiziert die Schriftfamilien, für die der Nutzer Schriftarten laden möchte. Diese Daten werden protokolliert, damit Google bestimmen kann, wie oft eine bestimmte Schriftfamilie angefordert wird. Bei der Google Fonts Web API muss der User-Agent die Schriftart anpassen, die für den jeweiligen Browsertyp generiert wird. Der User-Agent wird in erster Linie zum Debugging protokolliert und verwendet, um aggregierte Nutzungsstatistiken zu generieren, mit denen die Beliebtheit von Schriftfamilien gemessen wird. Diese zusammengefassten Nutzungsstatistiken werden auf der Seite „Analysen" von Google Fonts veröffentlicht. Schließlich wird die Verweis-URL protokolliert, sodass die Daten für die Wartung der Produktion verwendet und ein aggregierter Bericht zu den Top-Integrationen basierend auf der Anzahl der Schriftartenanfragen generiert werden kann. Google verwendet laut eigener Auskunft keine der von Google Fonts erfassten Informationen, um Profile von Endnutzern zu erstellen oder zielgerichtete Anzeigen zu schalten; <strong>Dienstanbieter:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO); </span><strong>Website:</strong> <a href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer" className={styles.link}>https://fonts.google.com/</a>; <strong>Datenschutzerklärung:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.link}>https://policies.google.com/privacy</a>; <strong>Grundlage Drittlandtransfers:</strong> Data Privacy Framework (DPF). <strong>Weitere Informationen:</strong> <a href="https://developers.google.com/fonts/faq/privacy?hl=de" target="_blank" rel="noopener noreferrer" className={styles.link}>https://developers.google.com/fonts/faq/privacy?hl=de</a>.</li>
                    <li><strong>YouTube-Videos: </strong>Videoinhalte; <strong>Dienstanbieter:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO); </span><strong>Website:</strong> <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.youtube.com</a>; <strong>Datenschutzerklärung:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.link}>https://policies.google.com/privacy</a>; <strong>Grundlage Drittlandtransfers:</strong> Data Privacy Framework (DPF). <strong>Widerspruchsmöglichkeit (Opt-Out):</strong> Opt-Out-Plugin: <a href="https://tools.google.com/dlpage/gaoptout?hl=de" target="_blank" rel="noopener noreferrer" className={styles.link}>https://tools.google.com/dlpage/gaoptout?hl=de</a>,  Einstellungen für die Darstellung von Werbeeinblendungen: <a href="https://myadcenter.google.com/personalizationoff" target="_blank" rel="noopener noreferrer" className={styles.link}>https://myadcenter.google.com/personalizationoff</a>.</li>
                    <li><strong>YouTube-Videos: </strong>Innerhalb unseres Onlineangebotes sind Videos eingebettet, die bei YouTube gespeichert sind. Die Integration dieser YouTube-Videos erfolgt über eine spezielle Domain mithilfe der Komponente „youtube-nocookie" im sogenannten „erweiterten Datenschutzmodus". Im „erweiterten Datenschutzmodus" können bis zum Start des Videos lediglich Informationen, zu denen Ihre IP-Adresse sowie Angaben zum Browser und Ihrem Endgerät gehören, auf Ihrem Endgerät in Cookies oder mittels vergleichbarer Verfahren gespeichert werden, die YouTube für die Ausgabe, Steuerung und Optimierung der Videoanzeige benötigt. Sobald Sie die Videos abspielen, können zusätzlich Informationen zur Analyse des Nutzungsverhaltens sowie zur Speicherung im Nutzerprofil und zur Personalisierung von Inhalten und Anzeigen durch YouTube verarbeitet werden. Die Speicherdauer für die Cookies kann bis zu zwei Jahre betragen; <strong>Dienstanbieter:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO); </span><strong>Website:</strong> <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.youtube.com</a>; <strong>Datenschutzerklärung:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.link}>https://policies.google.com/privacy</a>; <strong>Grundlage Drittlandtransfers:</strong> Data Privacy Framework (DPF). <strong>Weitere Informationen:</strong> <a href="https://support.google.com/youtube/answer/171780?hl=de-DE#zippy=%2Cturn-on-privacy-enhanced-mode%2Cerweiterten-datenschutzmodus-aktivieren" target="_blank" rel="noopener noreferrer" className={styles.link}>https://support.google.com/youtube/answer/171780?hl=de-DE#zippy=%2Cturn-on-privacy-enhanced-mode%2Cerweiterten-datenschutzmodus-aktivieren</a>.</li>
                    <li><strong>Vimeo-Videoplayer: </strong>Integration eines Videoplayers; <strong>Dienstanbieter:</strong> Vimeo Inc., Attention: Legal Department, 555 West 18th Street New York, New York 10011, USA; <span className={styles.text}><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO); </span><strong>Website:</strong> <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer" className={styles.link}>https://vimeo.com</a>; <strong>Datenschutzerklärung:</strong> <a href="https://vimeo.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.link}>https://vimeo.com/privacy</a>; <strong>Auftragsverarbeitungsvertrag:</strong> <a href="https://vimeo.com/enterpriseterms/dpa" target="_blank" rel="noopener noreferrer" className={styles.link}>https://vimeo.com/enterpriseterms/dpa</a>. <strong>Grundlage Drittlandtransfers:</strong> Standardvertragsklauseln (<a href="https://vimeo.com/enterpriseterms/dpa" target="_blank" rel="noopener noreferrer" className={styles.link}>https://vimeo.com/enterpriseterms/dpa</a>).</li>
                    <li><strong>Google reCAPTCHA: </strong>Wir nutzen Google reCAPTCHA zur Abwehr von Spam und Missbrauch bei der Übermittlung von Formularen. Anbieter ist Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Durch den Einsatz von reCAPTCHA werden personenbezogene Daten (u.a. IP-Adresse, Angaben zu Ihrem Browser und Verhalten auf unserer Website) an Google übertragen. Die Nutzung erfolgt auf Grundlage unseres berechtigten Interesses an Sicherheit und Funktionsfähigkeit des Onlineangebots gemäß Art. 6 Abs. 1 lit. f DSGVO. Weitere Informationen finden sich in den Datenschutzhinweisen von Google: <a href="https://www.google.com/policies/privacy/" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.google.com/policies/privacy/</a> und den zusätzlichen Nutzungsbedingungen: <a href="https://www.google.com/recaptcha/intro/android.html" target="_blank" rel="noopener noreferrer" className={styles.link}>https://www.google.com/recaptcha/intro/android.html</a>.</li>
                </ul>
            </section>

            <section id="m42" className={styles.section}>
                <h2 className={styles.subheading}>Begriffsdefinitionen</h2>
                <p className={styles.text}>
                    In diesem Abschnitt erhalten Sie eine Übersicht über die in dieser Datenschutzerklärung verwendeten Begrifflichkeiten. Soweit die Begrifflichkeiten gesetzlich definiert sind, gelten deren gesetzliche Definitionen. Die nachfolgenden Erläuterungen sollen dagegen vor allem dem Verständnis dienen.
                </p>
                <ul className={styles.list}>
                    <li><strong>Bestandsdaten:</strong> Bestandsdaten umfassen wesentliche Informationen, die für die Identifikation und Verwaltung von Vertragspartnern, Benutzerkonten, Profilen und ähnlichen Zuordnungen notwendig sind. Diese Daten können u.a. persönliche und demografische Angaben wie Namen, Kontaktinformationen (Adressen, Telefonnummern, E-Mail-Adressen), Geburtsdaten und spezifische Identifikatoren (Benutzer-IDs) beinhalten. Bestandsdaten bilden die Grundlage für jegliche formelle Interaktion zwischen Personen und Diensten, Einrichtungen oder Systemen, indem sie eine eindeutige Zuordnung und Kommunikation ermöglichen. </li>
                    <li><strong>Inhaltsdaten:</strong> Inhaltsdaten umfassen Informationen, die im Zuge der Erstellung, Bearbeitung und Veröffentlichung von Inhalten aller Art generiert werden. Diese Kategorie von Daten kann Texte, Bilder, Videos, Audiodateien und andere multimediale Inhalte einschließen, die auf verschiedenen Plattformen und Medien veröffentlicht werden. Inhaltsdaten sind nicht nur auf den eigentlichen Inhalt beschränkt, sondern beinhalten auch Metadaten, die Informationen über den Inhalt selbst liefern, wie Tags, Beschreibungen, Autoreninformationen und Veröffentlichungsdaten </li>
                    <li><strong>Kontaktdaten:</strong> Kontaktdaten sind essentielle Informationen, die die Kommunikation mit Personen oder Organisationen ermöglichen. Sie umfassen u.a. Telefonnummern, postalische Adressen und E-Mail-Adressen, sowie Kommunikationsmittel wie soziale Medien-Handles und Instant-Messaging-Identifikatoren. </li>
                    <li><strong>Meta-, Kommunikations- und Verfahrensdaten:</strong> Meta-, Kommunikations- und Verfahrensdaten sind Kategorien, die Informationen über die Art und Weise enthalten, wie Daten verarbeitet, übermittelt und verwaltet werden. Meta-Daten, auch bekannt als Daten über Daten, umfassen Informationen, die den Kontext, die Herkunft und die Struktur anderer Daten beschreiben. Sie können Angaben zur Dateigröße, dem Erstellungsdatum, dem Autor eines Dokuments und den Änderungshistorien beinhalten. Kommunikationsdaten erfassen den Austausch von Informationen zwischen Nutzern über verschiedene Kanäle, wie E-Mail-Verkehr, Anrufprotokolle, Nachrichten in sozialen Netzwerken und Chat-Verläufe, inklusive der beteiligten Personen, Zeitstempel und Übertragungswege. Verfahrensdaten beschreiben die Prozesse und Abläufe innerhalb von Systemen oder Organisationen, einschließlich Workflow-Dokumentationen, Protokolle von Transaktionen und Aktivitäten, sowie Audit-Logs, die zur Nachverfolgung und Überprüfung von Vorgängen verwendet werden. </li>
                    <li><strong>Mitgliederdaten:</strong> Mitgliederdaten umfassen  Informationen, die sich auf die Individuen beziehen, die Teil einer Organisation, eines Vereins, eines Online-Dienstes oder einer sonstigen Gruppe sind. Diese Daten dienen dazu, Mitgliedschaften zu verwalten, Kommunikation zu ermöglichen und Dienstleistungen oder Vorteile zu erbringen, die mit der Mitgliedschaft verbunden sind. Mitgliederdaten können persönliche Identifikationsinformationen, Kontaktinformationen, Informationen zu Mitgliedschaftsstatus und -dauer, Beitragszahlungen, Teilnahme an Veranstaltungen und Aktivitäten sowie Präferenzen und Interessen umfassen. Sie können auch Daten über die Nutzung von Angeboten der Organisation einschließen. Die Erfassung und Verarbeitung dieser Daten erfolgt unter Einhaltung datenschutzrechtlicher Bestimmungen und dient sowohl der administrativen Abwicklung als auch der Förderung des Engagements und der Zufriedenheit der Mitglieder. </li>
                    <li><strong>Nutzungsdaten:</strong> Nutzungsdaten beziehen sich auf Informationen, die erfassen, wie Nutzer mit digitalen Produkten, Dienstleistungen oder Plattformen interagieren. Diese Daten umfassen eine breite Palette von Informationen, die aufzeigen, wie Nutzer Anwendungen nutzen, welche Funktionen sie bevorzugen, wie lange sie auf bestimmten Seiten verweilen und über welche Pfade sie durch eine Anwendung navigieren. Nutzungsdaten können auch die Häufigkeit der Nutzung, Zeitstempel von Aktivitäten, IP-Adressen, Geräteinformationen und Standortdaten einschließen. Sie sind besonders wertvoll für die Analyse des Nutzerverhaltens, die Optimierung von Benutzererfahrungen, das Personalisieren von Inhalten und das Verbessern von Produkten oder Dienstleistungen. Darüber hinaus spielen Nutzungsdaten eine entscheidende Rolle beim Erkennen von Trends, Vorlieben und möglichen Problembereichen innerhalb digitaler Angebote </li>
                    <li><strong>Personenbezogene Daten:</strong> "Personenbezogene Daten" sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person (im Folgenden "betroffene Person") beziehen; als identifizierbar wird eine natürliche Person angesehen, die direkt oder indirekt, insbesondere mittels Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten, zu einer Online-Kennung (z. B. Cookie) oder zu einem oder mehreren besonderen Merkmalen identifiziert werden kann, die Ausdruck der physischen, physiologischen, genetischen, psychischen, wirtschaftlichen, kulturellen oder sozialen Identität dieser natürlichen Person sind. </li>
                    <li><strong>Profile mit nutzerbezogenen Informationen:</strong> Die Verarbeitung von "Profilen mit nutzerbezogenen Informationen", bzw. kurz "Profilen" umfasst jede Art der automatisierten Verarbeitung personenbezogener Daten, die darin besteht, dass diese personenbezogenen Daten verwendet werden, um bestimmte persönliche Aspekte, die sich auf eine natürliche Person beziehen (je nach Art der Profilbildung können dazu unterschiedliche Informationen betreffend die Demographie, Verhalten und Interessen, wie z. B. die Interaktion mit Webseiten und deren Inhalten, etc.) zu analysieren, zu bewerten oder, um sie vorherzusagen (z. B. die Interessen an bestimmten Inhalten oder Produkten, das Klickverhalten auf einer Webseite oder den Aufenthaltsort). Zu Zwecken des Profilings werden häufig Cookies und Web-Beacons eingesetzt. </li>
                    <li><strong>Protokolldaten:</strong> Protokolldaten sind Informationen über Ereignisse oder Aktivitäten, die in einem System oder Netzwerk protokolliert wurden. Diese Daten enthalten typischerweise Informationen wie Zeitstempel, IP-Adressen, Benutzeraktionen, Fehlermeldungen und andere Details über die Nutzung oder den Betrieb eines Systems. Protokolldaten werden oft zur Analyse von Systemproblemen, zur Sicherheitsüberwachung oder zur Erstellung von Leistungsberichten verwendet. </li>
                    <li><strong>Reichweitenmessung:</strong> Die Reichweitenmessung (auch als Web Analytics bezeichnet) dient der Auswertung der Besucherströme eines Onlineangebotes und kann das Verhalten oder Interessen der Besucher an bestimmten Informationen, wie z. B. Inhalten von Webseiten, umfassen. Mit Hilfe der Reichweitenanalyse können Betreiber von Onlineangeboten z. B. erkennen, zu welcher Zeit Nutzer ihre Webseiten besuchen und für welche Inhalte sie sich interessieren. Dadurch können sie z. B. die Inhalte der Webseiten besser an die Bedürfnisse ihrer Besucher anpassen. Zu Zwecken der Reichweitenanalyse werden häufig pseudonyme Cookies und Web-Beacons eingesetzt, um wiederkehrende Besucher zu erkennen und so genauere Analysen zur Nutzung eines Onlineangebotes zu erhalten. </li>
                    <li><strong>Tracking:</strong> Vom "Tracking" spricht man, wenn das Verhalten von Nutzern über mehrere Onlineangebote hinweg nachvollzogen werden kann. Im Regelfall werden im Hinblick auf die genutzten Onlineangebote Verhaltens- und Interessensinformationen in Cookies oder auf Servern der Anbieter der Trackingtechnologien gespeichert (sogenanntes Profiling). Diese Informationen können anschließend z. B. eingesetzt werden, um den Nutzern Werbeanzeigen anzuzeigen, die voraussichtlich deren Interessen entsprechen. </li>
                    <li><strong>Verantwortlicher:</strong> Als "Verantwortlicher" wird die natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet, bezeichnet. </li>
                    <li><strong>Verarbeitung:</strong> "Verarbeitung" ist jeder mit oder ohne Hilfe automatisierter Verfahren ausgeführte Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten. Der Begriff reicht weit und umfasst praktisch jeden Umgang mit Daten, sei es das Erheben, das Auswerten, das Speichern, das Übermitteln oder das Löschen. </li>
                    <li><strong>Vertragsdaten:</strong> Vertragsdaten sind spezifische Informationen, die sich auf die Formalisierung einer Vereinbarung zwischen zwei oder mehr Parteien beziehen. Sie dokumentieren die Bedingungen, unter denen Dienstleistungen oder Produkte bereitgestellt, getauscht oder verkauft werden. Diese Datenkategorie ist wesentlich für die Verwaltung und Erfüllung vertraglicher Verpflichtungen und umfasst sowohl die Identifikation der Vertragsparteien als auch die spezifischen Bedingungen und Konditionen der Vereinbarung. Vertragsdaten können Start- und Enddaten des Vertrages, die Art der vereinbarten Leistungen oder Produkte, Preisvereinbarungen, Zahlungsbedingungen, Kündigungsrechte, Verlängerungsoptionen und spezielle Bedingungen oder Klauseln umfassen. Sie dienen als rechtliche Grundlage für die Beziehung zwischen den Parteien und sind entscheidend für die Klärung von Rechten und Pflichten, die Durchsetzung von Ansprüchen und die Lösung von Streitigkeiten. </li>
                    <li><strong>Zahlungsdaten:</strong> Zahlungsdaten umfassen sämtliche Informationen, die zur Abwicklung von Zahlungstransaktionen zwischen Käufern und Verkäufern benötigt werden. Diese Daten sind von entscheidender Bedeutung für den elektronischen Handel, das Online-Banking und jede andere Form der finanziellen Transaktion. Sie beinhalten Details wie Kreditkartennummern, Bankverbindungen, Zahlungsbeträge, Transaktionsdaten, Verifizierungsnummern und Rechnungsinformationen. Zahlungsdaten können auch Informationen über den Zahlungsstatus, Rückbuchungen, Autorisierungen und Gebühren enthalten. </li>
                    <li><strong>Zielgruppenbildung:</strong> Von Zielgruppenbildung (englisch "Custom Audiences") spricht man, wenn Zielgruppen für Werbezwecke, z. B. Einblendung von Werbeanzeigen bestimmt werden. So kann z. B. anhand des Interesses eines Nutzers an bestimmten Produkten oder Themen im Internet geschlussfolgert werden, dass dieser Nutzer sich für Werbeanzeigen für ähnliche Produkte oder den Onlineshop, in dem er die Produkte betrachtet hat, interessiert. Von "Lookalike Audiences" (bzw. ähnlichen Zielgruppen) spricht man wiederum, wenn die als geeignet eingeschätzten Inhalte Nutzern angezeigt werden, deren Profile, bzw. Interessen mutmaßlich den Nutzern zu denen die Profile gebildet wurden, entsprechen. Zur Zwecken der Bildung von Custom Audiences und Lookalike Audiences werden im Regelfall Cookies und Web-Beacons eingesetzt. </li>
                </ul>
            </section>

            <p className={styles.seal}>
                <a
                    href="https://datenschutz-generator.de/"
                    title="Rechtstext von Dr. Schwenke - für weitere Informationen bitte anklicken."
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className={styles.link}
                >
                    Erstellt mit kostenlosem Datenschutz-Generator.de von Dr. Thomas Schwenke
                </a>
            </p>
        </div>
    );
};

export default PrivacyPolicy;
