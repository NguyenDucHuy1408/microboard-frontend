import React, { lazy, Suspense } from 'react';
import { Layout, Typography, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useStore } from './store'; // Nạp kho chứa Zustand vừa tạo
import ErrorBoundary from './ErrorBoundary';

const AuthModule = lazy(() => import('authApp/Auth'));
const BoardModule = lazy(() => import('boardApp/Board'));

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  // Lấy state và action trực tiếp từ Zustand
  const { token, setToken, logout } = useStore();
  
  // Dựa vào việc có token hay không để xác định trạng thái đăng nhập
  const isLoggedIn = !!token; 

  return (
    <Layout style={{ minHeight: '100vh' }}>
      
      {isLoggedIn && (
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#001529', padding: '0 20px' }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            🚀 MicroBoard Workspace
          </Title>
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={logout}>
            Đăng Xuất
          </Button>
        </Header>
      )}

      <Content style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
        <ErrorBoundary>
          <Suspense fallback={<div style={{textAlign: 'center', marginTop: '50px'}}>Đang tải dữ liệu module...</div>}>
            {!isLoggedIn ? (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Title level={2}>Khung Giao Diện Chính (Host App)</Title>
                <p>Vui lòng đăng nhập để truy cập hệ thống</p>
                <AuthModule onLoginSuccess={(newToken) => setToken(newToken)} /> 
              </div>
            ) : (
              <BoardModule />
            )}
          </Suspense>
        </ErrorBoundary>
      </Content>

    </Layout>
  );
}

export default App;