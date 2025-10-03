import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

function Settings() {
    const loggedUser = useSelector(
        (state: RootState) => state.auth.loggedInUser
    );
    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="img-wrapper">
                        <img
                            src={`http://localhost:8000/${loggedUser?.image_path}`}
                            alt="Profilna slika"
                        />
                        <label className="edit-avatar">
                            <input type="file" accept="image/*" />
                            <span>Change Image</span>
                        </label>
                    </div>

                    <div className="profile-info">
                        <h2 className="name">
                            {loggedUser?.name || "Ime Prezime"}
                        </h2>
                        <div className="email">
                            {loggedUser?.email || "email@example.com"}
                        </div>
                        <div className="status">Available</div>
                    </div>
                </div>

                <form className="profile-form">
                    <div className="form-row">
                        <label>Name</label>
                        <input
                            type="text"
                            defaultValue={loggedUser?.name || ""}
                        />
                    </div>

                    <div className="form-row">
                        <label>Email</label>
                        <input
                            type="email"
                            defaultValue={loggedUser?.email || ""}
                        />
                    </div>
                    {/* 
                    <div className="form-row">
                        <label>Status</label>
                        <input
                            type="text"
                            defaultValue={loggedUser?.status || "Available"}
                        />
                    </div> */}

                    <div className="form-actions">
                        <button type="submit" className="save-btn">
                            Save
                        </button>
                        <button type="button" className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Settings;
