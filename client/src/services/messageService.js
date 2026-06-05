import api from "./api"


//fetch message 

export const fetchMessages = async(chatId,token)=>{
    
    const response = await api.get(`/message/${chatId}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })

    return response
}

export const sendMessage =(data,token)=>{
    const response = api.post(`/message`,data,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    return response;
}