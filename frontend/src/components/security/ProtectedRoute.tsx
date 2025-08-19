// import {Navigate, Outlet} from "react-router-dom";
// import {useAuth} from "./AuthContext.tsx";
//
// // List of approved usernames
// const APPROVED_USERS = [
//     "example-git",
//     "",
//     // Add more usernames as needed
// ];
//
// export default function ProtectedRoute() {
//     // Access the authentication state from the custom useAuth hook.
//     const { fetchedUser, loading } = useAuth(); // Type inference from useAuth() is perfect here
//
//     if (loading) {
//         return (
//             <div className="text-center mt-4">
//                 <div>Loading authentication status...</div>
//             </div>
//         );
//     }
//
//     // immediate redirection
//     // if (!fetchedUser || fetchedUser === "anonymousUser" || !APPROVED_USERS.includes(fetchedUser)) {
//     //     return <Navigate to="/login" replace />;
//     // }
//
//     // If user is not fetched, is anonymous, or is not in the approved list
//     if (!fetchedUser || fetchedUser === "anonymousUser" || !APPROVED_USERS.includes(fetchedUser)) {
//         // Prepare the message to be passed to the /login route
//         let message = '';
//         if (fetchedUser && fetchedUser !== "anonymousUser") {
//             message = `User "${fetchedUser}" is not whitelisted for accessing the pupille.org admin section.`;
//         } else {
//             message = "To proceed, authenticate yourself with your credentials to enter the restricted area.";
//         }
//         // => added a message variable that is set based on whether fetchedUser exists and is not "anonymousUser".
//
//         // Navigate to /login and pass the message in the state
//         return <Navigate to="/login" replace state={{ message: message }} />;
//     }
//
//     // Render nested routes here
//     return <Outlet />;
// }

import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "./AuthContext.tsx";

export default function ProtectedRoute() {
    // Access the authentication state from the custom useAuth hook.
    const { fetchedUser, loading } = useAuth(); // Type inference from useAuth() is perfect here

    if (loading) {
        return (
            <div className="text-center mt-4">
                <div>Loading authentication status...</div>
            </div>
        );
    }

    // If user is not fetched or is anonymous
    if (!fetchedUser || fetchedUser === "anonymousUser") {
        const message = "To proceed, authenticate yourself with your credentials to enter the restricted area.";
        // Navigate to /login and pass the message in the state
        return <Navigate to="/lgn" replace state={{ message: message }} />;
    }

    // Render nested routes here
    return <Outlet />;
}