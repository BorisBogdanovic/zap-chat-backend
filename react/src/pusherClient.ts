// pusherClient.ts
import Pusher from "pusher-js";

export const pusher = new Pusher("c62c108160e4b23c8f71", {
    cluster: "eu",
    forceTLS: true,
});
