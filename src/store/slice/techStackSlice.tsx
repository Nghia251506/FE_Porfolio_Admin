import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TechStackResponse, TechStackRequest } from '../../type/techstack';
import techStackService from '../../service/techStackService';

interface TechStackState {
  items: TechStackResponse[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TechStackState = {
  items: [],
  isLoading: false,
  error: null,
};

// Async Thunk: Lấy danh sách
export const fetchTechStacksAction = createAsyncThunk(
  'techStack/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await techStackService.getAll();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Không thể tải danh sách công nghệ');
    }
  }
);

// Async Thunk: Tạo mới
export const createTechStackAction = createAsyncThunk(
  'techStack/create',
  async (data: TechStackRequest, { rejectWithValue }) => {
    try {
      return await techStackService.create(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Tạo mới thất bại');
    }
  }
);

// Async Thunk: Xóa
export const deleteTechStackAction = createAsyncThunk(
  'techStack/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await techStackService.delete(id);
      return id; // Trả về ID để xóa khỏi state local
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Xóa thất bại');
    }
  }
);

const techStackSlice = createSlice({
  name: 'techStack',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchTechStacksAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTechStacksAction.fulfilled, (state, action: PayloadAction<TechStackResponse[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTechStacksAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createTechStackAction.fulfilled, (state, action: PayloadAction<TechStackResponse>) => {
        state.items.push(action.payload); // Cập nhật danh sách ngay lập tức
      })
      // Delete
      .addCase(deleteTechStackAction.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default techStackSlice.reducer;