/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useQuery } from "@tanstack/react-query";
import {
    fetchUsers,
    fetchMessages,
    sendMessage,
} from "../services/chatServices";
import {
    ChatMessage,
    LiveMessage,
    LoggedUser,
    Message,
    User,
} from "../types/type";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../hooks/useDebaunce";
import { Helix } from "ldrs/react";
import { pusher } from "../pusherClient";
import { SendMessagePayload } from "../types/interfaces";
import { useMutation } from "@tanstack/react-query";
import EmptyConversation from "../components/emptyState";

function Home() {
    const loggedUser = useSelector(
        (state: RootState) => state.auth.loggedInUser
    );
    const [targetUser, setTargetUser] = useState<User | null>(null);
    const [users_search, setUsersSearch] = useState("");
    const debouncedSearch = useDebounce(users_search, 2000);
    const [message, setMessage] = useState("");
    const [conversationMessages, setConversationMessages] = useState<
        ChatMessage[]
    >([]);

    // Auto scroll
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
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

    // Fetch messages only on targetUser change
    const {
        data: messages,
        // isLoading: isLoadingMsg,
        // error: isErrorMsg,
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

    // All messages on page load. ASK BE FOR ALL MESSAGES!!!
    useEffect(() => {
        if (messages && Array.isArray(messages.messages)) {
            // Dodajemo samo nove poruke koje još nisu u allMessages
            setAllMessages((prev) => {
                const newMsgs = messages.messages.filter(
                    (msg: ChatMessage) => !prev.some((m) => m.id === msg.id)
                );

                return [...prev, ...newMsgs];
            });
        }
    }, [messages]);

    // Scroll everytime new msg appears (conversationMessages changes)
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [conversationMessages]);

    // Pusher subscription for live messages
    useEffect(() => {
        if (!loggedUser) return;

        const channel = pusher.subscribe(`private-chat.${loggedUser.id}`);

        channel.bind("MessageSentEvent", (data: LiveMessage) => {
            console.log("Live message:", data);

            if (data.from_id === loggedUser.id) return;

            // Ignoriši ako poruka nije za trenutnog target user-a
            if (targetUser && data.from_id !== targetUser.id) return;

            setConversationMessages((prev) => [...prev, data as ChatMessage]);
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`private-chat.${loggedUser.id}`);
        };
    }, [loggedUser, targetUser]);

    console.log("Conversation messages", conversationMessages);

    // Send message mutation
    const { mutate: sendMessageMutate, isPending: sending } = useMutation({
        mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
        onSuccess: (data: Message) => {
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

    // Image src helper
    function getUserImageUrl(user: LoggedUser | User | null | undefined) {
        if (!user?.image_path) return "/default-avatar.png";
        return user.image_path === "images/default.png"
            ? `http://localhost:8000/${user.image_path}`
            : `http://localhost:8000/storage/${user.image_path}`;
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
    console.log("Logged user", loggedUser);
    console.log("Targer user", targetUser);

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
                                        {lastMessage?.message ||
                                            "No messages yet"}
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

            {/* Conversation */}
            <div className="conversation-wrapper">
                {targetUser ? (
                    <>
                        {" "}
                        <div className="conversation-header">
                            <h3>Conversation with {targetUser.name}</h3>
                        </div>
                        <section className="conversation">
                            {conversationMessages.map((msg) => {
                                const isFromMe = msg.from_id === loggedUser?.id;
                                const imageSrc = isFromMe
                                    ? getUserImageUrl(loggedUser)
                                    : getUserImageUrl(targetUser);

                                return (
                                    <div
                                        key={
                                            msg.id ??
                                            `${msg.from_id}-${msg.to_id}-${msg.message}`
                                        }
                                        className={`message ${
                                            isFromMe ? "from-me" : "from-them"
                                        }`}
                                    >
                                        <div className="bubble-avatar">
                                            <img
                                                src={imageSrc}
                                                alt="Profilna slika"
                                                className="message-avatar"
                                            />
                                        </div>
                                        <div className="bubble-wrapper">
                                            <div className="bubble">
                                                <div className="bubble-msg">
                                                    {" "}
                                                    {msg.message}
                                                </div>
                                            </div>
                                            <span className="time">
                                                {new Date(
                                                    msg.created_at ?? Date.now()
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </section>
                    </>
                ) : (
                    <EmptyConversation />
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
