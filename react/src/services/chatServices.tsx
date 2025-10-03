const API_URL = "http://127.0.0.1:8000/api";

export async function fetchUsers(search?: string) {
    const storedUser = localStorage.getItem("loggedInUser");
    const token = storedUser ? JSON.parse(storedUser).auth_token : null;
    if (!token) throw new Error("No token found");
    const query = search ? `?search=${encodeURIComponent(search)}` : "";

    const res = await fetch(`${API_URL}/users${query}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }

    return res.json();
}
