import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';

const { Title } = Typography;

function App({ onLoginSuccess }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [isLogin, setIsLogin] = useState(true); 

  // ĐÃ SỬA CHỮA: Đưa biến trạng thái vào bên trong Component
  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // HÀM XỬ LÝ ĐĂNG NHẬP
  // ==========================================
  const onLoginFinish = async (values) => {
    setIsLoading(true); // Bật loading
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
        localStorage.setItem('token', data.token);
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
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  // ==========================================
  // HÀM XỬ LÝ ĐĂNG KÝ
  // ==========================================
  const onRegisterFinish = async (values) => {
    setIsLoading(true); // Bật loading cả cho Đăng ký
    try {
      const response = await fetch('https://microboard-api.onrender.com/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: values.fullName, 
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
    } finally {
      setIsLoading(false); // Tắt loading
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
              <Button type="primary" htmlType="submit" block loading={isLoading}>
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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
              {/* ĐÃ SỬA CHỮA: Thêm thuộc tính loading vào nút Đăng ký */}
              <Button type="primary" htmlType="submit" block loading={isLoading} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* ================= NÚT CHUYỂN ĐỔI ================= */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button type="link" onClick={() => setIsLogin(!isLogin)} disabled={isLoading}>
            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default App;