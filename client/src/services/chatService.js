import api from "./api";


export const fetchChats = async (token) => {

  const response = await api.get(
    "/chat",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};