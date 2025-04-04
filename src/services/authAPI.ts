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

export const LoginApi = async (userData) => {
    try {
        const res = await axios.post(`${API_END_POINT}/login`, userData, {
            headers: getAuthHeaders(),
        })
        return res.data
    } catch (error) {
        console.error('Error While Login:', error)
        throw error;
    }
}

export const RequestOTP = async (userData) => {
    try {
        const res = await axios.post(`${API_END_POINT}/requestOTP`, userData, {
            headers: getAuthHeaders(),
        })
        return res.data
    } catch (error) {
        console.error('Error While Login:', error)
        throw error;
    }
}

export const RegisterApi = async (userData) => {
    try {
        const res = await axios.post(`${API_END_POINT}/register`, userData, {
            headers: getAuthHeaders(),
        })
        return res.data
    } catch (error) {
        console.error('Error While Login:', error)
        throw error;
    }
}