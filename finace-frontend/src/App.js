import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Layout, Menu, Button, Modal } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import LoginScreen from "./LoginScreen";
import FinanceScreen from "./FinanceScreen";
import EditProfile from "./EditProfile";
import "./App.css";
import { HomeOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    const expirationTime = sessionStorage.getItem("auth_token_expiration");

    if (token && expirationTime) {
      const currentTime = new Date().getTime();

      if (currentTime < expirationTime) {
        axios.defaults.headers.common = { Authorization: `bearer ${token}` };
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token_expiration");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Are you sure you want to logout?",
      content: "You will be logged out and returned to the login screen.",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token_expiration");
        axios.defaults.headers.common = {};
        setIsAuthenticated(false);
      },
      onCancel: () => {

      }
    });
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Layout>
          <Header>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
              <Menu.Item key="1" icon={<HomeOutlined />}>
                <Link to="/finance">Home</Link>{" "}
              </Menu.Item>{" "}
              <Menu.Item key="2" icon={<SettingOutlined />}>
                <Link to="/settings">Settings</Link>{" "}
              </Menu.Item>
              <Menu.Item key="3" icon={<LogoutOutlined style={{ color:"9e1111" }}/>}>
                <Button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#9e1111",
                    padding: 0,
                    fontSize: "16px",
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Menu.Item>
            </Menu>
          </Header>
          <Layout>
            <Content style={{ padding: "20px" }}>
              <Routes>
                <Route
                  path="/"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/finance" />
                    ) : (
                      <LoginScreen onLoginSuccess={handleLoginSuccess} />
                    )
                  }
                />
                <Route
                  path="/finance"
                  element={
                    isAuthenticated ? <FinanceScreen /> : <Navigate to="/" />
                  }
                />
                <Route
                  path="/settings"
                  element={
                    isAuthenticated ? <EditProfile /> : <Navigate to="/" />
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </div>
    </BrowserRouter>
  );
}

export default App;
