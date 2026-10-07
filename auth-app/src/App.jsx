import React from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

// SỬA Ở ĐÂY: Thêm { onLoginSuccess } vào làm tham số (Props)
function App({ onLoginSuccess }) {
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
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
        
        // KIỂM TRA: Nếu đang chạy qua Host App thì gọi hàm Zustand để chuyển giao diện mượt
        if (onLoginSuccess) {
            onLoginSuccess(data.token);
        } else {
            // DỰ PHÒNG: Nếu đang tự test độc lập trên cổng 3001 thì dùng cách cũ
            localStorage.setItem('token', data.token); 
            setTimeout(() => { window.location.reload(); }, 1000);
        }
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
          Đăng Nhập MicroBoard
        </Title>
        
        <Form 
          name="login_form" 
          onFinish={onFinish} 
          layout="vertical"
          size="large"
        >
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
      </Card>
    </div>
  );
}

export default App;