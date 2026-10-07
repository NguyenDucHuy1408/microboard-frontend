import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';

const { Title } = Typography;

function App({ onLoginSuccess }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [isLogin, setIsLogin] = useState(true); // Trạng thái chuyển đổi Đăng nhập / Đăng ký

  // Hàm xử lý Đăng nhập (giữ nguyên logic cũ của bạn)
  const onLoginFinish = async (values) => {
    try {
      const response = await fetch('https://microboard-api.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          passwordHash: values.password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        messageApi.success('Đăng nhập thành công!');
        if (onLoginSuccess) {
            onLoginSuccess(data.token);
        } else {
            localStorage.setItem('token', data.token); 
            setTimeout(() => { window.location.reload(); }, 1000);
        }
      } else {
        messageApi.error('Tài khoản hoặc mật khẩu không chính xác!');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      messageApi.error('Không thể kết nối đến máy chủ Backend!');
    }
  };

  // Hàm xử lý Đăng ký mới thêm
  const onRegisterFinish = async (values) => {
    try {
      const response = await fetch('https://microboard-api.onrender.com/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: values.fullName, // Trường bắt buộc để không bị lỗi 500
          email: values.email,
          passwordHash: values.password 
        }),
      });

      if (response.ok) {
        messageApi.success('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true); // Chuyển giao diện về form Đăng nhập
      } else {
        messageApi.error('Đăng ký thất bại! Email có thể đã tồn tại.');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      messageApi.error('Không thể kết nối đến máy chủ Backend!');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      {contextHolder}
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>
          {isLogin ? 'Đăng Nhập MicroBoard' : 'Đăng Ký Tài Khoản'}
        </Title>
        
        {isLogin ? (
          /* ================= FORM ĐĂNG NHẬP ================= */
          <Form name="login_form" onFinish={onLoginFinish} layout="vertical" size="large">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập Email!' },
                { type: 'email', message: 'Email không đúng định dạng!' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập email của bạn" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>
        ) : (
          /* ================= FORM ĐĂNG KÝ ================= */
          <Form name="register_form" onFinish={onRegisterFinish} layout="vertical" size="large">
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập Họ và tên!' }]}
            >
              <Input prefix={<IdcardOutlined />} placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập Email!' },
                { type: 'email', message: 'Email không đúng định dạng!' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                Đăng Ký
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* ================= NÚT CHUYỂN ĐỔI ================= */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button type="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default App;