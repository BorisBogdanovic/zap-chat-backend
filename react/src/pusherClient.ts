// pusherClient.ts
import Pusher from "pusher-js";

const token = JSON.parse(
    localStorage.getItem("loggedInUser") || "{}"
)?.auth_token;
// console.log("Token", token);
export const pusher = new Pusher("c62c108160e4b23c8f71", {
    cluster: "eu",
    forceTLS: true, // ako koristiš https, inače false
    authEndpoint: "http://127.0.0.1:8000/broadcasting/auth", // samo za private kanale
    auth: {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    },
});
