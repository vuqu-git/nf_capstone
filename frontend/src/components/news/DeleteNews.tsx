import { useState } from "react";
import { Button } from "react-bootstrap";
import { NewsSelector } from "./NewsSelector.tsx";
import { useAllNews } from "../../hooks/useAllNews.ts";
import axios from "axios";

const baseURL = "/api/news";

export default function DeleteNews() {
    const [confirmOpen, setConfirmOpen] = useState(false);

    // destructuring the returned object from call useNewsHandling()
    const {
        allNews,
        selectedId: deletingId,
        error,
        successMessage,
        setSelectedId,
        setSuccessMessage,
        setError,
        getAllNews,
    } = useAllNews(false); // pass false to avoid fetching single news details

    const handleDelete = () => {
        setError("");
        setSuccessMessage("");

        axios.delete(`${baseURL}/${deletingId}`)
            .then(() => {
                setSuccessMessage("News deleted successfully!");
                setSelectedId("");
                getAllNews();
                setConfirmOpen(false);
            })
            .catch((error) => {
                const errorMessage =
                    error instanceof Error ? error.message : "Deletion failed";
                setError(errorMessage);
            });
    };

    return (
        <div>
            <NewsSelector
                allNews={allNews}
                selectedId={deletingId}
                onSelect={(id) => {
                    setSelectedId(id);
                    setSuccessMessage("");
                }}
            />

            {deletingId && !confirmOpen && (
                <Button
                    variant="danger"
                    onClick={() => setConfirmOpen(true)}
                    className="mt-4"
                >
                    Delete Selected News
                </Button>
            )}

            {confirmOpen && (
                <div className="mt-3">
                    <p>Are you sure you want to delete this news entry?</p>
                    <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete} className="ms-2">
                        Confirm Delete
                    </Button>
                </div>
            )}
            {error && <div className="text-danger mb-3" role="alert">{error}</div>}
            {successMessage && <div className="text-success mb-3" role="status">&#x2705; {successMessage}</div>}
        </div>
    );
}
