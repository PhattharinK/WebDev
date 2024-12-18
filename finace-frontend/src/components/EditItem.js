import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";

const EditItem = ({ isOpen, onClose, onItemEdited, item }) => {
  const [form] = Form.useForm();

  // Set form fields with current data when Modal opens
  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue(item); // Populate form fields
    }
  }, [isOpen, item, form]);

  // Handle form submission
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const updatedItem = { ...item, ...values };
      onItemEdited(updatedItem); // Pass updated data to parent
    });
  };

  return (
    <Modal
      title="Edit Transaction"
      open={isOpen}
      onOk={handleSubmit}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="note"
          label="Note"
          rules={[{ required: true, message: "Please input the note!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: "Please input the amount!" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditItem;
