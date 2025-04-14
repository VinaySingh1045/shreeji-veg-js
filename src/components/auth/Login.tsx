import { Button, Card, Checkbox, Form, Input, message, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginApi } from "../../services/authAPI";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { setUser } from "../../redux/slice/authSlice";
import { ILogin } from "../../types/ILogin";

const Login = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    interface APIError {
        response?: {
            data?: {
                message?: string;
            };
        };
    }

    useEffect(() => {
        const savedUser = localStorage.getItem("rememberedUser");
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            form.setFieldsValue({
                Ac_Name: parsed.Ac_Name,
                Book_Pass: parsed.Book_Pass,
                remember: true,
            });
        }
    }, [form]);

    const handleSubmit = async (values: ILogin & { remember?: boolean }) => {
        setLoading(true);
        try {
            const response = await LoginApi(values);
            message.success("Login successful!");

            Cookies.set('Shreeji_Veg', response.data.token, { expires: 15 })
            dispatch(setUser(response.data.user));

            if (values.remember) {
                localStorage.setItem("rememberedUser", JSON.stringify({
                    Ac_Name: values.Ac_Name,
                    Book_Pass: values.Book_Pass,
                }));
            } else {
                localStorage.removeItem("rememberedUser");
            }


            if (response.data.user.isAdmin === true) {
                navigate("/user/List");
            } else {
                navigate("/");
            }
        } catch (error) {
            const apiError = error as APIError;
            if (apiError.response?.data?.message) {
                message.error(apiError.response.data.message);
            } else {
                message.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
                padding: 16,
            }}
        >
            <Card style={{ maxWidth: 900, width: "100%" }}>
                <Row gutter={[32, 16]} align="middle" justify="center">
                    <Col xs={24} md={12}>
                        <img
                            src="/Shreeji_img.avif"
                            alt="Login Visual"
                            style={{
                                width: "100%",
                                maxHeight: 300,
                                objectFit: "cover",
                                borderRadius: 8,
                            }}
                        />
                    </Col>

                    <Col xs={24} md={12}>
                        <Form
                            form={form}
                            name="loginForm"
                            layout="vertical"
                            onFinish={handleSubmit}
                            autoComplete="off"
                            initialValues={{ remember: true }}
                        >
                            <Form.Item
                                label="Username"
                                name="Ac_Name"
                                rules={[{ required: true, message: "Please enter your username!" }]}
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
                                rules={[{ required: true, message: "Please enter your password!" }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Password"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item name="remember" valuePropName="checked">
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ width: "100%" }}
                                    size="large"
                                    loading={loading}
                                >
                                    Log In
                                </Button>
                            </Form.Item>
                        </Form>

                        <div style={{ textAlign: "center", marginTop: 10 }}>
                            <span>Not an account? </span>
                            <span
                                style={{
                                    color: "#1890ff",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    textDecoration: "underline",
                                }}
                                onClick={() => navigate("/register")}
                            >
                                Register Now
                            </span>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Login;
