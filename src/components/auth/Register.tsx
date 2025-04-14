import { Button, Card, Col, Form, Input, message, Row } from "antd"
import { UserOutlined, LockOutlined, SafetyOutlined, MobileOutlined } from '@ant-design/icons';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterApi, RequestOTP } from "../../services/authAPI";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [form] = Form.useForm();
    interface APIError {
        response?: {
            data?: {
                message?: string;
            };
        };
    }

    const handleSubmit = async (values: string) => {
        if (!otpSent) {
            message.warning("Please request OTP first!");
            return;
        }
        try {
            setLoading(true);
            await RegisterApi(values);
            navigate("/login");
            message.success("Registration successful! Please login.");
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

    const handleOTPSubmit = async () => {
        const values = await form.validateFields(["Mobile_No"]);
        if (!values.Mobile_No) {
            message.warning("Please enter your mobile number!");
            return;
        }
        setOtpLoading(true);
        try {
            await RequestOTP({ mobileNo: values.Mobile_No });
            message.success("OTP sent successfully!");
            setOtpSent(true);
            setTimer(300);

            // clear old interval if any
            if (intervalId) clearInterval(intervalId);

            const id = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(id);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            setIntervalId(id);
        } catch {
            message.error("Failed to send OTP. Try again!");
        }
        setOtpLoading(false);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                padding: 16,
            }}
        >
            <Card style={{ width: '100%', maxWidth: 1000, padding: 20 }}>
                <Row gutter={[32, 16]} align="middle" justify="center">
                    <Col xs={24} md={12}>
                        <img
                            src="/Shreeji_img.avif"
                            alt="Register"
                            style={{
                                width: '100%',
                                maxHeight: 300,
                                objectFit: 'cover',
                                borderRadius: 8,
                            }}
                        />
                    </Col>

                    {/* Right side form */}
                    <Col xs={24} md={12}>
                        <Form
                            name="registerForm"
                            layout="vertical"
                            onFinish={handleSubmit}
                            autoComplete="off"
                            form={form}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="User Name"
                                        name="Ac_Name"
                                        rules={[{ required: true, message: "Please enter your User Name!" }]}
                                    >
                                        <Input prefix={<UserOutlined />} placeholder="User Name" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Mobile Number"
                                        name="Mobile_No"
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
                                        name="Book_Pass"
                                        rules={[
                                            { required: true, message: "Please enter your password!" },
                                            {
                                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{5,20}$/,
                                                message: "Password: 5-20 chars, 1 upper, 1 lower & 1 special!"
                                            }
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        dependencies={["Book_Pass"]}
                                        rules={[
                                            { required: true, message: "Please confirm your password!" },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue("Book_Pass") === value) {
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

                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        label={
                                            <>
                                                OTP{" "}
                                                {timer > 0 && (
                                                    <span style={{ color: "green", fontSize: 20, marginLeft: 12 }}>
                                                        ({Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")})
                                                    </span>
                                                )}
                                            </>
                                        }
                                        name="otp"
                                        rules={[
                                            { required: true, message: "Please enter OTP!" },
                                            { pattern: /^\d{6}$/, message: "OTP must be a 6-digit number!" }
                                        ]}
                                    >
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                            <Input
                                                prefix={<SafetyOutlined />}
                                                placeholder="Enter OTP"
                                                size="large"
                                                style={{ flex: 1 }}
                                            />
                                            <Button
                                                type="primary"
                                                loading={otpLoading}
                                                onClick={handleOTPSubmit}
                                            >
                                                Send OTP
                                            </Button>
                                        </div>
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
                    </Col>
                </Row>
            </Card>
        </div>
    )
};

export default Register;
