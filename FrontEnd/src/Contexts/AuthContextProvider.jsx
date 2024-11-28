import { createContext, useState } from "react";

// Create a context for authentication state
export const AuthContext = createContext();

// Provider component for AuthContext
export function AuthContextProvider({ children }) {
    // State to manage authentication status, default is false (not authenticated)
    const [auth, setAuth] = useState(false);
    
    // Function to toggle the authentication status
    function toggle() {
        setAuth(!auth);
    }

    return (
        <>
            {/* Provide the authentication state and toggle function to the component tree */}
            <AuthContext.Provider value={{ auth, toggle }}>
                {children}
            </AuthContext.Provider>
        </>
    );
}
