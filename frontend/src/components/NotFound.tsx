// components/NotFound.tsx
import vincentGif from "../assets/images/notfoundgifs/404-vincent.gif";
import obiGif from "../assets/images/notfoundgifs/404-obi.gif";
import mibGif from "../assets/images/notfoundgifs/404-mib.gif";
import halGif from "../assets/images/notfoundgifs/404-hal.gif";
import {useEffect, useState} from "react";

interface ImageOption {
    src: string;
    alt: string;
    text?: string;
    style?: React.CSSProperties;
}

interface NotFoundProps {
    // text?: string;
    images?: ImageOption[];
}

export default function NotFound({
                                     images = [
                                         {
                                             src: vincentGif,
                                             alt: "Confused Vincent Vega",
                                             text: "The requested resource is not here.",
                                             style: { maxWidth: "100%", height: "auto", borderRadius: '6px', marginBottom: "25px" }
                                         },
                                         {
                                             src: obiGif,
                                             alt: "Obi-Wan Kenobi uses a Jedi Mind Trick on Stormtroopers to convince them that R2-D2 and C-3PO are not the droids they are looking for.",
                                             text: "This isn't the resource you're looking for.",
                                             style: { maxWidth: "95%", height: "auto", borderRadius: '6px', marginBottom: "20px" }
                                         },
                                         {
                                             src: mibGif,
                                             alt: "Agent J uses a neuralyzer, a device that emits a bright flash.",
                                             text: "You will have no memory of this page. You will go about your browsing as if nothing happened.",
                                             style: { maxWidth: "100%", height: "auto", borderRadius: '6px', marginBottom: "20px" }
                                         },
                                         {
                                             src: halGif,
                                             alt: "HAL-900 is talking to you.",
                                             text: "I'm sorry, dude. I'm afraid this page doesn't exist.",
                                             style: { maxWidth: "85%", height: "auto", borderRadius: '6px', marginBottom: "20px" }
                                         }
                                     ]
                                 }: Readonly<NotFoundProps>) {

    const [selectedImage, setSelectedImage] = useState<ImageOption | null>(null);

    useEffect(() => {
        if (images.length > 0) {
            const randomIndex = Math.floor(Math.random() * images.length);
            setSelectedImage(images[randomIndex]);
        }
    }, []);
    // empty dependency array for useEffect to pick a random image only once:

    if (!selectedImage) return null;

    return (
        <div className="container mt-5 text-center">
            <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                style={selectedImage.style}
            />
            <h4>{selectedImage.text}</h4>

            {/*<Button as={Link} to="/" variant="outline-success">*/}
            {/*    Zur Startseite*/}
            {/*</Button>*/}
        </div>
    );
}

// interface NotFoundProps {
//     text?: string;
// }
//
// export default function NotFound({text = "Die angeforderte Seite existiert nicht."}: Readonly<NotFoundProps>) {
//     return (
//         <div className="container mt-5 text-center">
//             <img
//                 src={vincentGif}
//                 alt="Confused Vincent Vega"
//                 style={{ maxWidth: "100%", height: "auto", borderRadius: '6px', marginBottom: "25px" }}
//             />
//
//             <img
//                 src={obiGif}
//                 alt="Obi-Wan Kenobi uses a Jedi Mind Trick on Stormtroopers to convince them that R2-D2 and C-3PO are not the droids they are looking for."
//                 style={{ maxWidth: "95%", height: "auto", borderRadius: '6px',marginBottom: "20px" }}
//             />
//
//             <h4>{text}</h4>
//
//             {/*<Button as={Link} to="/" variant="outline-success">*/}
//             {/*    Zur Startseite*/}
//             {/*</Button>*/}
//         </div>
//     );
// }

