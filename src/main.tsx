import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login'
import Layout from './components/Layout'
import Home from './components/home/Home'
import { ConfigProvider } from 'antd'
import Register from './components/auth/Register'

const router = createBrowserRouter([

  {
    path: "/",
    element: <Layout />,
    children: [

      {
        path: "/",
        element: <Home />
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#46cb4c',
          borderRadius: 16,
          fontFamily: "Rubik",
          colorPrimaryBg: "#ebf2ed",
          colorBgLayout: "White",
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>,
)
