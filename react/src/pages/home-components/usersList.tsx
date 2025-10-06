import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../services/chatServices";
import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebaunce";
import { Helix } from "ldrs/react";
import { ChatMessage, User } from "../../types/type";
import { UsersListProps } from "../../types/interfaces";

function UsersList({
    loggedUser,
    setTargetUser,
    messages,
    setShowConversation,
}: UsersListProps) {
    const [users_search, setUsersSearch] = useState("");
    const debouncedSearch = useDebounce(users_search, 2000);
    const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);

    // Fetch users
    const {
        data: users,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["users", debouncedSearch],
        queryFn: () => fetchUsers(debouncedSearch),
        staleTime: 0,
    });

    // All messages on page load. ASK BE FOR ALL MESSAGES!!!
    // We use for now messages from fetch that require targetUser id
    useEffect(() => {
        if (messages && Array.isArray(messages.data.messages)) {
            // Dodajemo samo nove poruke koje još nisu u allMessages
            // console.log(messages);
            setAllMessages((prev) => {
                const newMsgs = messages.data.messages.filter(
                    (msg: ChatMessage) => !prev.some((m) => m.id === msg.id)
                );

                return [...prev, ...newMsgs];
            });
        }
    }, [messages]);

    // Loading / Error states
    if (isLoading)
        return (
            <div className="loading-wrapper">
                <Helix size="100" speed="2" color="#6941c6" />
            </div>
        );
    if (error) return <p>{(error as Error).message}</p>;
    if (!users) return <p>No users found.</p>;

    return (
        <div className="users">
            <div className="heading-wrapper">
                <h2>Chat</h2>
            </div>

            <div className="profile-wrapper">
                <div className="img-wrapper">
                    <img
                        src={
                            loggedUser?.image_path === "images/default.png"
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
                {users.data.map((user: User) => {
                    // Uzmi poslednju poruku za ovog user-a iz allMessages
                    const lastMessage = allMessages
                        .filter(
                            (msg) =>
                                (msg.from_id === loggedUser?.id &&
                                    msg.to_id === user.id) ||
                                (msg.from_id === user.id &&
                                    msg.to_id === loggedUser?.id)
                        )
                        .sort(
                            (a, b) =>
                                new Date(b.created_at).getTime() -
                                new Date(a.created_at).getTime()
                        )[0];

                    return (
                        <div
                            onClick={() => {
                                setTargetUser(user);
                                setShowConversation(true);
                            }}
                            key={user.id}
                            className="chat"
                        >
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
                                    {lastMessage?.message || "No messages yet"}
                                </div>
                            </div>
                            <div className="chat-time">
                                {lastMessage
                                    ? new Date(
                                          lastMessage.created_at
                                      ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })
                                    : ""}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default UsersList;
