import React, { Component } from 'react'
import { Modal, Form, Input, Radio } from 'antd'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Dialog = props => {
  const [form] = Form.useForm();
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      props.handleOk(values);
      console.log('Success:', values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  return <div>
  <Modal
    okText="确认"
    cancelText="取消"
    title="新增"
    visible={props.visibel}
    onCancel={props.handleCancel}
    onOk={handleOk}
  >
    <Form form={form}>
    <FormItem label="姓名" rules={
      [
        {
          required: true,
          message: '请输入姓名'
        }
      ]
    } name="name">
      <Input placeholder="请输入姓名" />
    </FormItem>
    <FormItem label="年龄" name="age" rules={[
          {
            required: true,
            message: '请输入年龄'
          }
        ]}>
      <Input type="number" placeholder="请输入年龄" />
    </FormItem>
    <FormItem label="性别" name="sex">
      <RadioGroup>
          <Radio value="男">男</Radio>
          <Radio value="女">女</Radio>
        </RadioGroup>
    </FormItem>
    </Form>
  </Modal>
</div>
}
export default Dialog
