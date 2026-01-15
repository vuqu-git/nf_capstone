import {Link, useLoaderData} from "react-router-dom";
import {Programmheft} from "../../types/Programmheft.ts";
import {staticFilePathFrontend} from "../../utils/config.ts";

export default function PdfProgram() {
    const pdfs = useLoaderData<Programmheft[]>();

    return (
        <section className="normal-content-container">
            <h2 className="h2NormalContainer">Programm als PDF</h2>
            {pdfs && pdfs.length > 0 && (
                pdfs.map(ph => (
                    <article key={ph.pnr} className="mb-4">
                        <div>
                        <Link
                            to={staticFilePathFrontend + "programmhefte/" + ph.pdf}
                            className="custom-link mb-1"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {ph.titel}
                        </Link>
                        </div>

                            {ph.bild && (
                                <Link
                                    to={staticFilePathFrontend + "programmhefte/" + ph.pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                <img
                                    src={staticFilePathFrontend + "bilder/programmheftbilder/" + ph.bild}
                                    alt={"Bild von " + ph.titel}
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