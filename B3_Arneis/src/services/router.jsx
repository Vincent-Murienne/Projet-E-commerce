import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../components/layouts/DefaultLayout";
import AdminLayout from "../components/layouts/AdminLayout";
import HomePage from "../pages/homePage/HomePage";
import LoginPage from "../pages/loginPage/LoginPage";
import RegisterPage from "../pages/registerPage/RegisterPage";
import HomePageManager from "../pages/admin/homePage/HomePageManager";
import CategorieDetails from "../pages/categoriePage/CategorieDetails";
import CategorieList from "../pages/categoriePage/CategorieList";
import ImageList from "../pages/admin/ImageManager/ImageList";
import ImageAdd from "../pages/admin/ImageManager/ImageAdd";
import ImageEdit from "../pages/admin/ImageManager/ImageEdit";
import ProductPage from "../pages/productsPage/ProductPage";

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
            {
                path: "categories", 
                element: <CategorieList/>
            },
            {
                path: "product/:productId", 
                element: <ProductPage/>
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
            },
            {
                path: "ImageManager/Add",
                element: <ImageAdd/>
            },
            {
                path: "ImageManager/Edit/:imageId",
                element: <ImageEdit/>
            }
        ]
    }
]);

export default router;