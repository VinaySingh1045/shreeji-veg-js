import axios from "axios";
import Cookies from "js-cookie";
import { API_END_POINT } from "../utils/constant";
import { ILogin } from "../types/ILogin";
const getAuthHeaders = () => {
    const token = Cookies.get('Shreeji_Veg');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

export const LoginApi = async (userData: ILogin) => {
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

export const RequestOTP = async (userData: string) => {
    try {
        const res = await axios.post(`${API_END_POINT}/requestOTP`, { mobileNo: userData }, {
            headers: getAuthHeaders(),
        })
        return res.data
    } catch (error) {
        console.error('Error While Login:', error)
        throw error;
    }
}

export const RegisterApi = async (userData: any) => {
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

export const GetCurrentUser = async () => {
    try {
        const res = await axios.get(`${API_END_POINT}/getCurrentUser`, {
            headers: getAuthHeaders(),
        })
        return res.data
    } catch (error) {
        console.error('Error While Verifying:', error);
        throw error;
    }
}

export const LogoutApi = async () => {
    try {
        const res = await axios.post(`${API_END_POINT}/logout`, {}, {
            headers: getAuthHeaders(),
        })
        return res.data
    } catch (error) {
        console.error('Error While Logout:', error);
        throw error;
    }
}
