import { Button, Card, Form, Input } from "antd"
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from "react"
import { useNavigate } from "react-router-dom";

const Login = () => {
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
                <Card style={{ width: 500, padding: 20 }}>
                    <Form
                        name="loginForm"
                        style={{ maxWidth: 400 }}
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="E-Mail"
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email!' },
                                { type: 'email', message: 'Please enter a valid email!' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="E-Mail"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Password"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%' }}
                                size="large"
                                loading={loading}
                            >
                                Log In
                            </Button>
                        </Form.Item>
                    </Form>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <span>Not an account? </span>
                        <span
                            style={{
                                color: '#1890ff',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                textDecoration: 'underline',
                            }}
                            onClick={() => navigate('/register')}
                        >
                            Register Now
                        </span>
                    </div>
                </Card>
            </div>
        </>
    )
}

export default Login
