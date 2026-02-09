import '../styles/NomalContent.css';
import {useEffect} from "react";

export default function FirstSteps() {

    useEffect(() => {
        // create meta tag
        const meta = document.createElement('meta');
        meta.name = "robots";
        meta.content = "noindex, nofollow";
        document.head.appendChild(meta);

        // Clean up when the component is unmounted (leaving the page)
        return () => {
            document.head.removeChild(meta);
        };
    }, []);

    return (
        <section className="normal-content-container">
            <h2 className="h2NormalContainer">Grundlegendes für den Anfang</h2>
            <p>Hallo und willkommen in der Pupille!</p>

            <p>Wenn du dies liest, hast du Interesse an einer Mitarbeit im Kino :)</p>

            <p>
                Zum Reinschnuppern ist es für den Anfang am besten, wenn du an unseren Spieltagen im Dienst mithilfst.
                Dazu gehören vor allem der Aufbau, der Thekenverkauf und der Abbau.
                Der Dienst beginnt in der Regel etwa 50 Minuten vor Veranstaltungsbeginn.
                Treffpunkt ist der Saal oder das Büro direkt gegenüber.
            </p>

            <p>
                Wenn es dir gefällt und du dich entscheidest, dauerhaft bei uns einzusteigen, schreibe bitte eine
                Nachricht
                an den internen Mailverteiler* mit einer kurzen Vorstellung von dir.<br/>
                Wir sind (Stand 02/2026) ein relativ großes Team, und einige Mitglieder sind nur unregelmäßig oder
                selten anwesend.
                Deine Mail erleichtert uns das Onboarding. Bitte frage in deiner Nachricht außerdem nach folgenden
                Punkten:
            </p>

            <ul className="mb-3">
                <li>
                    Aufnahme deiner Mailadresse in den <strong>internen Mailverteiler</strong> (Kommunikationskanal des Teams)
                </li>
                <li>
                    Bereitstellung des <strong>Dienstplans</strong> zur Organisation unserer Screenings
                </li>
                <li>
                    Zugang zum <strong>Pupille-Wiki</strong> mit Informationen und Wissen rund um den Kinobetrieb
                </li>
            </ul>

            <p>Offene Fragen lassen sich am besten während des Dienstes oder bei unseren regelmäßigen Treffen
                klären.</p>

            <p>Viel Spaß beim Kennenlernen der Pupille!</p>

            <p>
                <sup>* Die genaue Adresse des Mailverteilers erfragst du am besten vor Ort.</sup>
            </p>
        </section>
    );
}