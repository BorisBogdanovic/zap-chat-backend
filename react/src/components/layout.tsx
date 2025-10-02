import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

function Layout() {
    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;
