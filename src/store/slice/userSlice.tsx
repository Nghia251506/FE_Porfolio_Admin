import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserResponse, LoginRequest } from '../../type/user';
import userService from '../../service/userService';

interface UserState {
  currentUser: UserResponse | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
};

// Thunk xử lý Login
export const loginAction = createAsyncThunk(
  'user/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await userService.login(data);
      return response.user; // Chỉ lấy user về store
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

// Thunk lấy thông tin user hiện tại (dùng khi refresh trang)
export const getMeAction = createAsyncThunk('user/getMe', async (_, { rejectWithValue }) => {
  try {
    return await userService.getMe();
  } catch (err: any) {
    return rejectWithValue('Phiên đăng nhập hết hạn');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      userService.logout(); // Gọi service xóa token
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Login
      .addCase(loginAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAction.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Handle GetMe
      .addCase(getMeAction.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getMeAction.rejected, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;