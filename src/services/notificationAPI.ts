import axios from "axios";
import Cookies from "js-cookie";
import { API_END_POINT } from "../utils/constant";
const getAuthHeaders = () => {
    const token = Cookies.get('Shreeji_Veg');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

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