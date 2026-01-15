import '../styles/NomalContent.css';

export default function ContentNotes() {

    return (
        <article className="normal-content-container">
            <h2 className="h2NormalContainer">
                Content Notes
            </h2>
            <p>
                Wir verstehen uns als Kino mit einem vielfältigen und auch risikobereiten Programm &ndash; gleichzeitig möchten wir einen Ort herstellen, an dem ein kollektives Kinoerlebnis so inklusiv wie möglich stattfinden kann.
                Deshalb haben wir bei jeder Filmbeschreibung (falls zutreffend) ein Ausklappmenü "Hinweis auf sensible Inhalt" eingefügt, in dem ihr Triggerwarnungen und andere inhaltliche Hinweise sehen könnt.
            </p>
            <p>
                Wir haben uns bei den Triggerwarnungen zu sexueller Gewalt an der Seite <a className="custom-link" href="https://www.unconsentingmedia.org" target="_blank" rel="noopener noreferrer">www.unconsentingmedia.org</a> orientiert, die aber vor allem US-amerikanische Filme abdeckt.
                Die Einschätzung der Inhalte erfolgt daher nach bestem Wissen und Gewissen durch unser Team und/oder unsere Kooperationspartner*innen.
                Da dies aber immer auch ein subjektiver Prozess ist, können wir die Vollständigkeit dieser Angaben leider nicht garantieren.
            </p>
            <p>
                Wir bitten euch daher, achtsam zu sein und zu einzelnen Filmen gegebenenfalls zusätzliche Informationen einzuholen, wenn bestimmte Inhalte potentiell überfordernd sein können.
                Wir nehmen hierzu auch gerne Fragen, Hinweise und Anregungen von euch per Mail entgegen! Sprecht uns auch immer gerne an der Theke an.
            </p>
            <p className="text-end small text-muted">Stand: 16. April 2024</p>
        </article>
    );
}

