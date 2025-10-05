import { useEffect, useRef } from "react";
import { ChatMessage, LoggedUser, User } from "../../types/type";
import { ConversationProps } from "../../types/interfaces";

function Conversation({
    conversationMessages,
    targetUser,
    loggedUser,
}: ConversationProps) {
    // Auto scroll
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll everytime new msg appears (conversationMessages changes)
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [conversationMessages]);
    // Image src helper
    function getUserImageUrl(user: LoggedUser | User | null | undefined) {
        if (!user?.image_path) return "/default-avatar.png";
        return user.image_path === "images/default.png"
            ? `http://localhost:8000/${user.image_path}`
            : `http://localhost:8000/storage/${user.image_path}`;
    }
    return (
        <>
            <div className="conversation-header">
                <h3>Conversation with {targetUser?.name}</h3>
            </div>
            <section className="conversation">
                {conversationMessages.map((msg: ChatMessage) => {
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
    );
}

export default Conversation;
