import { Outlet } from "react-router-dom";
import AdminHeader from "../headers/AdminHeader";
import "../../assets/css/style.css"

const AdminLayout = () => {
    return (
        <>
            <AdminHeader/>
            <main className="main-container">
                <Outlet/>
            </main>
        </>
    );
};

export default AdminLayout;