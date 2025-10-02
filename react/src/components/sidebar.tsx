/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { NavLink } from "react-router-dom";

function Sidebar() {
    // Logged user from Redux
    const loggedUser = useSelector(
        (state: RootState) => state.auth.loggedInUser
    );
    return (
        <div className="sidebar">
            <div className="logo-wrapper">
                <img src="/icons/zc-logo.png" alt="logo" />
            </div>
            <div className="nav">
                <NavLink to={"/"}>
                    {" "}
                    <div className="nav-item">
                        <img src="/icons/chat-icon.png" alt="logo" />
                        {/* <span>Chat</span> */}
                    </div>
                </NavLink>
                <NavLink to={"/settings"}>
                    {" "}
                    <div className="nav-item">
                        <img src="/icons/settings-icon.png" alt="logo" />
                        {/* <span>Settings</span> */}
                    </div>
                </NavLink>
            </div>
            <div className="profile">
                <img
                    src={`http://localhost:8000/${loggedUser?.image_path}`}
                    alt="Profilna slika"
                />
            </div>
        </div>
    );
}

export default Sidebar;
