/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editUser } from "../services/settingsServices";
import { EditedUser, User } from "../types/type";
import { updateLoggedInUser } from "../redux/slice";

function Settings() {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const loggedUser = useSelector(
        (state: RootState) => state.auth.loggedInUser
    );

    // React Form Hook
    const {
        register,
        handleSubmit,
        watch,

        formState: { errors },
    } = useForm<EditedUser>();
    const password = watch("password");

    //// Patch HTTP method Edit user
    const { mutate: editUserFormFields } = useMutation({
        mutationFn: ({ editedObj }: { editedObj: EditedUser }) =>
            editUser(editedObj),
        onSuccess: (data) => {
            // Update Redux logged user
            dispatch(updateLoggedInUser(data.data));

            // Osveži localStorage
            const storedUser = JSON.parse(
                localStorage.getItem("loggedInUser") || "{}"
            );
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify({ ...storedUser, ...data.data })
            );

            queryClient.invalidateQueries({ queryKey: ["settings"] });
            alert("User is updated!");
        },
        onError: () => {
            alert("Failed to update user");
        },
    });

    function onSubmit(data: EditedUser) {
        console.log("Edited obj", data);

        editUserFormFields({
            editedObj: data,
        });
    }

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

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="profile-form"
                >
                    <div className="form-row">
                        <label>Name</label>
                        <input
                            type="text"
                            defaultValue={loggedUser?.name || ""}
                            {...register("name", {
                                required: "Name is required",
                            })}
                        />
                    </div>
                    <div className="form-row">
                        <label>Lastname</label>
                        <input
                            type="text"
                            defaultValue={loggedUser?.last_name || ""}
                            {...register("last_name", {
                                required: "Lastname is required",
                            })}
                        />
                    </div>
                    <div className="form-row">
                        <label>Username</label>
                        <input
                            type="text"
                            defaultValue={loggedUser?.username || ""}
                            {...register("username", {
                                required: "Username is required",
                            })}
                        />
                    </div>
                    <div className="form-row">
                        <label>Password</label>

                        <input
                            placeholder="Enter your password"
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />
                    </div>
                    <div className="form-row">
                        <label>Confirm Password</label>

                        <input
                            placeholder="Confirm your password"
                            type="password"
                            {...register("password_confirmation", {
                                required: "Please confirm password",
                                validate: (value) =>
                                    value === password ||
                                    "Passwords do not match",
                            })}
                        />
                    </div>

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
