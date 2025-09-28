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