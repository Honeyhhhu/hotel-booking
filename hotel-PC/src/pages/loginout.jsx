// src/pages/Login/Login.jsx
import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Space, Spin } from 'antd';
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import './Login.css';
import { Outlet, Link, useNavigate } from 'react-router-dom';
const Loginout = () => {
     const navigate = useNavigate();
  // 表单实例（用于重置/校验）
  const [form] = Form.useForm();
  // 登录加载状态
  const [loading, setLoading] = useState(false);

  // 模拟登录接口请求
  const mockLoginApi = async (values) => {
    // 模拟接口延迟
    return new Promise((resolve, reject) => {
      setTimeout(() => {
      resolve({ success: true });
      }, 1000);
    });
  };

  // 表单提交处理
  const handleLogin = async (values) => {
    try {
      setLoading(true);
      // 调用模拟登录接口
      await mockLoginApi(values);
      // 登录成功提示
      message.success('注册成功！返回登录...');
      // 实际项目中：跳转到首页/后台
     navigate('/');
      console.log('登录成功，用户信息：', values);
    } catch (error) {
      // 登录失败提示
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* 登录卡片 */}
      <Card className="login-card" title="账号注册" bordered={true}>
        <Form
          form={form}
          name="login_form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          autoComplete="off"
        >
          {/* 账号输入框 */}
          <Form.Item
            name="username"
            label="账号"
            rules={[
              { required: true, message: '请输入账号！' },
              { min: 3, message: '账号长度不能少于3位！' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="请输入账号（测试账号：admin）"
              size="large"
            />
          </Form.Item>

          {/* 密码输入框 */}
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 6, message: '密码长度不能少于6位！' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="请输入密码（测试密码：123456）"
              size="large"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          {/* 登录按钮 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              <Spin spinning={loading} size="small" />
              注册
            </Button>
          </Form.Item>

          {/* 额外操作区（可选） */}
          <Space className="login-extra" size="middle">
            {/* <a href="#/forget-password" className="login-link">忘记密码？</a> */}
            <a href="/" className="login-link">返回登录</a>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default Loginout;