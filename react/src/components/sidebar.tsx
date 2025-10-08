/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../services/authServices";
import { logoutUserFromReduxAndLS } from "../redux/slice";
import { pusher } from "../pusherClient";

function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Logged user from Redux
    const loggedUser = useSelector(
        (state: RootState) => state.auth.loggedInUser
    );

    // HTTP POST
    const logoutUserMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: (data) => {
            console.log("Temporary use because of build", data);

            // Pusher live channels stoping
            pusher.unsubscribe(`private-chat.${loggedUser?.id}`);
            pusher.unsubscribe("presence-online");
            pusher.disconnect();

            // Clear localStorage
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("auth_token");

            // Redux
            dispatch(logoutUserFromReduxAndLS());

            // Navigation
            navigate("/login");
        },
        onError: (err) => {
            console.log("Temporary use because of build", err);

            alert("Logout failed!");
        },
    });

    function handleLogout() {
        logoutUserMutation.mutate();
        queryClient.clear();
    }
    return (
        <div className="sidebar">
            <div className="logo-wrapper">
                <img src="/icons/zc-logo.png" alt="logo" />
            </div>
            <div className="nav">
                <NavLink to={"/"}>
                    {" "}
                    <div className="nav-item">
                        <img src="/icons/chat-icon.png" alt="chat icon" />
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
                {/* <img
                    src={`http://localhost:8000/${loggedUser?.image_path}`}
                    alt="Profile img"
                /> */}
                <div>
                    <img
                        onClick={handleLogout}
                        src="/icons/logout-icon.png"
                        alt="logout icon"
                    />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
