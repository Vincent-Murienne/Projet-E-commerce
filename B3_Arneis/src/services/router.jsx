import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../components/layouts/DefaultLayout";
import AdminLayout from "../components/layouts/AdminLayout";
import HomePage from "../pages/homePage/HomePage";
import LoginPage from "../pages/loginPage/LoginPage";
import RegisterPage from "../pages/registerPage/RegisterPage";
import HomePageManager from "../pages/admin/homePage/HomePageManager";
import CategorieDetails from "../pages/categoriePage/CategorieDetails";

import ImageList from "../pages/admin/ImageManager/ImageList";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout/>,
        children: [
            {
                path: "",
                element: <HomePage/>
            },
            {
                path: "login",
                element: <LoginPage/>
            },
            {
                path: "register",
                element: <RegisterPage/>
            },  
            {
                path: "categories/:categoryId", 
                element: <CategorieDetails/>
            },
        ]
    },
    {
        path: "/admin",
        element: <AdminLayout/>,
        children: [
            {
                path: "HomePageManager",
                element: <HomePageManager/>
            },
            {
                path: "ImageManager",
                element: <ImageList/>
            }
        ]
    }
]);

export default router;