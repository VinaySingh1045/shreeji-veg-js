import axios from "axios";
import Cookies from "js-cookie";
import { API_END_POINT } from "../utils/constant";
const getAuthHeaders = () => {
    const token = Cookies.get('ms_intern_jwt');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};


export const getUsersToApprove = async () => {
    try {
        const res = await axios.get(`${API_END_POINT}/getUnapprovedUsers`, {
            headers: getAuthHeaders(),
        })
        return res.data
    } catch (error) {
        console.error('Error While Fetching unApprove user:', error)
        throw error;
    }
}