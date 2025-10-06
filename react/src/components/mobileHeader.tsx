import { useState } from "react";
import MobileModal from "./mobileModal";
import { NavLink } from "react-router-dom";

function MobileHeader() {
    const [mobModal, setMobModal] = useState(false);
    return (
        <>
            <div className="mobille-header-wrapper">
                <div className="menu-icon-wrapper">
                    <img
                        onClick={() => setMobModal((prev) => !prev)}
                        src="icons/hamburger-menu-icon.png"
                        alt="mobile-menu-icon"
                    />
                </div>
            </div>
            {mobModal ? (
                <MobileModal>
                    <div>
                        <div className="close-icon-wrapper">
                            <img
                                onClick={() => setMobModal(false)}
                                src="icons/close-icon.png"
                                alt="close-icon"
                            />
                        </div>
                        <div className="navigation">
                            {" "}
                            <NavLink
                                to={"/"}
                                onClick={() => setMobModal(false)}
                            >
                                {" "}
                                <div className="nav-item">
                                    <span>Chat</span>
                                </div>
                            </NavLink>
                            <NavLink
                                to={"/settings"}
                                onClick={() => setMobModal(false)}
                            >
                                {" "}
                                <div className="nav-item">
                                    <span>Settings</span>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                </MobileModal>
            ) : (
                ""
            )}
        </>
    );
}

export default MobileHeader;
