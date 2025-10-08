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
import { transformLiveToChat } from "../utils/utils";
import { Members, OnlineUser } from "../types/interfaces";

function Home() {
    const loggedUser = useSelector(
        (state: RootState) => state.auth.loggedInUser
    );
    const [targetUser, setTargetUser] = useState<User | null>(null);
    const [message, setMessage] = useState("");
    const [conversationMessages, setConversationMessages] = useState<
        ChatMessage[]
    >([]);

    const [showConversation, setShowConversation] = useState(false);

    // Online status
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

    // Fetch messages only on targetUser change
    const { data: messages } = useQuery({
        queryKey: ["messages", targetUser?.id],
        queryFn: () => fetchMessages(targetUser!.id),
        enabled: !!targetUser,
    });

    // Update conversationMessages when messages are fetched
    useEffect(() => {
        // console.log("Messages", messages);
        if (messages && Array.isArray(messages.data.messages)) {
            setConversationMessages(messages.data.messages);
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

            // If logged user sent msg, ignore it
            if (data.from_id === loggedUser.id) return;

            if (targetUser && data.from_id !== targetUser.id) return;

            setConversationMessages((prev) => {
                // console.log(prev);
                // if optimistic msg
                const tempExists = prev.some(
                    (m) =>
                        String(m.id).startsWith("temp") &&
                        m.message === data.message &&
                        m.from_id === data.from_id
                );

                if (tempExists) {
                    // update temp msg
                    return prev.map((m) =>
                        String(m.id).startsWith("temp") &&
                        m.message === data.message &&
                        m.from_id === data.from_id
                            ? { ...m, ...data, confirmed: true }
                            : m
                    );
                }

                // Helper function to merge types for TS. Live msg has different structure than regular msg
                const newMessage = transformLiveToChat(
                    data,
                    loggedUser,
                    targetUser
                );
                return [...prev, newMessage];
            });
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`private-chat.${loggedUser.id}`);
        };
    }, [loggedUser, targetUser]);

    // Online presence channel
    useEffect(() => {
        if (!loggedUser) return;

        const presenceChannel = pusher.subscribe("presence-online");

        presenceChannel.bind(
            "pusher:subscription_succeeded",
            (members: Members) => {
                // console.log("Members", members);
                const users = Object.values(members.members) as OnlineUser[];
                setOnlineUsers(users);
            }
        );

        presenceChannel.bind("pusher:member_added", (member: OnlineUser) => {
            console.log("Member Added: ", member);
            setOnlineUsers((prev) => {
                const exists = prev.some((u) => u.id === member.id);
                if (!exists) return [...prev, member];
                return prev;
            });
        });

        presenceChannel.bind("pusher:member_removed", (member: OnlineUser) => {
            console.log("Member Removed: ", member);

            setOnlineUsers((prev) => prev.filter((u) => u.id !== member.id));
        });

        return () => {
            presenceChannel.unbind_all();
            pusher.unsubscribe("presence-online");
        };
    }, [loggedUser]);

    // console.log("Online users: ", onlineUsers);
    // console.log("Conversation messages", conversationMessages);
    // console.log("Logged user", loggedUser);
    // console.log("Targer user", targetUser);

    return (
        <div className="chat-wrapper">
            <div
                className={`users-list-wrapper ${
                    showConversation ? "hidden-mobile" : "active"
                }`}
            >
                {/* Users list */}
                <UsersList
                    loggedUser={loggedUser}
                    setTargetUser={setTargetUser}
                    messages={messages}
                    setShowConversation={setShowConversation}
                    onlineUsers={onlineUsers}
                />
            </div>

            {/* Conversation */}
            <div
                className={`conversation-wrapper ${
                    showConversation ? "active" : "hidden-mobile"
                }`}
            >
                {targetUser ? (
                    <>
                        <Conversation
                            conversationMessages={conversationMessages}
                            targetUser={targetUser}
                            loggedUser={loggedUser}
                            setShowConversation={setShowConversation}
                        />
                    </>
                ) : (
                    <EmptyConversation />
                )}

                {/* Input */}
                {targetUser && (
                    <ChatInput
                        loggedUser={loggedUser}
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
