import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mediaService from '../../service/mediaService';

interface MediaState {
  isUploading: boolean;
  lastUploadedUrl: string | null;
  error: string | null;
}

const initialState: MediaState = {
  isUploading: false,
  lastUploadedUrl: null,
  error: null,
};

export const uploadFileAction = createAsyncThunk(
  'media/upload',
  async ({ file, folder }: { file: File; folder: string }, { rejectWithValue }) => {
    try {
      const response = await mediaService.uploadFile(file, folder);
      return response.secure_url; // Trả về link ảnh từ Cloudinary
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Upload thất bại');
    }
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    clearMediaState: (state) => {
      state.lastUploadedUrl = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFileAction.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadFileAction.fulfilled, (state, action) => {
        state.isUploading = false;
        state.lastUploadedUrl = action.payload;
      })
      .addCase(uploadFileAction.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMediaState } = mediaSlice.actions;
export default mediaSlice.reducer;