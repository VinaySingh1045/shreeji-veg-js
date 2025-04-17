import { Button, Card, Row, Col, Dropdown, MenuProps } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const SelectLanguage = () => {
    const navigate = useNavigate();

    const setLang = (lang: string) => {
        localStorage.setItem("appLanguage", lang);
        navigate("/login");
    };

    const handleLanguageChange = (lang: string) => {
        setLang(lang);
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

            <Card style={{ maxWidth: 900, width: "100%", borderRadius: 12, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}>
                <Row gutter={[32, 16]} align="middle" justify="center">
                    <Col xs={24} md={12}>
                        <img
                            src="/01.png"
                            alt="Select Language"
                            style={{
                                width: "100%",
                                maxHeight: 300,
                                objectFit: "contain",
                                borderRadius: 8,
                            }}
                        />
                    </Col>

                    <Col xs={24} md={12}>
                        <h1 style={{ fontSize:"24px", marginBottom: 24, textAlign: "center" }}>Select Your Language</h1>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                                alignItems: "center",
                            }}
                        >
                            <Button size="large" type="primary" style={{ width: "100%" }} onClick={() => setLang("en")}>
                                English
                            </Button>
                            <Button size="large" type="primary" style={{ width: "100%" }} onClick={() => setLang("hi")}>
                                हिन्दी
                            </Button>
                            <Button size="large" type="primary" style={{ width: "100%" }} onClick={() => setLang("gu")}>
                                ગુજરાતી
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default SelectLanguage;
