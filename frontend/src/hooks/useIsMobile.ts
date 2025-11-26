// hooks/useIsMobile.ts
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 767; // boundary between mobile/small and non-mobile/small screens

export function useIsMobile(): boolean {
    // Check initial state on the client side
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT : false // this is the initial state check
    );
        // isMobile: This state variable holds the current value of whether the device is mobile.
        // initial state checks if the code is running in a browser (by checking typeof window !== 'undefined'):
        //      If true, it compares the window.innerWidth to the MOBILE_BREAKPOINT.
        //      If the width is less than or equal to 767, it sets isMobile to true; otherwise, it’s set to false.
        //      This ensures it doesn’t throw an error during SSR (Server-Side Rendering) when there’s no window object

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        };

        // Set up event listener
        window.addEventListener('resize', handleResize);

        // Call once to ensure initial state is correct after component mounts
        handleResize();

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);
        // Effect Hook: useEffect runs the code inside it after the component mounts (and whenever dependencies change, but since the dependency array is empty, it only runs once).
        // handleResize Function: This function checks the current window width and updates the isMobile state by comparing window.innerWidth to MOBILE_BREAKPOINT.
        // Event Listener: The handleResize function is added as an event listener for the resize event on the window object. This means that whenever the browser window is resized, handleResize will be called, updating the isMobile state.
        // Initial State Update: The line handleResize(); ensures that the state is set correctly immediately after the component mounts, taking into account the current window size.
        // Cleanup: The return statement inside useEffect removes the event listener when the component unmounts or when the effect is re-run. This prevents memory leaks by ensuring that outdated event listeners do not remain in the background.

        return isMobile;
}

// Why the window object exists, when the code in the useEffect body is executed
// *****************************************************************************
// clarify the relationship between server-side rendering (SSR) and client-side rendering phases more explicitly:
// -- React Rendering Process Overview --
// Server-Side Rendering (SSR) Phase:
//     When using SSR, React renders the component on the server to generate HTML. This means the useState initialization runs in a server environment where window object is not defined.
//     For example, during this phase, the component will check typeof window !== 'undefined', and if it's false, it will safely initialize the state to whatever default is set (in this case, false).
//
// Client-Side Hydration Phase:
//     Once the HTML from the server is sent to the browser, React "hydrates" the component. This is where the JavaScript runs on the client side, attaching event listeners, initializing state, and running effects.
//     At this point, window object is defined because the code runs in a browser environment.
//
// -- Key Points --
// Initial Render vs. Client-side Hydration:
//     The initial render can occur on the server (in SSR) or the client, depending on whether it's the first load of the page.
//     After the initial server render, React moves into the client-side hydration phase.
//
//     Use of useEffect:
//     The useEffect hook runs only after the component is mounted on the client. It will not execute during the SSR phase. Consequently, by the time your code hits useEffect, the environment is browser-based, making the use of window object safe.
//
// -- Example Clarification --
// On the Server: The code runs:
//     The component renders without window being defined, initializing state correctly.
//     On the Client After Hydration: The code runs:
//     The component mounts, useEffect executes, and at this point, window is safely accessible.
//
// -- Summary --
// So, to clarify, when discussing the execution context:
//     The initial state check with useState protects against undefined window during SSR.
//     Once the component mounts post-SSR, or when rendered purely on the client, useEffect runs, ensuring all subsequent logic involving window is safe and valid.
// in other words:
// The check for typeof window !== 'undefined' is only necessary during the initial state setup to safely handle the case where the code may be running on the server.
// Once in the browser context, the useEffect runs without needing another check for window, making the subsequent code safe for execution.
