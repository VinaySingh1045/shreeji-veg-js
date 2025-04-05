import { Layout, Row, Col } from 'antd';

const { Footer: AntFooter } = Layout; // Renamed only the AntD Footer

const Footer = () => {
  return (
    <AntFooter style={{ background: '#388E3C', color: '#fff', padding: '40px 20px' }}>
      <Row gutter={[16, 16]} justify="space-between">
        <Col xs={24} sm={12} md={6}>
          <h3 style={{ color: '#FFEB3B' }}>ShreejiVeg</h3>
          <p>Fresh vegetables delivered to your doorstep.</p>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <h4>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="/" style={{ color: '#fff' }}>Home</a></li>
            <li><a href="/products" style={{ color: '#fff' }}>Products</a></li>
            <li><a href="/contact" style={{ color: '#fff' }}>Contact</a></li>
          </ul>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <h4>Contact Us</h4>
          <p>Email: support@veggieshop.com</p>
          <p>Phone: +91 12345 67890</p>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <h4>Follow Us</h4>
          <p>Instagram | Facebook | Twitter</p>
        </Col>
      </Row>

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        © {new Date().getFullYear()} VeggieShop. All rights reserved.
      </div>
    </AntFooter>
  );
};

export default Footer;
