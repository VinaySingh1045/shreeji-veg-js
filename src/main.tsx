import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login'
import Layout from './components/Layout'
import { ConfigProvider } from 'antd'
import Register from './components/auth/Register'
import UserListToApprove from './components/admin/UserListToApprove'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import AllVeges from './components/vegetable/AllVeges'
import AllFavorites from './components/vegetable/AllFavorites'
import './i18n';
import SelectLanguage from './components/auth/SelectLanguage'
import AllOrders from './orders/AllOrders'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [

      {
        path: "/",
        element: <AllOrders />
      },
      {
        path: "/favourites",
        element: <AllFavorites />
      },
      {
        path: "/user/list",
        element: <UserListToApprove />
      },
      {
        path: "/all/veges",
        element: <AllVeges />
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
  {
    path: "/select-language",
    element: <SelectLanguage />
  }

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
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
    </Provider >
  </StrictMode>,
)
