import api from "./api"

//register
export const registerUser = async(userData)=>{
    const response = await api.post("/auth/register",userData)
    return response.data;
}

//login
export const loginUser =async(userData)=>{
    try {
        const res = await api.post("/auth/login",userData)
         return res.data;
    } catch (error) {
     const errorMessage = error.response?.data?.message  || error.response?.data?.error || error.message || "Login failed. Please try again.";
      throw new Error(errorMessage,{cause:error});
    }
}

// Example: Get User Profile (if needed)
export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};