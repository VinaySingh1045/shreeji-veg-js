import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login'
import Layout from './components/Layout'
import Home from './components/home/Home'

const router = createBrowserRouter([

  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/",
        element: <Home />
      },
    ]
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
