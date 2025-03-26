import { Outlet } from "react-router-dom"
import Footer from "./shared/Footer"
import Navbar from "./shared/Navbar"

const Layout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}

export default Layout
