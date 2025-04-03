import { Button, Card, Col, Form, Input, Row } from "antd"
import { UserOutlined, LockOutlined, SafetyOutlined, MobileOutlined } from '@ant-design/icons';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (values: string) => {
        setLoading(true);
        console.log(values);
        setLoading(false);
    }

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#f5f5f5',
                }}
            >
                <Card style={{ width: 600, padding: 20, marginTop:"30px", marginBottom:"30px" }}>
                    <Form
                        name="registerForm"
                        style={{ maxWidth: 1000 }}
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                    >
                       <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="User Name"
                                name="userName"
                                rules={[
                                    { required: true, message: "Please enter your User Name!" }
                                ]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="User Name" size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Mobile Number"
                                name="mobile"
                                rules={[
                                    { required: true, message: "Please enter your mobile number!" },
                                    { pattern: /^\d{10}$/, message: "Please enter a valid 10-digit mobile number!" }
                                ]}
                            >
                                <Input prefix={<MobileOutlined />} placeholder="Mobile Number" size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: "Please enter your password!" }]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Confirm Password"
                                name="confirmPassword"
                                dependencies={["password"]}
                                rules={[
                                    { required: true, message: "Please confirm your password!" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("password") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error("Passwords do not match!"));
                                        },
                                    })
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="OTP"
                                name="otp"
                                rules={[
                                    { required: true, message: "Please enter OTP!" },
                                    { pattern: /^\d{6}$/, message: "OTP must be a 6-digit number!" }
                                ]}
                            >
                                <Input prefix={<SafetyOutlined />} placeholder="Enter OTP" size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%' }}
                                size="large"
                                loading={loading}
                            >
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <span>Already have an account? </span>
                        <span
                            style={{
                                color: '#1890ff',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                textDecoration: 'underline',
                            }}
                            onClick={() => navigate('/login')}
                        >
                            Login Now
                        </span>
                    </div>
                </Card>



                {/* <Card style={{ width: 400, padding: 20, marginTop:"30px", marginBottom:"30px" }}>
                    <Form
                        name="registerForm"
                        style={{ maxWidth: 1000 }}
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="User Name"
                            name="userName"
                            rules={[
                                { required: true, message: 'Please enter your User Name!' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter your User Name"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Mobile Number"
                            name="mobile"
                            rules={[
                                { required: true, message: "Please enter your mobile number!" },
                                { pattern: /^\d{10}$/, message: "Please enter a valid 10-digit mobile number!" },
                            ]}
                        >
                            <Input prefix={<MobileOutlined />} placeholder="Mobile Number" size="large" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: "Please enter your password!" }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                        </Form.Item>

                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "Please confirm your password!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Passwords do not match!"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
                        </Form.Item>

                        <Form.Item
                            label="OTP"
                            name="otp"
                            rules={[
                                { required: true, message: "Please enter OTP!" },
                                { pattern: /^\d{6}$/, message: "OTP must be a 6-digit number!" },
                            ]}
                        >
                            <Input prefix={<SafetyOutlined />} placeholder="Enter OTP" size="large" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%' }}
                                size="large"
                                loading={loading}
                            >
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <span>Already have an account? </span>
                        <span
                            style={{
                                color: '#1890ff',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                textDecoration: 'underline',
                            }}
                            onClick={() => navigate('/login')}
                        >
                            Login Now
                        </span>
                    </div>
                </Card> */}
                
            </div>
        </>
    )
}

export default Register
