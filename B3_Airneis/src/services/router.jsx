import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../components/layouts/DefaultLayout";
import AdminLayout from "../components/layouts/AdminLayout";
import HomePage from "../pages/homePage/HomePage";
import LoginPage from "../pages/login-register/LoginPage";
import RegisterPage from "../pages/login-register/RegisterPage";
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
import ProductSearchPage from "../pages/searchPage/ProductSearchPage";
import ProductPage from "../pages/productsPage/ProductPage";
import ProductEdit from "../pages/admin/ProductManager/ProductEdit";
import ProductAdd from "../pages/admin/ProductManager/ProductAdd";
import ProductList from "../pages/admin/ProductManager/ProductList";
import UserEdit from "../pages/admin/UserManager/UserEdit";
import UserAdd from "../pages/admin/UserManager/UserAdd";
import UserList from "../pages/admin/UserManager/UserList";
import TrackSales from "../pages/admin/trackSales/TrackSales";
import MonCompteParametres from "../pages/monComptePage/MonCompteParametres";
import MonCompteAdresse from "../pages/monComptePage/MonCompteAdresse";
import MonComptePayment from "../pages/monComptePage/MonComptePayment";
import MonComptePage from "../pages/monComptePage/MonComptePage";
import OrderPage from "../pages/ordersPage/OrderPage";
import MyOrdersPage from "../pages/ordersPage/MyOrdersPage";

import BasketPage from  "../pages/basketPage/BasketPage";
import MonCompteEdit from "../pages/monComptePage/MonCompteEdit"
import CheckoutAdresse from "../pages/checkoutPage/CheckoutAdresse"
import CheckoutPayment from "../pages/checkoutPage/CheckoutPayment"
import CheckoutConfirmer from "../pages/checkoutPage/CheckoutConfirmer";
import CguPage from "../pages/reglementationPage/CguPage";
import MentionsLegales from "../pages/reglementationPage/MentionsLegales";
import ContactPage from "../pages/reglementationPage/ContactPage";
import AirneisDesc from "../pages/reglementationPage/AirneisDesc"

import ForgetPasswordPage from "../pages/login-register/ForgetPasswordPage";
import ResetPasswordPage from "../pages/login-register/ResetPasswordPage";

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
                path: "panier",
                element: <BasketPage/>
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
                path: "monComptePage",
                element: <MonComptePage/>
            },
            {
                path: "monCompteParametres", 
                element: <MonCompteParametres/>
            },
            {
                path: "monCompteAddresse", 
                element: <MonCompteAdresse/>
            },
            {
                path: "monComptePayment", 
                element: <MonComptePayment/>
            },
            {
                path: "monCompteEdit", 
                element: <MonCompteEdit/>
            },
            {
                path: "forgetPassword", 
                element: <ForgetPasswordPage/>
            },
            {
                path: "resetpassword/:token", 
                element: <ResetPasswordPage/>
            },
            {
                path: "checkoutAdresse", 
                element: <CheckoutAdresse/>
            },
            {
                path: "checkoutPayment", 
                element: <CheckoutPayment/>
            },
            {
                path: "checkoutConfirmer/:orderId", 
                element: <CheckoutConfirmer/>
            },
            {
                path: "cguPage", 
                element: <CguPage/>
            },
            {
                path: "mentionsLegales",
                element: <MentionsLegales/>
            },
            {
                path: "contactPage",
                element: <ContactPage/>
            },
            {
                path: "airneisDesc",
                element: <AirneisDesc/>
            },
            {
                path: "myOrdersPage",
                element: <MyOrdersPage/>
            },
            {
                path: "orderPage/:orderId",
                element: <OrderPage/>
            }
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