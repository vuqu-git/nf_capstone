import { useCallback } from 'react';
import axios from "axios";

export const useTrackCalendarClick = () => {
    const handleTrackCalendarClick = useCallback(
        (
         tnr: number,
         vorstellungsbeginn: string | undefined,
         titel: string,
         withTerminbesonderheit: boolean,
         inNumberReihen: number,
         isCanceled: boolean
        ) => {
        const isFirstSessionClick = !sessionStorage.getItem(`calendar-clicked-${tnr}`);
        const isFirstLocalClick = !localStorage.getItem(`calendar-clicked-${tnr}`);

        if (isFirstSessionClick) {
            sessionStorage.setItem(`calendar-clicked-${tnr}`, 'true');
        }
        if (isFirstLocalClick) {
            localStorage.setItem(`calendar-clicked-${tnr}`, 'true');
        }
        if (isFirstSessionClick || isFirstLocalClick) {
            // console.log(`Calender-Tracking (sessionStorage: ${isFirstSessionClick}, localStorage: ${isFirstLocalClick}) für #${tnr}`);

            // fetch('/api/clicks', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         tnr,
            //         vorstellungsbeginn,
            //         titel,
            //         wasSessionCalendarClicked: isFirstSessionClick,
            //         wasUserCalendarClicked: isFirstLocalClick,
            //         isCanceled
            //     }),
            // });

            axios.post('/api/clicks', {
                tnr,
                vorstellungsbeginn,
                titel,
                withTerminbesonderheit,
                inNumberReihen,
                wasSessionCalendarClicked: isFirstSessionClick,
                wasUserCalendarClicked: isFirstLocalClick,
                isCanceled
            });
        }
    }, []);

    return handleTrackCalendarClick;
};