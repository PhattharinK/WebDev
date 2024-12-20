import React, { useState } from "react";
import { Button, Form, Input, Alert, Checkbox } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const URL_AUTH = "/api/auth/local";
axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";

export default function LoginScreen(props) {
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true);
      setErrMsg(null);
      const response = await axios.post(URL_AUTH, { ...formData });
      const token = response.data.jwt;
      axios.defaults.headers.common = { Authorization: `bearer ${token}` };
      if (rememberMe) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
      }
      axios.defaults.headers.common = { Authorization: `bearer ${token}` };
      
      props.onLoginSuccess();
      navigate("/dashboard");
    } catch (err) {
            console.log(err);
      if (err.response && err.response.data && err.response.data.error) {
        setErrMsg(err.response.data.error.message || "An error occurred");
      } else {
        setErrMsg("An error occurred during login.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Login</h2>
      <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
        {errMsg && (
          <Form.Item>
            <Alert message={errMsg} type="error" showIcon />
          </Form.Item>
        )}
        <Form.Item
          label="Username"
          name="identifier"
          rules={[{ required: true, message: "Please enter your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>
            Remember Me
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
