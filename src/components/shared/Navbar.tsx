import { useState } from 'react';
import { Layout, Menu, Button, Drawer, Grid, Popover, Avatar, Space, message, theme } from 'antd';
import { LogoutOutlined, MenuOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { setUser } from '../../redux/slice/authSlice';
import Cookies from 'js-cookie';
import { LogoutApi } from '../../services/authAPI';

const { Header } = Layout;
const { useBreakpoint } = Grid;

interface NavbarProps {
  onToggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

const Navbar = ({ onToggleTheme, currentTheme }: NavbarProps) => {
  const [visible, setVisible] = useState(false);
  const screens = useBreakpoint();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth) as { user: { Ac_Name?: string, isAdmin: boolean } | null };

  // Map path to key
  const pathToKey: { [key: string]: string } = {
    '/': 'orders',
    '/favourites': 'favourites',
    '/contact': 'contact',
    '/user/list': 'admin-users',
    '/all/veges': 'admin-veges',
  };

  const selectedKey = Object.entries(pathToKey).find(([path]) =>
    location.pathname === path || location.pathname.startsWith(path + '/')
  )?.[1] || '1';

  interface MenuClickEvent {
    key: string;
  }

  const handleMenuClick = (e: MenuClickEvent) => {
    const key = e.key;
    if (key === 'orders') navigate('/');
    else if (key === 'favourites') navigate('/favourites');
    else if (key === 'contact') navigate('/contact');
    else if (key === 'admin-users') navigate('/user/list');
    else if (key === 'admin-veges') navigate('/all/veges');
    setVisible(false);
  };

  const handleLogout = async () => {
    await LogoutApi()
    dispatch(setUser(null));
    Cookies.remove("Shreeji_Veg");
    navigate("/login");
    message.success("Logged out successfully!");
  }

  const popoverContent = (
    <div>
      <Space direction="vertical">
        <Button onClick={handleLogout} type="text" icon={<LogoutOutlined />}>
          Logout
        </Button>
      </Space>
    </div>
  );



  const fullName = user?.Ac_Name;

  const getInitials = (name?: string) => {
    if (!name) return "";

    const words = name.trim().split(" ")

    if (words.length === 0) return "";
    if (words.length === 1) return words[0][0]?.toUpperCase() || "";
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(fullName);

  const menuItems = [
    ...(user && user.isAdmin
      ? [
        { key: 'admin-users', label: 'User List' },
        { key: 'admin-veges', label: 'All Vegetables' },
      ]
      : []),
    ...(user && !user.isAdmin
      ? [
        { key: 'orders', label: 'Orders' },
        { key: 'favourites', label: 'Favourites' },
        { key: 'contact', label: 'Contact' },
      ]
      : []),
    {
      key: '4', label:
        (
          <a onClick={onToggleTheme} style={{ border: "none", background: "transparent", marginTop: "0px" }}>
            {currentTheme === "light" ? <MoonOutlined style={{ fontSize: "19px", color: "#fff" }} /> : <SunOutlined style={{ fontSize: "19px", color: "#fff" }} />}
          </a>
        )
    },
    {
      key: '5',
      label: (
        <Popover content={popoverContent} trigger="click">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{user?.Ac_Name}</span>
            <Avatar size="small">{initials}</Avatar>
          </div>
        </Popover>
      ),
    },
  ];

  console.log("Current path:", location.pathname);
  console.log("Selected key:", selectedKey);
  // console.log("Last saved path:", localStorage.getItem("lastPath"));


  return (
    <Header
      style={{
        background: token.colorPrimaryBg,
        borderBottom: "1px solid #fafafa",
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '56px',
      }}
    >
      {/* Logo on the left */}
      <div
        className="logo"
        onClick={() => {
          if (!user) {
            navigate('/login');
          } else if (!user.isAdmin) {
            navigate('/');
          } else {
            navigate('/user/list');
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: '#fff',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        <img className='logo-img' src="/01.png" alt="logo" style={{ height: '44px' }} />
        <span style={{ fontSize: "20px" }} className='logo-text'>ShreejiVeg</span>
      </div>


      {/* Menu + Profile on the right */}
      {screens.md ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexGrow: 1 }}>
          <Menu
            mode="horizontal"
            items={menuItems.slice(0, 5)} // Only nav items here
            theme="dark"
            onClick={handleMenuClick}
            selectedKeys={selectedKey ? [selectedKey] : []}
            style={{
              background: 'transparent',
              color: '#fff',
              borderBottom: 'none',
              lineHeight: '56px',
              // minWidth: 300,
              flexGrow: 1,
              justifyContent: 'flex-end',
            }}
            className={token.colorBgLayout === "White" ? "custom-menu-light" : "custom-menu"}
          />
          {/* <Button onClick={onToggleTheme} style={{ border: "none", background: "transparent" }}>
            {currentTheme === "light" ? <MoonOutlined style={{ fontSize: "22px", color: "#fff" }} /> : <SunOutlined style={{ fontSize: "22px", color: "#fff" }} />}
          </Button>
          <Popover content={popoverContent} trigger="click">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <span style={{ color: '#fff' }}>{user?.Ac_Name}</span>
              <Avatar size="small" style={{ backgroundColor: '#bbf7d0', color: '#000' }}>
                {initials}
              </Avatar>
            </div>
          </Popover> */}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Button onClick={onToggleTheme} style={{ border: "none", background: "transparent" }}>
              {currentTheme === "light" ? <MoonOutlined style={{ fontSize: "22px", color: "#fff" }} /> : <SunOutlined style={{ fontSize: "22px", color: "#fff" }} />}
            </Button>
            <span style={{ color: '#fff' }}>{user?.Ac_Name}</span>
            <Avatar size="small" style={{ backgroundColor: '#bbf7d0', color: '#000' }}>
              {initials}
            </Avatar>
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: '#fff', fontSize: '20px', marginTop: "25px" }} />}
              onClick={() => setVisible(true)}
            />
          </div>

          <Drawer
            title=""
            placement="right"
            onClose={() => setVisible(false)}
            open={visible}
          >
            <Menu
              className={token.colorBgLayout === "White" ? "custom-menu-light" : "custom-menu"}
              mode="vertical"
              items={menuItems.slice(0, 3)} // Only Home, Products, Contact
              onClick={handleMenuClick}
              selectedKeys={selectedKey ? [selectedKey] : []}
            />

            {/* Logout button for mobile only */}
            {!screens.md && (
              <div style={{ marginTop: 16 }}>
                <Button
                  onClick={handleLogout}
                  type="primary"
                  icon={<LogoutOutlined />}
                  block
                  danger
                >
                  Logout
                </Button>
              </div>
            )}
          </Drawer>
        </>
      )}
    </Header>

  );

};

export default Navbar;
