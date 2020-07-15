import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd'
import { verifyLogin, loading } from '../../actions/rootActions'
import styles from './login.module.less'
import { connect } from 'react-redux'
const FormItem = Form.Item

const NormalLoginForm = (props) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({
      remember: true,
      userName: 'doudou'
    });
  }, [form]);
  const handleSubmit = (values) => {
    console.log('Success:', values);
    if (values.userName !== 'doudou' || values.passWrod !== 'doudou') {
      message.error('密码不正确');
      return false
    }
    props.dispatch(loading(true))
    props.dispatch(
      verifyLogin({
        isLogin: true,
        user: values
      })
    )
    setTimeout(() => {
      props.history.push('/admin/home')
    }, 2000)
  }

  return (
    <div className={styles.login}>
        <div className={styles['login-warp']}>
          <Form className={styles['login-form']} form={form} initialValues={{ remember: true }}
      onFinish={handleSubmit}>
            <FormItem 
            hasFeedback
            name="userName" rules={[{ required: true, message: '请输入您的账号' }]}
            >
              <Input
                  // prefix={
                  //   <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  // }
                  placeholder="请输入您的账号"
                />
            </FormItem>
            <FormItem
            hasFeedback
            name="passWrod"
            rules={[{ required: true, message: '请输入您的密码' }]}
            ><Input
            // prefix={
            //   <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
            // }
            type="password"
            placeholder="请输入您的密码"
          />
            </FormItem>
            <FormItem name="remember">
            <Checkbox>记住密码</Checkbox>
              <a className={styles['login-form-forgot']} href="">
                忘记密码
              </a>
              <Button
                type="primary"
                htmlType="submit"
                className={styles['login-form-button']}
              >
                登录
              </Button>
              <div className={styles.user}>
                Username: doudou
                <span>
                  Password: doudou
                </span>
              </div>
            </FormItem>
          </Form>
        </div>
      </div>
  );
};

export default connect()(NormalLoginForm)
