import apiClient from "./axios";

export const getComplaint = async (id)=>{
    const response = await apiClient.get(`complaint/getOneComplaint/${id}`);
    return response;
}