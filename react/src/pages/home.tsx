/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/chatServices";
import { User } from "../types/type";
import { useState } from "react";
import { useDebounce } from "../hooks/useDebaunce";
import { Helix } from "ldrs/react";

function Home() {
    const loggedUser = useSelector(
        (state: RootState) => state.auth.loggedInUser
    );

    const [users_search, setUsersSearch] = useState("");
    const debouncedSearch = useDebounce(users_search, 2000);

    // Get users
    const {
        data: users,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["users", debouncedSearch],
        queryFn: () => fetchUsers(debouncedSearch),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });

    if (isLoading)
        return (
            <div className="loading-wrapper">
                <Helix size="100" speed="2" color="#6941c6" />
            </div>
        );
    if (error) return <p>{(error as Error).message}</p>;
    if (!users) return <p>No data found.</p>;

    console.log(users);

    return (
        <>
            <div className="chat-wrapper">
                <div className="users">
                    <div className="heading-wrapper">
                        <h2>
                            {/* <button onClick={() => navigate("/")}>
                                <span>Back</span>
                            </button> */}
                            Chat
                        </h2>
                    </div>
                    <div className="profile-wrapper">
                        <div className="img-wrapper">
                            <img
                                src={`http://localhost:8000/storage/${loggedUser?.image_path}`}
                                alt="Profilna slika"
                            />
                        </div>
                        <div className="name">{loggedUser?.name}</div>
                        <div className="status">Available</div>
                    </div>
                    <div className="search-wrapper">
                        <input
                            style={{ width: "100%" }}
                            onChange={(e) => setUsersSearch(e.target.value)}
                            value={users_search}
                            className="header-search"
                            placeholder="Search users..."
                            type="search"
                        />
                    </div>
                    <div className="chats">
                        {users.data.map((user: User) => (
                            <div key={user.id} className="chat">
                                <div className="user-img-wrapper">
                                    <img
                                        src={`http://localhost:8000/${user?.image_path}`}
                                        alt="Profilna slika"
                                    />
                                </div>
                                <div className="text-wrapper">
                                    <div className="chat-name">{user.name}</div>
                                    <div className="chat-text">
                                        Some text she sends to...
                                    </div>
                                </div>
                                <div className="chat-time">11:15</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="conversation">
                    {/* Poruke primljene od drugih korisnika */}
                    <div className="message received">
                        <div className="message-text">
                            Hey! How are you doing today?
                        </div>
                        <div className="message-time">11:05 AM</div>
                    </div>

                    <div className="message received">
                        <div className="message-text">
                            Are you free for a quick call?
                        </div>
                        <div className="message-time">11:06 AM</div>
                    </div>

                    {/* Poruke koje šalje korisnik */}
                    <div className="message sent">
                        <div className="message-text">
                            Hi! I’m good, thanks. Sure, I can talk now.
                        </div>
                        <div className="message-time">11:07 AM</div>
                    </div>

                    <div className="message sent">
                        <div className="message-text">
                            Where should we meet?
                        </div>
                        <div className="message-time">11:08 AM</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
