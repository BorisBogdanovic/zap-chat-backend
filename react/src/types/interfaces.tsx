/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReactNode } from "react";
import { ChatMessage, LoggedUser, Messages, User } from "./type";

// Tipiziranje za children (PrivateRoute)
export interface PrivateRouteProps {
    children: ReactNode;
    requiredRole?: "admin" | "user"; // ili samo 'admin' ako ti ne treba za 'user'
}

export interface PublicRouteProps {
    children: ReactNode;
}

export interface SendMessagePayload {
    to_id: number; // ID korisnika kojem šalješ
    message: string;
}

// User List props type
export interface UsersListProps {
    loggedUser: LoggedUser | null;
    setTargetUser: React.Dispatch<React.SetStateAction<User | null>>;
    messages: Messages;
}

// Chat input props type
export interface ChatInputProps {
    targetUser: User | null;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setConversationMessages: React.Dispatch<
        React.SetStateAction<ChatMessage[]>
    >;
}

export interface ConversationProps {
    conversationMessages: ChatMessage[];
    targetUser: User | null;
    loggedUser: LoggedUser | null;
}
