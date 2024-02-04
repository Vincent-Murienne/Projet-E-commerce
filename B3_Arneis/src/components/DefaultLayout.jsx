import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../assets/css/style.css"

const DefaultLayout = () => {
    return (
        <>
            <Header/>
            <main className="main-container">
                <Outlet/>
            </main>
            <Footer/>
        </>
    );
};

export default DefaultLayout;