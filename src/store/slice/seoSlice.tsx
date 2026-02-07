import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import seoService from '../../service/seoService';
import { SeoMetadata, SeoState } from '../../type/seo';

const initialState: SeoState = {
  currentSeo: null,
  isLoading: false,
  error: null,
};

// Thunk để fetch SEO
export const fetchSeoByUrl = createAsyncThunk(
  'seo/fetchByUrl',
  async (url: string, { rejectWithValue }) => {
    try {
      const response = await seoService.getSeoByUrl(url);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải SEO');
    }
  }
);

// Thunk để lưu SEO
export const saveSeoMetadata = createAsyncThunk(
  'seo/save',
  async (data: SeoMetadata, { rejectWithValue }) => {
    try {
      const response = await seoService.saveSeo(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lưu SEO');
    }
  }
);

const seoSlice = createSlice({
  name: 'seo',
  initialState,
  reducers: {
    resetSeo: (state) => {
      state.currentSeo = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch SEO
      .addCase(fetchSeoByUrl.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSeoByUrl.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSeo = action.payload; // Nếu 204 thì payload sẽ là null/empty tùy axios config
      })
      .addCase(fetchSeoByUrl.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Save SEO
      .addCase(saveSeoMetadata.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveSeoMetadata.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSeo = action.payload;
      })
      .addCase(saveSeoMetadata.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSeo } = seoSlice.actions;
export default seoSlice.reducer;