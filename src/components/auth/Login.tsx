import { Button, Card, Form, Input, message } from "antd"
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { LoginApi } from "../../services/authAPI"
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setUser } from "../../redux/slice/authSlice";

const Login = () => {

    const { user } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: string) => {
        setLoading(true);
        try {
            // console.log(values);
            const response = await LoginApi(values);
            console.log("res: ", response.data);
            message.success('Login successful!');
            Cookies.set('Shreeji_Veg', response.data.token, { expires: 15 })
            dispatch(setUser(response.data.user))
            if (response.data.user.isAdmin === true) {
                navigate("/user/List");
            }
            else {
                navigate("/");
            }
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
