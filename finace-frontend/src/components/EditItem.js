import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";

const EditItem = ({ isOpen, onClose, onItemEdited, item }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue(item);
    }
  }, [isOpen, item, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const updatedItem = { ...item, ...values };
      onItemEdited(updatedItem);
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
        <Form.Item name="type" label="ชนิด" rules={[{ required: true }]}>
          <Select
            allowClear
            style={{ width: "100px" }}
            options={[
              {
                value: "income",
                label: "รายรับ",
              },
              {
                value: "expense",
                label: "รายจ่าย",
              },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditItem;
