import { create } from 'zustand';

export const useStore = create((set) => ({
  // Khởi tạo state bằng cách đọc token từ localStorage (nếu có sẵn từ phiên trước)
  token: localStorage.getItem('token') || null,

  // Hàm đăng nhập: Vừa ghi vào localStorage, vừa cập nhật state để React tự động render lại
  setToken: (newToken) => {
    localStorage.setItem('token', newToken);
    set({ token: newToken });
  },

  // Hàm đăng xuất: Xóa khóa khỏi bộ nhớ và reset state
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null });
  }
}));