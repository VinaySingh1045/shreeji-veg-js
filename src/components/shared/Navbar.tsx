import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Grid } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { useBreakpoint } = Grid;

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const screens = useBreakpoint();

  const menuItems = [
    { key: '1', label: 'Home' },
    { key: '2', label: 'Products' },
    { key: '3', label: 'Contact' },
  ];

  return (
    <Header
      style={{
        background: '##22c55e', // veggie green
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px',
      }}
    >
      <div
        className="logo"
        style={{
          color: '#fff',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        ShreejiVeg
      </div>

      {screens.md ? (
        <Menu
          mode="horizontal"
          items={menuItems}
          theme="dark"
          style={{
            background: 'transparent',
            color: '#fff',
            borderBottom: 'none',
          }}
        />
      ) : (
        <>
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: '#fff', fontSize: '20px' }} />}
            onClick={() => setVisible(true)}
          />
          <Drawer
            title="Menu"
            placement="right"
            onClose={() => setVisible(false)}
            open={visible}
          >
            <Menu mode="vertical" items={menuItems} />
          </Drawer>
        </>
      )}
    </Header>
  );
};

export default Navbar;
