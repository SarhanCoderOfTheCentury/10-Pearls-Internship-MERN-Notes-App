const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data?.message || data?.error || `Error fetching ${endpoint}: ${response.statusText}`;
        const error = new Error(errorMessage);
        // Only clear token on 401 Unauthorized - not on every error
        if (response.status === 401) {
            localStorage.removeItem("token");
        }
        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}

export default apiRequest;