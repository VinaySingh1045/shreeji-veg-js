import axios from "axios";
import { API_END_POINT } from "../utils/constant";
import { getAuthHeaders } from "../utils/getAuthHeaders";

export const GetNotifaction = async () => {
    try {
        const res = await axios.get(`${API_END_POINT}/getNotification`, {
            headers: getAuthHeaders(),
        })
        return res.data
    } catch (error) {
        console.error('Error While getting the LR No:', error)
        throw error;
    }
}