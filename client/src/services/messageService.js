import api from "./api"


//fetch message 

export const fetchMessages = async(chatId,token, pageNumber=1, limit = 50)=>{
    
    const response = await api.get(`/message/${chatId}?page=${pageNumber}&limit=${limit}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })

    return response.data
}

export const sendMessage =(data,token)=>{
    const response = api.post(`/message`,data,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    return response;
}