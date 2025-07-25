// Shared hook (useNewsHandling.ts)
import { useEffect, useState } from 'react';
import axios from 'axios';
import { News } from '../types/News.ts';

const baseURL = "/api/news";

export const useAllNews = (shouldFetchDetails: boolean = true) => {
    const [isLoading, setIsLoading] = useState(false);
    const [allNews, setAllNews] = useState<News[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [selectedNews, setSelectedNews] = useState<News | null>(null);
    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const getAllNews = () => {
        setIsLoading(true);
        setError("");

        axios.get(`${baseURL}`)
            .then((response) => setAllNews(response.data))
            .catch((error) => {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                setError(errorMessage);
            })
            .finally(() => setIsLoading(false));
    };

    const getSingleNews = (id: string) => {
        if (!id || !shouldFetchDetails) {
            const emptyNewsForForm = {
                id: "",
                text: "",
                image: "",
                startDate: "",
                endDate: "",
                newsVariant: "light"
            };
            setSelectedNews(emptyNewsForForm);
            return;
        } // Avoid fetching if not needed

        setIsLoading(true);
        setError("");

        axios.get(`${baseURL}/all/${id}`)
            .then((response) => setSelectedNews(response.data))
            .catch((error) => {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                setError(errorMessage);
            })
            .finally(() => setIsLoading(false));
    };

    // for editing and deleting you need all news to get fetched here!
    useEffect(() => {
        getAllNews();
    }, []);

    useEffect(() => {
        getSingleNews(selectedId);
    }, [selectedId]);

    // this returns an object, here shorthand notation
    return {
        isLoadingAllNews: isLoading,
        allNews,
        selectedId,
        selectedNews,
        error,
        successMessage,
        setSelectedId,
        setSelectedNews,
        setSuccessMessage,
        setError,
        getAllNews,
    };
};