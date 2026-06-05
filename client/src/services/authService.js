import api from "./api"

//register
export const registerUser = async(userData)=>{
    const response = await api.post("/auth/register",userData)
    return response.data;
}

//login
export const loginUser =async(userData)=>{
    const res = await api.post("/auth/login",userData)
    return res.data;
}

// Example: Get User Profile (if needed)
export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};