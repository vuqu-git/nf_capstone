import {
    Outlet,
    ScrollRestoration,
    type GetScrollRestorationKeyFunction,
} from "react-router-dom";


type ScrollRouteHandle = {
    scrollMode?: "pathname";
};

function hasScrollRouteHandle(
    handle: unknown
): handle is ScrollRouteHandle {
    return (
        typeof handle === "object" &&
        handle !== null &&
        "scrollMode" in handle
    );
}

export default function NoHeaderLayout() {
    const getKey: GetScrollRestorationKeyFunction = (location, matches) => {
        const usesPathnameScrollMode = matches.some(
            (match) =>
                hasScrollRouteHandle(match.handle) &&
                match.handle.scrollMode === "pathname"
        );

        return usesPathnameScrollMode
            ? location.pathname
            : location.key;
    };

    return (
        <div className="app-container">
            {/* Intentionally no Header */}

            <main className="margin-for-cards">
                <Outlet />
                <ScrollRestoration getKey={getKey} />
            </main>

            {/* Intentionally no Footer */}
            {/*<Footer />*/}
        </div>
    );
}