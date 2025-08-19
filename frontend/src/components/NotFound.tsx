// components/NotFound.tsx
// import vincentGif from "../../public/assets/images/notfoundgifs/404-vincent.gif";
// import obiGif from "../../public/assets/images/notfoundgifs/404-obi.gif";
// import mibGif from "../../public/assets/images/notfoundgifs/404-mib.gif";
// import halGif from "../../public/assets/images/notfoundgifs/404-hal.gif";
import {useEffect, useState} from "react";

interface ImageOption {
    src: string;
    alt: string;
    text?: string;
    style?: React.CSSProperties;
}

interface NotFoundProps {
    images?: ImageOption[];
}

export default function NotFound({
                                     images = [
                                         {
                                             src: "/public/assets/images/notfoundgifs/404-vincent.gif",
                                             alt: "Confused Vincent Vega",
                                             text: "The requested resource is not here.",
                                             style: { maxWidth: "100%", height: "auto", borderRadius: '6px', marginBottom: "25px" }
                                         },
                                         {
                                             src: "/public/assets/images/notfoundgifs/404-obi.gif",
                                             alt: "Obi-Wan Kenobi uses a Jedi Mind Trick on Stormtroopers to convince them that R2-D2 and C-3PO are not the droids they are looking for.",
                                             text: "This isn't the resource you're looking for.",
                                             style: { maxWidth: "55%", height: "auto", borderRadius: '6px', marginBottom: "20px" }
                                         },
                                         {
                                             src: "/public/assets/images/notfoundgifs/404-mib.gif",
                                             alt: "Agent J uses a neuralyzer, a device that emits a bright flash.",
                                             text: "You will have no memory of this page.You will go about your browsing as if nothing happened.",
                                             style: { maxWidth: "100%", height: "auto", borderRadius: '6px', marginBottom: "20px" }
                                         },
                                         {
                                             src: "/public/assets/images/notfoundgifs/404-hal.gif",
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
    }, []); // empty dependency array for useEffect to pick a random image only once:

    if (!selectedImage) return null;

    return (
        <div className="container mt-5 text-center">
            <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                style={selectedImage.style}
            />
            <p>{selectedImage.text}</p>

            {/*<Button as={Link} to="/" variant="outline-success">*/}
            {/*    Zur Startseite*/}
            {/*</Button>*/}
        </div>
    );
}
