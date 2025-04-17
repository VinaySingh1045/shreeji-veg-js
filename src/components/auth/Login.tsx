import { Button, Card, Checkbox, Form, Input, message, Row, Col, Dropdown, MenuProps } from "antd";
import { UserOutlined, LockOutlined, GlobalOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginApi } from "../../services/authAPI";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { setUser } from "../../redux/slice/authSlice";
import { ILogin } from "../../types/ILogin";
import { useTranslation } from "react-i18next";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();

  interface APIError {
    response?: {
      data?: {
        message?: string;
      };
    };
  }

  useEffect(() => {
    const lang = localStorage.getItem("appLanguage") || "en";
    i18n.changeLanguage(lang);
  }, [i18n]);

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

  const handleSubmit = async (values: ILogin) => {

    setLoading(true);
    try {
      const response = await LoginApi(values);
      message.success(t("loginSuccess"));
      Cookies.set("Shreeji_Veg", response.data.token, { expires: 15 });
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
        message.error(t("unexpectedError"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("appLanguage", lang);
  };

  const languageMenu: MenuProps = {
    onClick: (e) => handleLanguageChange(e.key),
    items: [
      { key: "en", label: "English" },
      { key: "hi", label: "हिन्दी" },
      { key: "gu", label: "ગુજરાતી" },
    ],
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
        position: "relative",
      }}
    >
      {/* Language Dropdown in Top Right */}
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <Dropdown menu={languageMenu} placement="bottomRight" trigger={["click"]}>
          <Button icon={<GlobalOutlined />} />
        </Dropdown>
      </div>

      <Card style={{ maxWidth: 900, width: "100%" }}>
        <Row gutter={[32, 16]} align="middle" justify="center">
          <Col xs={24} md={12}>
            <img
              src="/01.png"
              alt="Login Visual"
              style={{
                width: "100%",
                maxHeight: 300,
                objectFit: "contain",
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
                label={t("userName")}
                name="Ac_Name"
                rules={[{ required: true, message: t("enterUsername") }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder={t("usernamePlaceholder")}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label={t("password")}
                name="Book_Pass"
                rules={[{ required: true, message: t("enterPassword") }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder={t("passwordPlaceholder")}
                  size="large"
                />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>{t("rememberMe")}</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  size="large"
                  loading={loading}
                >
                  {t("login")}
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: "center", marginTop: 10 }}>
              <span>{t("noAccount")} </span>
              <span
                style={{
                  color: "#1890ff",
                  cursor: "pointer",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/register")}
              >
                {t("registerNow")}
              </span>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Login;
