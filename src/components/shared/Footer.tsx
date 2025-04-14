import { Layout, theme } from 'antd';

const { Footer: AntFooter } = Layout;
const Footer = () => {
  const { token } = theme.useToken();
  return (
    <AntFooter  className="custom-footer" style={{ background: token.colorPrimaryBg, color: '#fff', padding: '10px 10px', borderTop: "1px solid #fafafa", height: "50px", display: "flex", justifyContent: "center", alignItems: "center", }}>
      <div style={{ textAlign: 'center', marginTop: 0 }}>
        © {new Date().getFullYear()} VeggieShop. All rights reserved.
      </div>
    </AntFooter>
  );
};

export default Footer;
