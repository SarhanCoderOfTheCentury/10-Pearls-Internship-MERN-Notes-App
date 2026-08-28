import apiRequest from "./api";

//this will  fetch the profile
export async function getCurrentUser() {
    const res = await apiRequest('/user/me', {
        method: 'GET',
    })
    console.log("Profile response:", res.data);
    return res.data; //data is populated in .data because we defined it that way in the backend response handlers
}

//this will  update the profile
export async function updateCurrentUser(userId, userData) {
    const res = await apiRequest(`/user/me/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: userData.name, email: userData.email, bio: userData.bio })
    })
    console.log("Profile update response:", res);
    return res.data.user; //data is populated in .data because we defined it that way in the backend response handlers
}
