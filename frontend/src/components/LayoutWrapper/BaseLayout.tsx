import '../../App.css'
import {
    type Location,
    Outlet,
    ScrollRestoration,
    type useMatches,
} from "react-router-dom";

import Header2 from "../Header2.tsx";
import {useCallback} from "react";
import Footer from "../Footer.tsx";

export default function BaseLayout() {

    // You can provide a custom implementation of what "key" should be used to
    // cache scroll positions for a given location.  Using the location.key will
    // provide standard browser behavior and only restore on back/forward
    // navigations.  Using location.pathname will provide more aggressive
    // restoration and will also restore on normal link navigations to a
    // previously-accessed path.  Or - go nuts and lump many pages into a
    // single key (i.e., anything /wizard/* uses the same key)!
    const getKey = useCallback(
        (location: Location, matches: ReturnType<typeof useMatches>) => {
            const match = matches.find((m) => (m.handle as any)?.scrollMode);
            if ((match?.handle as any)?.scrollMode === "pathname") {
                return location.pathname;
            }

            return location.key;
        },
        []
    );

    return (
        <div className="app-container">

            {/*outside Routes and hence Header is always displayed*/}
            <Header2 />

            <main>
                <Outlet />

                {/* Single ScrollRestoration at root level */}
                <ScrollRestoration getKey={getKey} />
            </main>

            <Footer />
        </div>
    );
}