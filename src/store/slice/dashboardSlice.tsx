import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { DashboardSummaryResponse } from "../../type/dashboard";
import dashboardService from "../../service/dashboardService";

interface DashboardState {
  data: DashboardSummaryResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  isLoading: false,
  error: null,
};

// Thunk để fetch toàn bộ dữ liệu Dashboard
export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getAll();
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch dashboard data");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchDashboardSummary.fulfilled,
        (state, action: PayloadAction<DashboardSummaryResponse>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;