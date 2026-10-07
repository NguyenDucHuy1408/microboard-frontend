import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  // Bắt lỗi trước khi nó làm sập giao diện
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Ghi nhận chi tiết lỗi vào log
  componentDidCatch(error, errorInfo) {
    console.error("Lỗi từ Micro-app bị bắt bởi Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Giao diện sẽ hiển thị thay thế cho module bị hỏng
      return (
        <Result
          status="500"
          title="Opps! Module này đang gặp sự cố."
          subTitle="Xin lỗi, phân hệ này đã bị lỗi code và không thể hiển thị. Thanh điều hướng và các tính năng khác của hệ thống vẫn hoạt động bình thường."
          extra={<Button type="primary" onClick={() => window.location.reload()}>Tải lại hệ thống</Button>}
        />
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;