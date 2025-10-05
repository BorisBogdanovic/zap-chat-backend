import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../../services/chatServices";
import { ChatInputProps, SendMessagePayload } from "../../types/interfaces";
import { Message } from "../../types/type";

function ChatInput({
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
