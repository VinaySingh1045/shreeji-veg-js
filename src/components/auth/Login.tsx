import { Button, Card, Form, Input, message } from "antd"
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { LoginApi } from "../../services/authAPI"

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: string) => {
        try {
            setLoading(true);
            // console.log(values);
            const res = await LoginApi(values);
            console.log("res: ", res);
            if(res.success){
                message.success(res.message);
                // navigate('/');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error While Login2:', error);
            if (error instanceof Error && (error as any).response?.data?.message) {
                message.error((error as any).response.data.message);
            } else {
                message.error('An unexpected error occurred.');
            }
        } finally{
            setLoading(false);
        }
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
                            label="UserName"
                            name="Ac_Name"
                            rules={[
                                { required: true, message: 'Please enter your userName!' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="User Name"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="Book_Pass"
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
