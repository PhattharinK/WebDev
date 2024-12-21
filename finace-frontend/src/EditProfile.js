import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = sessionStorage.getItem("auth_token");
        if (!token) {
          setErrorMessage("User is not authenticated");
          navigate("/login");
          return;
        }

        const response = await axios.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        setErrorMessage("Failed to fetch user profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleProfileUpdate = async (values) => {
    try {
      const token = sessionStorage.getItem("auth_token");
      const data = {
        username: values.username,
        email: values.email,
        oldPassword: values.oldPassword,
        password: values.password,
      };

      const response = await axios.put(
        "/api/users/me",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserProfile(response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
      setErrorMessage("Failed to update profile.");
    }
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>Edit Profile</h2>
      {errorMessage && <Alert message={errorMessage} type="error" />}
      
      {userProfile && (
        <Form
          initialValues={userProfile}
          onFinish={handleProfileUpdate}
          layout="vertical"
        >
          <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter your username!" }]}>
            <Input />
          </Form.Item>
          
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email!" }]}>
            <Input />
          </Form.Item>
          
           <Form.Item
            label="Password"
            name="oldPassword"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">Update Profile</Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default EditProfile;