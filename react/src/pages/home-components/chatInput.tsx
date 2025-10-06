import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../../services/chatServices";
import { ChatInputProps, SendMessagePayload } from "../../types/interfaces";
import { ChatMessage, Message } from "../../types/type";

function ChatInput({
    loggedUser,
    targetUser,
    message,
    setMessage,
    setConversationMessages,
}: ChatInputProps) {
    // Send message mutation
    const { mutate: sendMessageMutate, isPending: sending } = useMutation({
        mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
        onSuccess: (data: Message) => {
            console.log("Message data POST Req sent: ", data);

            if (!data || !data.data || !targetUser) return;
            const newMsg = data.data;

            setConversationMessages((prev) =>
                prev.map((m) =>
                    String(m.id).startsWith("temp") &&
                    m.message === newMsg.message &&
                    m.from_id === newMsg.from_id
                        ? { ...m, ...newMsg, confirmed: true } // update samo polja
                        : m
                )
            );

            setMessage("");
        },
        onError: () => alert("Failed to send message"),
    });

    function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!targetUser || !message.trim()) return;

        // Instant msg show
        const optimisticMessage: ChatMessage = {
            id: `temp-${Date.now()}`,
            from_id: loggedUser?.id,
            from: {
                id: loggedUser?.id,
                image_path: loggedUser?.image_path,
                name: loggedUser?.name,
            },
            to: {
                id: targetUser.id,
                image_path: targetUser.image_path,
                name: targetUser.name,
            },
            to_id: targetUser.id,
            message: message,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            read_at: null,
            confirmed: false,
        };

        setConversationMessages((prev) => [...prev, optimisticMessage]);

        sendMessageMutate({
            to_id: targetUser.id,
            message: message,
        });
    }
    return (
        <div className="conversation-input">
            <form onSubmit={handleSendMessage} className="message-input">
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
    );
}

export default ChatInput;
