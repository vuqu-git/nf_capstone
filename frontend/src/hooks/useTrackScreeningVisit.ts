import { useEffect } from 'react';

export const useTrackScreeningVisit = (tnr: number, vorstellungsbeginn: string, titel: string) => {
    useEffect(() => {
        const isFirstSessionVisit = !sessionStorage.getItem(`screening-visited-${tnr}`);
        const isFirstLocalVisit = !localStorage.getItem(`screening-visited-${tnr}`);
        const isFutureScreening = new Date(vorstellungsbeginn) > new Date();

        if (isFirstSessionVisit && isFutureScreening) {
            sessionStorage.setItem(`screening-visited-${tnr}`, 'true');
        }
        if (isFirstLocalVisit && isFutureScreening) {
            localStorage.setItem(`screening-visited-${tnr}`, 'true');
        }
        if ((isFirstSessionVisit || isFirstLocalVisit) && isFutureScreening) {
            // console.log(`Termin-Tracking (sessionStorage: ${isFirstSessionVisit}, localStorage: ${isFirstLocalVisit}) für #${tnr}`);

            fetch('/api/clicks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tnr,
                    vorstellungsbeginn,
                    titel,
                    wasSessionTerminClicked: isFirstSessionVisit,
                    wasUserTerminClicked: isFirstLocalVisit,
                }),
            });
        }
    }, [tnr, vorstellungsbeginn]);
};
