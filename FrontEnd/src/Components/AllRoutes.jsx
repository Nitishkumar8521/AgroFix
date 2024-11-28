// Importing necessary components and pages
import { Routes, Route } from "react-router-dom"; 
import Login from "../Pages/Login"; 
import Sign_up from "../Pages/Sign_up"; 
import Cart from "./Cart";
import PrivateRoute from "./PrivateRoute"; 
import Edit_product from "../Admin/Edit_product";
import Add_Product from "../Admin/Add_product";
import Product from "../Pages/Product";
import Order from "../Pages/Order";
import Order_tracking from "../Pages/Order_tracking";
import Edit_profile from "../Pages/Edit_profile";
import Title from "./Title";

// AllRoutes component that defines the different routes of the application
function AllRoutes() {
    return (
        <Routes> 
            <Route path="/" element={<Title />} />
            <Route path="/product" element={<Product />} />
            <Route path="/order" element={<Order />} />
            <Route path="/track-order/:orderId" element={<Order_tracking />} />
            <Route path="/login" element={<Login />} /> 
            <Route path="/sign" element={<Sign_up />} /> 
            <Route path="/cart" element={
                <PrivateRoute> {/* Protected route for the carts page */}
                    <Cart />
                </PrivateRoute>} /> 
            <Route path='/add-product' element={<Add_Product />}></Route>
            <Route path='/edit-product/:productId' element={<Edit_product />}></Route>
            <Route path="/edit-profile/:userId" element = {<Edit_profile />}></Route>
        </Routes>
    );
}

export default AllRoutes; // Exporting the AllRoutes component for use in other parts of the app
