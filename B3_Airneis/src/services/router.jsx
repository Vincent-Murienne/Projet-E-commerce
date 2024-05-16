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
import SearchPage from "../pages/searchPage/SearchPage";
import ImageAdd from "../pages/admin/ImageManager/ImageAdd";
import ImageEdit from "../pages/admin/ImageManager/ImageEdit";
import CategoryList from "../pages/admin/CategoryManager/CategoryList";
import CategoryAdd from "../pages/admin/CategoryManager/CategoryAdd";
import CategoryEdit from "../pages/admin/CategoryManager/CategoryEdit";
import ProductSearchPage from "../pages/productSearchPage/ProductSearchPage";
import ProductPage from "../pages/productsPage/ProductPage";
import ProductEdit from "../pages/admin/ProductManager/ProductEdit";
import ProductAdd from "../pages/admin/ProductManager/ProductAdd";
import ProductList from "../pages/admin/ProductManager/ProductList";
import UserEdit from "../pages/admin/UserManager/UserEdit";
import UserAdd from "../pages/admin/UserManager/UserAdd";
import UserList from "../pages/admin/UserManager/UserList";
import TrackSales from "../pages/admin/trackSales/TrackSales";
import MonComptePage from "../pages/monComptePage/MonComptePage"
import MonCompteAdresse from "../pages/monComptePage/MonCompteAdresse";
import MonComptePayment from "../pages/monComptePage/MonComptePayment";
import MonCompteEdit from "../pages/monComptePage/MonCompteEdit"
import CheckoutAdresse from "../pages/checkoutPage/CheckoutAdresse"
import CheckoutPayment from "../pages/checkoutPage/CheckoutPayment"


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
                path: "search",
                element: <SearchPage/>
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
                path: "product", 
                element: <ProductSearchPage/>
            },
            {
                path: "product/:productId", 
                element: <ProductPage/>
            },
            {
                path: "monCompte", 
                element: <MonComptePage/>
            },
            {
                path: "monCompteAddresse", 
                element: <MonCompteAdresse/>
            },
            {
                path: "monComptepayment", 
                element: <MonComptePayment/>
            },
            {
                path: "monCompteEdit", 
                element: <MonCompteEdit/>
            },
            {
                path: "checkoutAdresse", 
                element: <CheckoutAdresse/>
            },
            {
                path: "checkoutPayment", 
                element: <CheckoutPayment/>
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
            },
            {
                path: "CategoryManager",
                element: <CategoryList/>
            },
            {
                path: "CategoryManager/Add",
                element: <CategoryAdd/>
            },
            {
                path: "CategoryManager/Edit/:categoryId",
                element: <CategoryEdit/>
            },
            {
                path: "ProductManager",
                element: <ProductList/>
            },
            {
                path: "ProductManager/Add",
                element: <ProductAdd/>
            },
            {
                path: "ProductManager/Edit/:productId",
                element: <ProductEdit/>
            },
            {
                path: "UserManager",
                element: <UserList/>
            },
            {
                path: "UserManager/Add",
                element: <UserAdd/>
            },
            {
                path: "UserManager/Edit/:userId",
                element: <UserEdit/>
            },
            {
                path: "TrackSales",
                element: <TrackSales/>
            }
        ]
    }
]);

export default router;