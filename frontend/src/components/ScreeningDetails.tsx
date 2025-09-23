import TerminDTOWithFilmsDTOFormPlus from "../types/TerminDTOWithFilmsDTOFormPlus.ts";
import ReiheDTOFormWithTermineAndFilme from "../types/ReiheDTOFormWithTermineAndFilme.ts";

import TerminFilmDetailsCard from "./termine/TerminFilmDetailsCard.tsx";
import {formatDateTime} from "../utils/formatDateTime.ts";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import NotFound from "./NotFound.tsx";
import {selectSonderfarbeFromReihen} from "../utils/selectSonderfarbeFromReihen.ts";

export default function ScreeningDetails() {

    const { tnr } = useParams();
    const [screeningDetails, setScreeningDetails] = useState<TerminDTOWithFilmsDTOFormPlus | null>(null);
    const [reihenDetails, setReihenDetails] = useState<ReiheDTOFormWithTermineAndFilme[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // GET only ScreeningDetails (old version)
    // ~~~~~~~~~~~~~~~~~~~~~~
    // useEffect(() => {
    //     axios.get(`/api/screenings/${tnr}`)
    //         .then(response => {
    //             setScreeningDetails(response.data);
    //         })
    //         .catch(err => {
    //             setError(err.response?.data?.nachricht || "Error loading screening details");
    //         })
    //         .finally(() => setLoading(false));
    // }, [tnr]);

    // GET both ScreeningDetails and ReihenDetails
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // If the requests are independent (i.e. one doesn't depend on the result of the other), you can use Promise.all to fetch them in parallel, which is both clean and efficient.
    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchScreeningDetails = axios.get(`/api/screenings/${tnr}`);
        const fetchReihenDetails = axios.get(`/api/reihe/getreihen-withallitstermineandfilms-fromtermin/${tnr}`);

        Promise.all([fetchScreeningDetails, fetchReihenDetails])
            .then(([screeningRes, reihenRes]) => {
                setScreeningDetails(screeningRes.data);
                setReihenDetails(reihenRes.data);
            })
            .catch(err => {
                setError(err.response?.data?.nachricht || "Keine Vorführung gefunden.");
            })
            .finally(() => setLoading(false));
    }, [tnr]);

    // Display loading message
    if (loading) return <div className="text-warning text-center">🎞️ Loading screening...</div>;
    // Display error message (when no data was fetched, e.h. non-existing termin id was provided as query param
    if (error) return <NotFound />;

    const screeningDateObj = screeningDetails && screeningDetails.termin.vorstellungsbeginn
        ? formatDateTime(screeningDetails.termin.vorstellungsbeginn)
        : undefined;

    return (
        screeningDetails && (
            <TerminFilmDetailsCard
                tnr={Number(tnr)} // casting of tnr into number type
                veroeffentlichen={screeningDetails.termin.veroeffentlichen}

                screeningWeekday={screeningDateObj?.weekday}
                screeningDate={screeningDateObj?.date}
                screeningTime={screeningDateObj?.time}

                vorstellungsbeginnIso8601={screeningDetails.termin.vorstellungsbeginn}

                screeningSonderfarbe={selectSonderfarbeFromReihen(reihenDetails) || screeningDetails.termin.sonderfarbe || "pupille-glow"}
                // screeningSonderfarbe={undefined} // undefined i.e. switch-off glow effect for TerminFilmDetailsCard

                programmtitel={screeningDetails.termin.titel} // d.h. der titel in der SQL-Tabelle Termin
                programmtext={screeningDetails.termin.text} // d.h. der text in der SQL-Tabelle Termin
                programmbesonderheit={screeningDetails.termin.besonderheit} // d.h. die besonderheit in der SQL-Tabelle Termin
                programmbild={screeningDetails.termin.bild} // d.h. das bild in der SQL-Tabelle Termin

                showProgrammbildInDetails={screeningDetails.termin.showImageInDetails}

                mainfilms={screeningDetails.mainfilms}
                vorfilms={screeningDetails.vorfilms}

                terminGesamtlaufzeit={screeningDetails.terminGesamtlaufzeit}

                reihen={reihenDetails}
            />
        )
    )
}