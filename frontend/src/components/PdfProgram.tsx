import {Link, useLoaderData} from "react-router-dom";
import {Programmheft} from "../types/Programmheft.ts";
import {staticFilePathFrontend} from "../utils/config.ts";

export default function PdfProgram() {
    const pdfs = useLoaderData<Programmheft[]>();

    return (
        <section className="normal-content-container">
            <h2 className="h2NormalContainer">Programm als PDF</h2>
            {pdfs && pdfs.length > 0 && (
                pdfs.map(p => (
                    <article key={p.pnr} className="mb-4">
                        <div>
                        <Link
                            to={staticFilePathFrontend + "programmheft/" + p.pdf}
                            className="custom-link mb-1"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {p.titel}
                        </Link>
                        </div>

                            {p.bild && (
                                <Link
                                    to={staticFilePathFrontend + "programmheft/" + p.pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                <img
                                    src={staticFilePathFrontend + "bilder/programmheftbilder/" + p.bild}
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