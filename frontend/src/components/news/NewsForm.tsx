import { FormEvent } from "react";
import {Form, Button} from "react-bootstrap";
import { News } from "../../types/News.ts";
import * as React from "react";
import axios from "axios";
import {copyToClipboard} from "../../utils/copyToClipboard.ts";
import styles from "../contact/Forms.module.css";
import {useDateStartBeforeEndValidation} from "../../hooks/useDateStartBeforeEndValidation.ts";
import {staticFilePathFrontend} from "../../utils/config.ts";
import AdminLeftBar from "../AdminLeftBar.tsx";

interface Props {
    newsItem: News; // this is need for prefilled form in case of edit
    handleSubmit: (event: FormEvent<HTMLFormElement>, newsInForm: News) => void;
    onChange: (newsItem: News) => void; // to have a News object with field values equaling the prevailing form inputs
    formType: "edit" | "add"; // determines whether the form is for editing or adding
}

// this component is called in AddNews.txs and EditNews.tsx

export default function NewsForm({ newsItem, handleSubmit, onChange, formType }: Props) {

    const dateOrderErrorMessage = useDateStartBeforeEndValidation(
        newsItem.startDate,
        newsItem.endDate
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onChange({ ...newsItem, [name]: value });
    };

    // ################################

    // this is an alternative code of that one below
    // const sendEmojifyRequest = async () => {
    //     try {
    //         const url = '/api/perplexityai';
    //         const inputText = newsItem.text;
    //
    //         // Sending the POST request
    //         const response = await axios.post(url, inputText, {
    //             headers: {
    //                 'Content-Type': 'application/json', // Ensure the backend expects JSON
    //             },
    //         });
    //
    //         copyToClipboard(newsItem.text);
    //         console.log('Response from backend:', response.data);
    //         onChange({ ...newsItem, text: response.data });
    //     } catch (error) {
    //         console.error('Error occurred while sending the request:', error.message);
    //     }
    // };

    // ################################

    const sendEmojifyRequestWithAI = () => {
        const url = '/api/perplexityai/emojify';
        const inputText = newsItem.text;

        // Sending the POST request
        axios.post(url, inputText, {
            headers: {
                'Content-Type': 'application/json', // Ensure the backend expects JSON
            },
        })
            .then((response) => {
                // Copy the original text to clipboard
                copyToClipboard(newsItem.text);

                // Update the news item with the response data
                onChange({ ...newsItem, text: response.data });
            })
            .catch((error) => {
                // Log any error that occurs during the request
                console.error('Error occurred while sending the request:', error.nachricht);
            })
            .finally(() => {
                // Optional: Perform any cleanup or final actions here
                console.log('Request completed.');
            });
    };

    return (
        <main data-bs-theme="dark" className="mt-4">

            <AdminLeftBar
                message={["<p>", "</p>", "\n", "<br>", "\n", "<em>", "</em>", "\n", "<strong>", "</strong>"]}
                threshold={150}
            />

            {/* heading based on formType */}
            <h4 className="mb-4">{formType === "edit" ? "Edit News Form" : "Add News Form"}</h4>

            <Form onSubmit={(e) => handleSubmit(e, newsItem)}>
                <Form.Group controlId="text">
                    <Form.Label>Text *</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={10} // Large textarea
                        name="text"
                        value={newsItem.text || ''}
                        onChange={handleChange}
                        required
                    />
                    <Form.Text className="text-muted">
                        <ul className="tight-list">
                            <li>a tag template → {`<a href="" class="custom-link" target="_blank" rel="noopener noreferrer">Linktext</a>`}</li>
                            <li>styled tag template → {'<span style="color: blue; font-weight: bold;">highlighted part</span>'}</li>
                            <li>img template for 'free' design → {'<img src="https://pupille.org/static-files/bilder/.../ABC.jpg" style="border-radius: 10px; width: 100%; height: auto; box-shadow: 0 0 10px rgba(255, 255, 255, 0.2); margin-bottom: 2rem;" />'}</li>
                        </ul>
                    </Form.Text>
                </Form.Group>

                <Button
                    variant="outline-info"
                    className="mt-4"
                    onClick={() => sendEmojifyRequestWithAI()}
                >
                    🤖🧠✨ Emojify the news text! 😆🎨🦄
                </Button>

                <Form.Group controlId="image" className="mt-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                        type="text"
                        name="image"
                        value={newsItem.image || ''}
                        onChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                        <ul className="tight-list">
                            <li>full url of the image file</li>
                        </ul>
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="startDate" className="mt-3">
                    <Form.Label>Start Date * (inclusive)</Form.Label>
                    <Form.Control
                        type="date"
                        name="startDate"
                        value={newsItem.startDate}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="endDate" className="mt-3">
                    <Form.Label>End Date * (inclusive)</Form.Label>
                    <Form.Control
                        type="date"
                        name="endDate"
                        value={newsItem.endDate}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <div>
                    {dateOrderErrorMessage && <p className={styles.statusError + " m-0"}>{dateOrderErrorMessage}</p>}
                </div>

                <Form.Group controlId="newsVariant" className="mt-3">
                    <Form.Label>Color Design *</Form.Label>
                    <Form.Select
                        name="newsVariant"
                        value={newsItem.newsVariant}
                        onChange={handleChange}
                    >
                        <option value="primary">blue | primary</option>
                        <option value="secondary">grey & grey text | secondary</option>
                        <option value="success">green | success</option>
                        <option value="danger">red | danger</option>
                        <option value="warning">yellow | warning</option>
                        <option value="info">cyan | info</option>
                        <option value="light">light gray & white text | light</option>
                        <option value="dark">dark grey & white text | dark</option>
                        <option value="free">free 💡🎨🖌️</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                        <ul className="tight-list">
                            <li>für alle Absätze p tag nutzen</li>
                            <li><span className="text-danger">Wichtig:</span> 'free' auswählen für eigenes Design, d.h. keine standardmäßig farbige Box</li>
                            <li>
                                <details className="summary-style general-info">
                                    <summary><span className="text-info">Legend color design</span></summary>
                                    {/*<img src="/assets/images/adminforms/newsDesigns.png" alt="News Color Design Legend" className="mt-3" />*/}
                                    <img src={staticFilePathFrontend + "bilder/adminforms/" + "newsDesigns.png"} alt="News Color Design Legend" className="mt-3" />
                                </details>
                            </li>
                        </ul>
                    </Form.Text>
                </Form.Group>

                {/*<Accordion style={{ maxWidth: '550px', }}>*/}
                {/*    <Accordion.Item eventKey="0">*/}
                {/*        <Accordion.Header>Legend color design</Accordion.Header>*/}
                {/*        <Accordion.Body>*/}
                {/*            <img src="/assets/images/adminforms/newsDesigns.png" alt="News Color Design Legend" className="mt-3" />*/}
                {/*            <img src={staticFilePathFrontend + "bilder/adminforms/" + "newsDesigns.png"} alt="News Color Design Legend" className="mt-3" />*/}
                {/*        </Accordion.Body>*/}
                {/*    </Accordion.Item>*/}
                {/*</Accordion>*/}

                <Button
                    variant={formType === "add" ? "primary" : "success"}
                    type="submit"
                    className="mt-4"
                    disabled={!!dateOrderErrorMessage}
                >
                    {formType === "add" ? "Add" : "Update"}
                </Button>
                <div><sub className={styles.formSubtext}>*Pflichtfelder</sub></div>
            </Form>
        </main>
    );
}
