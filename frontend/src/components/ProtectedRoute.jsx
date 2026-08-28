import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export function ProtectedRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    // has three states

    if (loading) {
        return (
            <main>
                <div>
                    <p>Checking authentication....</p>
                </div>
            </main>
        )
    }

    if (!user) {
        return (
            <Navigate
                to='/login'
                replace
                state={
                    {
                        from: location
                    }
                }
            />
        )
    }
    // only if user exists take to application pages
    return (
        <Outlet /> // has all aplication routes eg Dashboard, Profile, Notes
    )
}
