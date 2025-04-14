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
  const { user } = useSelector((state: RootState) => state.auth) as { user: { Ac_Name?: string } | null };

  // Map path to key
  const pathToKey: { [key: string]: string } = {
    '/': '1',
    '/products': '2',
    '/contact': '3',
  };

  const selectedKey = pathToKey[location.pathname] || '1';

  interface MenuClickEvent {
    key: string;
  }

  const handleMenuClick = (e: MenuClickEvent) => {
    const key = e.key;
    if (key === '1') navigate('/');
    else if (key === '2') navigate('/products');
    else if (key === '3') navigate('/contact');
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
    { key: '1', label: 'Home' },
    { key: '2', label: 'Products' },
    { key: '3', label: 'Contact' },
    {
      key: '4',
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
        onClick={() => navigate('/')}
        style={{
          color: '#fff',
          fontSize: '24px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        ShreejiVeg
      </div>

      {/* Menu + Profile on the right */}
      {screens.md ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Menu
            mode="horizontal"
            items={menuItems.slice(0, 3)} // Only nav items here
            theme="dark"
            onClick={handleMenuClick}
            selectedKeys={[selectedKey]}
            style={{
              background: 'transparent',
              color: '#fff',
              borderBottom: 'none',
              lineHeight: '56px',
            }}
            className={token.colorBgLayout === "White" ? "custom-menu-light" : "custom-menu"}
          />
          <Button onClick={onToggleTheme} style={{ border: "none", background: "transparent" }}>
            {currentTheme === "light" ? <MoonOutlined style={{ fontSize: "22px", color: "#fff" }} /> : <SunOutlined style={{ fontSize: "22px", color: "#fff" }} />}
          </Button>
          <Popover content={popoverContent} trigger="click">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <span style={{ color: '#fff' }}>{user?.Ac_Name}</span>
              <Avatar size="small" style={{ backgroundColor: '#bbf7d0', color: '#000' }}>
                {initials}
              </Avatar>
            </div>
          </Popover>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
            title="Menu"
            placement="right"
            onClose={() => setVisible(false)}
            open={visible}
          >
            <Menu
              className={token.colorBgLayout === "White" ? "custom-menu-light" : "custom-menu"}
              mode="vertical"
              items={menuItems.slice(0, 3)} // Only Home, Products, Contact
              onClick={handleMenuClick}
              selectedKeys={[selectedKey]}
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
