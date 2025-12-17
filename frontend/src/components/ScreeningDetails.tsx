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

        // There are actually two potential race conditions:
        // -- Race Condition 1: Between GET Requests (what isActive prevents) --
        //      When rapidly clicking between screenings:
        //          Click link to /details/899 → GET request for 900 starts
        //          Click link to /details/900 → GET request for 901 starts
        //          If request 899 finishes after request 900, it would overwrite the correct data
        //
        // → isActive prevents this by ensuring only the most recent request ("most recent" means the last request that was triggered/started, not the last one to finish!) updates state, see example below

        //  -- Race Condition 2: Between GET and Component Render (original problem, what validation check prevents) --
        //      This is the timing mismatch you experienced:
        //          Navigate to /details/900 → tnr param changes to 900
        //          Component renders immediately with tnr=900 but screeningDetails still has old data (tnr=899)
        //          TerminFilmDetailsCard renders with mismatched props: tnr=900 + titel="old title data"
        //          useTrackScreeningVisit fires the POST with this wrong combination
        //          Later, the GET request completes and updates screeningDetails (with data belonging to tnr=900)
        //
        // So the POST isn't racing with the GET — it's firing too early, before the GET completes.
        // → The validation check fixes this by preventing rendering until data matches.


        // Explanation on why Data Validation Check AND isActive Cleanup Function both are needed
        // **************************************************************************************
        // Data Validation Check:
        //     Prevents rendering stale data that's already in state (see Race Condition 2 above)
        //     Safety net when component renders before state updates
        //     Is a waiting mechanism that blocks rendering until the GET response arrives with matching data

        // isActive Cleanup Function:
        //     Prevents stale API responses from updating state in the first place (see Race Condition 1 above)
        //     Protects against race conditions where responses arrive out of order

        // Why Both Are Needed:
        // Without isActive, this scenario can happen:
        //      Navigate from /details/899 → /details/900 (request for 900 starts)
        //      Quickly navigate to /details/901 (request for 901 starts)
        //      Request for 901 arrives first → state updates correctly
        //      Request for 900 arrives second → overwrites state with wrong data
        //      The data validation check would catch this (by rendering loading text), BUT the wrong data would already be in state, wasting bandwidth and causing unnecessary re-renders.


        // ** isActive mechanism **
        let isActive = true;  // ✅ Flag to prevent race conditions

        setLoading(true);
        setError(null);

        const fetchScreeningDetails = axios.get(`/api/screenings/${tnr}`);
        const fetchReihenDetails = axios.get(`/api/reihe/getreihen-withallitstermineandfilms-fromtermin/${tnr}`);

        Promise.all([fetchScreeningDetails, fetchReihenDetails])
            .then(([screeningRes, reihenRes]) => {
                // this is the callback of the HTTP request - runs when request finishes
                // the .then() function receives the callback and executes it asynchronously when data arrives.

                if (isActive) {  // ✅ Only update if still relevant
                    setScreeningDetails(screeningRes.data);
                    setReihenDetails(reihenRes.data);
                }
            })
            .catch(err => {
                if (isActive) {  // ✅ Only update error if still relevant
                    setError(err.response?.data?.nachricht || "Keine Vorführung gefunden.");
                }
            })
            .finally(() => {
                if (isActive) {  // ✅ Only update loading if still relevant
                    setLoading(false);
                }
            });

        // return of the cleanup function
        return () => {
            isActive = false;  // ✅ Mark as stale on cleanup
        };
        // React automatically calls this returned function in two situations (important for understanding isActive):
        //     *When the component unmounts (removed from screen)
        //     *Before running the effect again when dependencies change

            // According to React's official documentation:
            // "After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup".
            // When tnr changes, React follows this sequence:
            //     1. Render the component with the new tnr value
            //     2. Call the cleanup function from the PREVIOUS effect (the one that ran with the old tnr)
            //     3. Run the effect function AGAIN with the new tnr value

        // So when tnr changes to 899 and afterward quickly navigate to 900 (user navigates: to /details/899 and then to /details/900):
        // Step 1: React renders with tnr=900
        // Step 2: React calls cleanup₈₉₉() (i.e. calls the cleanup from the (previous) tnr=899 effect) ← Sets isActive₈₉₉ = false
        // Step 3: React runs effect with tnr=900 (run the effect function again with the new tnr value) ← Creates isActive₉₀₀ = true
        // When old request for 899 arrives:
        //      if (isActive₈₉₉) { ... }  ← false, so skipped ✓
        // When new request for 900 arrives:
        //      if (isActive₉₀₀) { ... }  ← true, so runs ✓

    }, [tnr]);

    // Display loading message
    if (loading) return <div className="text-warning text-center">🎞️ Loading screening...</div>;

    // Display error message (when no data was fetched, e.h. non-existing termin id was provided as query param
    if (error) return <NotFound />;

    // ** Validation Check **
    // Validate that loaded data matches current route parameter
    //      prevents rendering with mismatched data
    //      ensures TerminFilmDetailsCard only renders when the loaded screeningDetails actually matches the current URL parameter, preventing useTrackScreeningVisit from firing with incorrect data
    if (screeningDetails && screeningDetails.termin.tnr !== Number(tnr)) {
        // data mismatch - show loading until correct data arrives
        // i.e.Validation Check is a waiting mechanism that blocks rendering until the GET response arrives with matching data
        return <div className="text-warning text-center">🎞️ Loading screening...</div>;
    }

    const screeningDateObj = screeningDetails?.termin.vorstellungsbeginn
        ? formatDateTime(screeningDetails.termin.vorstellungsbeginn)
        : undefined;

    // ######################################################
    // setup storage for non-tracking
    const queryParams = new URLSearchParams(location.search);
    const isTesting = queryParams.get('t');

    // when query parameter t is empty string (in case of /details/123?t=) or null (when /details/123) the condition evaluates to false
    if (isTesting) {
        sessionStorage.setItem(`screening-visited-${tnr}`, 'true');
        localStorage.setItem(`screening-visited-${tnr}`, 'true');

        sessionStorage.setItem(`calendar-clicked-${tnr}`, 'true');
        localStorage.setItem(`calendar-clicked-${tnr}`, 'true');
    }

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

                terminIsCanceled={screeningDetails.termin.isCanceled || undefined}
            />
        )
    )
}