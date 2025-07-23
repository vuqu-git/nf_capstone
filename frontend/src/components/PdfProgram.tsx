import {Link, useLoaderData} from "react-router-dom";
import {Programmheft} from "../types/Programmheft.ts";

export default function PdfProgram() {
    const pdfs = useLoaderData<Programmheft[]>();

    return (
        <section className="normal-content-container">
            <h2>Programm als PDF</h2>
            {pdfs && pdfs.length > 0 && (
                pdfs.map(p => (
                    <article key={p.pnr} className="mb-4">
                        <div>
                        <Link
                            to={"https://pupille.org/programmheft/" + p.pdf}
                            className="custom-link mb-1"
                        >
                            Download PDF: {p.titel}
                        </Link>
                        </div>

                            {p.bild && (
                                <Link
                                    to={"https://pupille.org/programmheft/" + p.pdf}
                                >
                                <img
                                    src={"https://pupille.org/bilder/programmheftbilder/" + p.bild}
                                    alt={"Bild von " + p.titel}
                                    className="program-flyer-image"
                                />
                                </Link>
                            )}

                    </article>
                ))
            )}
        </section>
    );
}