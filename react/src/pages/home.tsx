/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "../services/chatServices";
import { ChatMessage, LiveMessage, User } from "../types/type";
import { useEffect, useState } from "react";
import { pusher } from "../pusherClient";
import EmptyConversation from "../components/emptyState";
import UsersList from "./home-components/usersList";
import ChatInput from "./home-components/chatInput";
import Conversation from "./home-components/conversation";

function Home() {
    const loggedUser = useSelector(
        (state: RootState) => state.auth.loggedInUser
    );
    const [targetUser, setTargetUser] = useState<User | null>(null);
    const [message, setMessage] = useState("");
    const [conversationMessages, setConversationMessages] = useState<
        ChatMessage[]
    >([]);

    // Fetch messages only on targetUser change
    const { data: messages } = useQuery({
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

    // console.log("Conversation messages", conversationMessages);
    // console.log("Logged user", loggedUser);
    // console.log("Targer user", targetUser);

    return (
        <div className="chat-wrapper">
            {/* Users list */}
            <UsersList
                loggedUser={loggedUser}
                setTargetUser={setTargetUser}
                messages={messages}
            />

            {/* Conversation */}
            <div className="conversation-wrapper">
                {targetUser ? (
                    <>
                        <Conversation
                            conversationMessages={conversationMessages}
                            targetUser={targetUser}
                            loggedUser={loggedUser}
                        />
                    </>
                ) : (
                    <EmptyConversation />
                )}

                {/* Input */}
                {targetUser && (
                    <ChatInput
                        targetUser={targetUser}
                        message={message}
                        setMessage={setMessage}
                        setConversationMessages={setConversationMessages}
                    />
                )}
            </div>
        </div>
    );
}

export default Home;
