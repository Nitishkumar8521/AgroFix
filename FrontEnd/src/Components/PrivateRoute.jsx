import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContextProvider";


function PrivateRoute({ children }) {
    
    const { auth } = useContext(AuthContext);
    
    const navigate = useNavigate();

    useEffect(() => {
        // If the user is not authenticated, redirect to the login page
        if (!auth) {
            navigate('/login');
        }
    }, [auth, navigate]); // Dependencies for the useEffect hook

    // Render the children components if authenticated, otherwise render nothing
    return auth ? children : null;
}

export default PrivateRoute;
