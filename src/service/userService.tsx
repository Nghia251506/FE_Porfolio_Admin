import axiosClient from '../lib/axios';
// Import các interface ông đã định nghĩa vào đây
import { UserRequest, UserResponse, LoginRequest, AuthResponse } from '../type/user';

const userService = {
  register: (data: UserRequest): Promise<UserResponse> => {
    return axiosClient.post('/auth/register', data);
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response: AuthResponse = await axiosClient.post('/auth/login', data);
    // Lưu token vào localStorage để interceptor phía trên sử dụng
    if (response.accessToken) {
      localStorage.setItem('access_token', response.accessToken);
    }
    return response;
  },

  getMe: (): Promise<UserResponse> => {
    return axiosClient.get('/auth/me');
  },

  logout: async (): Promise<void> => {
    await axiosClient.post('/auth/logout');
    localStorage.removeItem('access_token');
  }
};

export default userService;