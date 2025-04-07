import { Outlet, useNavigate } from "react-router-dom"
import Footer from "./shared/Footer"
import Navbar from "./shared/Navbar"
import { AppDispatch } from "../redux/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { setUser } from "../redux/slice/authSlice";
import { Spin } from "antd";
import { GetCurrentUser } from "../services/authAPI";
const Layout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);

    const token = Cookies.get("Shreeji_Veg");
    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                navigate("/login");
                return;
            }
            try {
                setLoading(true);
                const userInfo = await GetCurrentUser();
                dispatch(setUser(userInfo.data));
            } catch (error) {
                console.error("Invalid token:", error);
                navigate("/login");
            }
        };
        fetchData();
        setLoading(false);
    }, [navigate, dispatch, token]);

    if (loading) {
        return <Spin />
    }

    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}

export default Layout
