import { Button, Card, Col, Form, Input, message, Row } from "antd";
import { UserOutlined, LockOutlined, SafetyOutlined, MobileOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterApi, RequestOTP } from "../../services/authAPI";
import { useTranslation } from "react-i18next";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [form] = Form.useForm();
    const { t, i18n } = useTranslation();

    const normalizePhoneNumber = (input: string): string => {
        const hindiNums = "०१२३४५६७८९";
        const gujaratiNums = "૦૧૨૩૪૫૬૭૮૯";
        return input
            .split("")
            .map(char => {
                if (hindiNums.includes(char)) {
                    return hindiNums.indexOf(char).toString();
                }
                if (gujaratiNums.includes(char)) {
                    return gujaratiNums.indexOf(char).toString();
                }
                return char;
            })
            .join("");
    };

    useEffect(() => {
        const lang = localStorage.getItem("appLanguage") || "en";
        i18n.changeLanguage(lang);
    }, [i18n]);

    const handleLanguageChange = (e: any) => {
        const lang = e.target.value;
        i18n.changeLanguage(lang);
        localStorage.setItem("appLanguage", lang);
    };

    interface APIError {
        response?: {
            data?: {
                message?: string;
            };
        };
    }

    const handleSubmit = async (values: any) => {
        if (!otpSent) {
            message.warning(t("otpRequestWarning"));
            return;
        }
        values.Mobile_No = normalizePhoneNumber(values.Mobile_No);
        try {
            setLoading(true);
            const res = await RegisterApi(values);
            console.log("res: ", res);
        } catch (error) {
            const apiError = error as APIError;
            if (apiError.response?.data?.message) {
                message.error(apiError.response.data.message);
            } else {
                message.error(t("unexpectedError"));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async () => {
        const values = await form.validateFields(["Mobile_No"]);
        if (!values.Mobile_No) {
            message.warning(t("enterMobileWarning"));
            return;
        }
        setOtpLoading(true);
        try {
            await RequestOTP({ mobileNo: values.Mobile_No });
            message.success(t("otpSentSuccess"));
            setOtpSent(true);
        } catch {
            message.error(t("otpSendFail"));
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
                <div style={{ textAlign: "right", marginBottom: 16 }}>
                    <select onChange={handleLanguageChange} defaultValue={i18n.language}>
                        <option value="en">English</option>
                        <option value="hi">हिन्दी</option>
                        <option value="gu">ગુજરાતી</option>
                    </select>
                </div>
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
                                        label={t("userName")}
                                        name="Ac_Name"
                                        rules={[{ required: true, message: t("userName") + t(" is required") }]}
                                    >
                                        <Input prefix={<UserOutlined />} placeholder={t("userName")} size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={t("mobileNumber")}
                                        name="Mobile_No"
                                        rules={[
                                            {
                                                required: true,
                                                message: t("mobileNumber") + " " + t(" is required"),
                                            },
                                            {
                                                validator: (_, value) => {
                                                    const normalized = normalizePhoneNumber(value || "");
                                                    if (/^\d{10}$/.test(normalized)) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error(t("Mobile Number Should be 10 Digits")));
                                                }
                                            }
                                        ]}
                                    >
                                        <Input
                                            prefix={<MobileOutlined />}
                                            placeholder={t("mobileNumber")}
                                            size="large"
                                        />
                                    </Form.Item>

                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label={t("password")}
                                        name="Book_Pass"
                                        rules={[
                                            { required: true, message: t("password") + t(" is required") },
                                            {
                                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{5,20}$/,
                                                message: t("Password: 5-20 chars, 1 upper, 1 lower & 1 special!")
                                            }
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder={t("password")} size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={t("confirmPassword")}
                                        name="confirmPassword"
                                        dependencies={["Book_Pass"]}
                                        rules={[
                                            { required: true, message: t("confirmPassword") + t(" is required") },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue("Book_Pass") === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error(t("Passwords do not match!")));
                                                },
                                            })
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder={t("confirmPassword")} size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        label={t("otp")}
                                        name="otp"
                                        rules={[
                                            { required: true, message: t("otpRequired") },
                                            { pattern: /^\d{6}$/, message: t("otpPattern") }
                                        ]}
                                    >
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                            <Input
                                                prefix={<SafetyOutlined />}
                                                placeholder={t("otp")}
                                                size="large"
                                                style={{ flex: 1 }}
                                            />
                                            <Button
                                                type="primary"
                                                loading={otpLoading}
                                                onClick={handleOTPSubmit}
                                            >
                                                {t("sendOTP")}
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
                                    {t("register")}
                                </Button>
                            </Form.Item>
                        </Form>

                        <div style={{ textAlign: 'center', marginTop: 10 }}>
                            <span>{t("alreadyAccount")} </span>
                            <span
                                style={{
                                    color: '#1890ff',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    textDecoration: 'underline',
                                }}
                                onClick={() => navigate('/login')}
                            >
                                {t("loginNow")}
                            </span>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Register;
