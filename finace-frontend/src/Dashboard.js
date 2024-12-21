import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";

const UserDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("Profile updated successfully!");
      console.log("Updated values:", values);
    } catch (error) {
      message.error("Failed to update profile.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    message.info("You have been logged out.");
    console.log("User logged out.");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <Typography.Title level={3} style={{ textAlign: "center" }}>
        User Dashboard
      </Typography.Title>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleFormSubmit}
        initialValues={{
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        }}
      >

        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please enter your first name" }]}
        >
          <Input placeholder="Enter your first name" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please enter your last name" }]}
        >
          <Input placeholder="Enter your last name" />
        </Form.Item>
        
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your password" },
            { min: 6, message: "Password must be at least 6 characters long" },
          ]}
        >
          <Input.Password placeholder="Enter a new password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Update Profile
          </Button>
        </Form.Item>
      </Form>

      <Button type="danger" onClick={handleLogout} block>
        Logout
      </Button>
    </div>
  );
};

export default UserDashboard;