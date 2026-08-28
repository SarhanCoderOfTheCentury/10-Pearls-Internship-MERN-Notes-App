import apiRequest from "./api";

export async function register(name, email, password) {
    try {
        //sending path and options to apiRequest function
        const res = await apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password })
        });
        console.log("Registration response:", res.data);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function login(email, password) {
    try {
        //sending path and options to apiRequest function
        const res = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });
        console.log("Login response:", res);

        const token = res.token;
        console.log(token)
        // storing the token in local storage, to be used in protected routes. and keep user logged in
        localStorage.setItem("token", token);

        return token;
    } catch (error) {
        throw error;
    }
}


//this will  logout the user
export async function logout() {
    localStorage.removeItem("token");
}

