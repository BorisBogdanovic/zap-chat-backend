/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchMessages,
    fetchUsers,
    sendMessage,
} from "../services/chatServices";
import { User } from "../types/type";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebaunce";
import { Helix } from "ldrs/react";
import { pusher } from "../pusherClient";
import { SendMessagePayload } from "../types/interfaces";

function Home() {
    const loggedUser = useSelector(
        (state: RootState) => state.auth.loggedInUser
    );
    const [targetUser, setTargetUser] = useState<User | null>(null);
    const [users_search, setUsersSearch] = useState("");
    const debouncedSearch = useDebounce(users_search, 2000);
    const [message, setMessage] = useState("");
    const [conversationMessages, setConversationMessages] = useState<any[]>([]);
    const queryClient = useQueryClient();

    // 1️⃣ Fetch users
    const {
        data: users,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["users", debouncedSearch, loggedUser?.id],
        queryFn: () => fetchUsers(debouncedSearch),
        staleTime: 0,
    });

    // 2️⃣ Fetch messages for selected target user
    const {
        data: messages,
        isLoading: isLoadingMsg,
        error: isErrorMsg,
    } = useQuery({
        queryKey: ["messages", targetUser?.id],
        queryFn: () => fetchMessages(targetUser!.id),
        enabled: !!targetUser,
    });

    // 3️⃣ Update conversationMessages when messages are fetched
    useEffect(() => {
        if (messages && Array.isArray(messages.messages)) {
            setConversationMessages(messages.messages);
        } else {
            setConversationMessages([]);
        }
    }, [messages]);

    // 4️⃣ Pusher subscription for live messages (primaoci vide instant)
    useEffect(() => {
        if (!loggedUser) return;

        const channel = pusher.subscribe(`chat.${loggedUser.id}`);

        const handleNewMessages = (data: any) => {
            const incoming = data
                ? Array.isArray(data.messages)
                    ? data.messages
                    : data.messages
                    ? [data.messages]
                    : data.message
                    ? Array.isArray(data.message)
                        ? data.message
                        : [data.message]
                    : []
                : [];

            if (!incoming.length) return;

            setConversationMessages((prev) => {
                const existingIds = new Set(prev.map((m) => m.id));
                const toAdd = incoming.filter(
                    (msg: any) => !existingIds.has(msg.id)
                );

                if (!toAdd.length) return prev;

                // prikazujemo samo poruke relevantne za trenutno otvorenu konverzaciju
                const relevantToCurrentConversation = toAdd.filter(
                    (msg: any) =>
                        (targetUser &&
                            (msg.from_id === targetUser.id ||
                                msg.to_id === targetUser.id)) ||
                        (!targetUser && msg.to_id === loggedUser.id)
                );

                return relevantToCurrentConversation.length
                    ? [...prev, ...relevantToCurrentConversation]
                    : prev;
            });
        };

        channel.bind("MessageSent", handleNewMessages);

        return () => {
            channel.unbind("MessageSent", handleNewMessages);
            pusher.unsubscribe(`chat.${loggedUser.id}`);
        };
    }, [loggedUser, targetUser]);

    // 5️⃣ Send message mutation sa optimističkim prikazom
    const { mutate: sendMessageMutate, isLoading: sending } = useMutation({
        mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
        onMutate: (newMessage) => {
            if (!targetUser) return;
            const optimisticMessage = {
                id: `temp-${Date.now()}`,
                from_id: loggedUser?.id,
                to_id: targetUser.id,
                message: newMessage.message,
                created_at: new Date().toISOString(),
            };
            setConversationMessages((prev) => [...prev, optimisticMessage]);
            setMessage("");
        },
        onError: () => alert("Failed to send message"),
        onSuccess: (data) => {
            if (data && Array.isArray(data.messages)) {
                setConversationMessages((prev) => {
                    const withoutTemp = prev.filter(
                        (m) => !`${m.id}`.startsWith("temp")
                    );
                    const filteredNew = data.messages.filter(
                        (msg) => !withoutTemp.some((m) => m.id === msg.id)
                    );
                    return [...withoutTemp, ...filteredNew];
                });
            }
            queryClient.invalidateQueries(["messages", targetUser?.id]);
        },
    });

    function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!targetUser || !message.trim()) return;

        sendMessageMutate({
            to_id: targetUser.id,
            message: message,
        });
    }

    // 6️⃣ Loading / Error states
    if (isLoading)
        return (
            <div className="loading-wrapper">
                <Helix size="100" speed="2" color="#6941c6" />
            </div>
        );
    if (error || isErrorMsg) return <p>{(error as Error).message}</p>;
    if (!users) return <p>No data found.</p>;

    // 7️⃣ Render
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
                                    msg.id ||
                                    `${msg.from_id}-${msg.to_id}-${Date.now()}`
                                }
                                className={`message ${
                                    msg.from_id === loggedUser?.id
                                        ? "from-me"
                                        : "from-them"
                                }`}
                            >
                                <div className="bubble">{msg.message}</div>
                                <span className="time">
                                    {new Date(msg.created_at).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </section>
                ) : (
                    <h2>Select conversation</h2>
                )}

                {/* Input */}
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
            </div>
        </div>
    );
}

export default Home;
