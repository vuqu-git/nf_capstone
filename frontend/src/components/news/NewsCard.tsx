import {useState} from "react";
import Alert from 'react-bootstrap/Alert';
import styles from './News.module.css';
import {renderHtmlText} from "../../utils/renderHtmlText.tsx";

type props = {
    variant: string,
    text?: string,
    imageUrl?: string
}

export default function NewsCard({variant, text, imageUrl}: props) {
    const [show, setShow] = useState(true);

    if (show) {

        if (variant === "free" && text) {
            return <div>{renderHtmlText(text)}</div>
        } else {
            return (
                <Alert variant={variant} data-bs-theme="dark" onClose={() => setShow(false)} dismissible>
                    {/*<Alert.Heading>Heading</Alert.Heading>*/}

                    <div className={styles.newsContent}>
                        {/* Text */}
                        {/********/}
                        { text && (
                            <div>
                                {renderHtmlText(text)}
                            </div>
                        )}

                        {/* Image */}
                        {/*********/}
                        { imageUrl && (
                                <img
                                    className={styles.newsImage}
                                    src={imageUrl}
                                    alt="Image should be placed here. Please check image url!"
                                />
                            )
                        }
                    </div>
                </Alert>
            );
        }
    }
}