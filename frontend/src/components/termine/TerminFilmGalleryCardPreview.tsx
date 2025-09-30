import TerminFilmGalleryCard from "./TerminFilmGalleryCard.tsx";
import {formatDateTime} from "../../utils/formatDateTime.ts";
import {useSearchParams} from "react-router-dom";


export default function TerminFilmGalleryCardPreview() {
    const [searchParams] = useSearchParams();
    const bild = searchParams.get("bild");
    const offsetImageInGallery = searchParams.get("offsetImageInGallery") ?? undefined;

    const regie = searchParams.get("regie") ?? "1234";
    const jahr = searchParams.get("jahr") ?? 567;
    const laufzeit = searchParams.get("laufzeit") ?? 89;

    const isProgramm = searchParams.get("isProgramm") ?? undefined;

    const screeningDateObj = formatDateTime(new Date().toISOString(), false, true);

    const valueGrid: string[] = [];
    for (let i = 0; i <= 10; i++) {
        valueGrid.push(`${i * 10}%`);
    }

    return (
        <section>

            <h3>Vorschau Bildausschnitt mit variierenden Werten bei "Offset für Bildanzeige in der Gallery"</h3>
            <article className="gallery-article-padding">
                <TerminFilmGalleryCard
                    screeningWeekday={screeningDateObj?.weekday ?? ""}
                    screeningDate={screeningDateObj?.date ?? ""}
                    screeningTime={screeningDateObj?.time ?? ""}
                    screeningSonderfarbe="pupille-glow"
                    bild={bild}
                    offsetImageInGallery={offsetImageInGallery}
                    titel={`<span class="text-success">${offsetImageInGallery === "" ? "center" : offsetImageInGallery} (aktueller Wert) = Offset für Bildanzeige</span>`}
                    kurztext={bild ? `${bild} = vollständiger Bilddateiname` : null}
                    hauptfilmFormat={undefined}
                    hauptfilmRegie={isProgramm ? undefined : regie}
                    hauptfilmJahr={isProgramm ? undefined : Number(jahr)}
                    hauptfilmLaufzeit={isProgramm ? undefined : Number(laufzeit)}
                    hauptfilmbesonderheit={undefined}
                    tnr={123}
                    terminBesonderheit={undefined}
                />
            </article>

            {/*<h3>Vorschau mit alternativen Werten für offsetImageInGallery</h3>*/}
            <hr
                style={{
                    border: "none",
                    height: "10px",
                    backgroundColor: "#FFD036",
                    opacity: 1,
                    borderRadius: "5px"
                    // margin: "20px 0"        // Optional: vertical spacing
                }}
            />

            {
                valueGrid.map( v => (
                    <article key={v} className="gallery-article-padding">
                        <TerminFilmGalleryCard
                            screeningWeekday={screeningDateObj?.weekday ?? ""}
                            screeningDate={screeningDateObj?.date ?? ""}
                            screeningTime={screeningDateObj?.time ?? ""}
                            screeningSonderfarbe="pupille-glow"
                            bild={bild}
                            offsetImageInGallery={v}
                            titel={`${v} = Offset für Bildanzeige</span>`}
                            kurztext={bild ? `${bild} = vollständiger Bilddateiname` : null}
                            hauptfilmFormat={undefined}
                            hauptfilmRegie={isProgramm ? undefined : regie}
                            hauptfilmJahr={isProgramm ? undefined : Number(jahr)}
                            hauptfilmLaufzeit={isProgramm ? undefined : Number(laufzeit)}
                            hauptfilmbesonderheit={undefined}
                            tnr={123}
                            terminBesonderheit={undefined}
                        />
                    </article>
                    )

                )
            }

        </section>
    );
}
