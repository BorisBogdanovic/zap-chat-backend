/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useQuery } from "@tanstack/react-query";
import {
    fetchUsers,
    fetchMessages,
    sendMessage,
} from "../services/chatServices";
import { User } from "../types/type";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebaunce";
import { Helix } from "ldrs/react";
import echo, { pusher } from "../pusherClient";
import { SendMessagePayload } from "../types/interfaces";
import { useMutation } from "@tanstack/react-query";

function Home() {
    const loggedUser = useSelector(
        (state: RootState) => state.auth.loggedInUser
    );
    const [targetUser, setTargetUser] = useState<User | null>(null);
    const [users_search, setUsersSearch] = useState("");
    const debouncedSearch = useDebounce(users_search, 2000);
    const [message, setMessage] = useState("");
    const [conversationMessages, setConversationMessages] = useState<any[]>([]);

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

    // Fetch messages only on targetUser change
    const {
        data: messages,
        isLoading: isLoadingMsg,
        error: isErrorMsg,
    } = useQuery({
        queryKey: ["messages", targetUser?.id],
        queryFn: () => fetchMessages(targetUser!.id),
        enabled: !!targetUser,
    });

    // Update conversationMessages when messages are fetched
    useEffect(() => {
        if (messages && Array.isArray(messages.messages)) {
            setConversationMessages(messages.messages);
        } else {
            setConversationMessages([]);
        }
    }, [messages]);

    // Pusher subscription for live messages
    useEffect(() => {
        console.log("Logged user", loggedUser);
        if (!loggedUser) return;

        const channel = pusher.subscribe(`private-chat.${loggedUser.id}`);

        channel.bind("MessageSentEvent", (data) => {
            console.log("Live message:", data);

            if (data.from_id === loggedUser.id) return;

            // Ignoriši ako poruka nije za trenutnog target user-a
            if (targetUser && data.from_id !== targetUser.id) return;

            setConversationMessages((prev) => [...prev, data]);
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`private-chat.${loggedUser.id}`);
        };
    }, [loggedUser, targetUser]);

    console.log("Conversation messages", conversationMessages);

    // Send message mutation
    const { mutate: sendMessageMutate, isLoading: sending } = useMutation({
        mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
        onSuccess: (data) => {
            console.log("Message data POST Req sent: ", data);

            if (!data || !data.data || !targetUser) return;
            const newMsg = data.data;
            setConversationMessages((prev) =>
                prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]
            );

            setMessage("");
        },
        onError: () => alert("Failed to send message"),
    });

    function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!targetUser || !message.trim()) return;

        sendMessageMutate({
            to_id: targetUser.id,
            message: message,
        });
    }

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
        <div className="chat-wrapper">
            {/* Users list */}
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
                    {users.data.map((user: User) => (
                        <div
                            onClick={() => setTargetUser(user)}
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
                                    Some text she sends to...
                                </div>
                            </div>
                            <div className="chat-time">11:15</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Conversation */}
            <div className="conversation-wrapper">
                {targetUser ? (
                    <section className="conversation">
                        <h3>Conversation with {targetUser.name}</h3>

                        {conversationMessages.map((msg) => (
                            <div
                                key={
                                    msg.id ??
                                    `${msg.from_id}-${msg.to_id}-${msg.message}`
                                }
                                className={`message ${
                                    msg.from_id === loggedUser?.id
                                        ? "from-me"
                                        : "from-them"
                                }`}
                            >
                                <div className="bubble">{msg.message}</div>
                                <span className="time">
                                    {new Date(
                                        msg.created_at ?? Date.now()
                                    ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        ))}
                    </section>
                ) : (
                    <h2>Select conversation</h2>
                )}

                {/* Input */}
                {targetUser && (
                    <div className="conversation-input">
                        <form
                            onSubmit={handleSendMessage}
                            className="message-input"
                        >
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={sending}
                            >
                                <span>{sending ? "Sending..." : "Send"}</span>
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
