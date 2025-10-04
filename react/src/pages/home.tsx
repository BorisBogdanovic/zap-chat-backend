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
        queryKey: ["users", debouncedSearch, loggedUser?.id],
        queryFn: () => fetchUsers(debouncedSearch),
        staleTime: 0,
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
                        <h2>Chat</h2>
                    </div>
                    <div className="profile-wrapper">
                        <div className="img-wrapper">
                            <img
                                src={
                                    loggedUser?.image_path ===
                                    "images/default.png"
                                        ? `http://localhost:8000/${loggedUser.image_path}`
                                        : `http://localhost:8000/storage/${loggedUser?.image_path}`
                                }
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
                                        src={
                                            user?.image_path ===
                                            "images/default.png"
                                                ? `http://localhost:8000/${user.image_path}`
                                                : `http://localhost:8000/storage/${user.image_path}`
                                        }
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
                <div className="conversation-wrapper">
                    <section className="conversation">
                        <h3>Conversation with username</h3>

                        <div className="message from-me">
                            <div className="bubble">Ćao! Kako si?</div>
                            <span className="time">04.10.2025. 12:30</span>
                        </div>

                        <div className="message from-them">
                            <div className="bubble">
                                Hej! Super sam, hvala. A ti?
                            </div>
                            <span className="time">04.10.2025. 12:31</span>
                        </div>

                        <div className="message from-me">
                            <div className="bubble">
                                I ja sam dobro. Kad se viđamo?
                            </div>
                            <span className="time">04.10.2025. 12:32</span>
                        </div>

                        <div className="message from-them">
                            <div className="bubble">Može sutra popodne 😊</div>
                            <span className="time">04.10.2025. 12:33</span>
                        </div>
                        <div className="message from-me">
                            <div className="bubble">Ćao! Kako si?</div>
                            <span className="time">04.10.2025. 12:30</span>
                        </div>

                        <div className="message from-them">
                            <div className="bubble">
                                Hej! Super sam, hvala. A ti?
                            </div>
                            <span className="time">04.10.2025. 12:31</span>
                        </div>

                        <div className="message from-me">
                            <div className="bubble">
                                I ja sam dobro. Kad se viđamo?
                            </div>
                            <span className="time">04.10.2025. 12:32</span>
                        </div>

                        <div className="message from-them">
                            <div className="bubble">Može sutra popodne 😊</div>
                            <span className="time">04.10.2025. 12:33</span>
                        </div>
                        <div className="message from-me">
                            <div className="bubble">Ćao! Kako si?</div>
                            <span className="time">04.10.2025. 12:30</span>
                        </div>

                        <div className="message from-them">
                            <div className="bubble">
                                Hej! Super sam, hvala. A ti?
                            </div>
                            <span className="time">04.10.2025. 12:31</span>
                        </div>

                        <div className="message from-me">
                            <div className="bubble">
                                I ja sam dobro. Kad se viđamo?
                            </div>
                            <span className="time">04.10.2025. 12:32</span>
                        </div>

                        <div className="message from-them">
                            <div className="bubble">Može sutra popodne 😊</div>
                            <span className="time">04.10.2025. 12:33</span>
                        </div>
                        <div className="message from-me">
                            <div className="bubble">Ćao! Kako si?</div>
                            <span className="time">04.10.2025. 12:30</span>
                        </div>

                        <div className="message from-them">
                            <div className="bubble">
                                Hej! Super sam, hvala. A ti?
                            </div>
                            <span className="time">04.10.2025. 12:31</span>
                        </div>
                    </section>
                    <div className="conversation-input">
                        <form className="message-input">
                            <input
                                type="text"
                                placeholder="Type your message..."
                            />
                            <button type="submit" className="btn-primary">
                                <span>Send</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
