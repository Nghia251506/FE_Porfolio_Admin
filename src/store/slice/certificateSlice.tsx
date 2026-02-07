import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  CertificateRequest,
  CertificateResponse,
} from "../../type/certificate";
import certificateService from "../../service/certificateService";

interface CertificateState {
  items: CertificateResponse[];
  currentCertificate: CertificateResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CertificateState = {
  items: [],
  currentCertificate: null,
  isLoading: false,
  error: null,
};

export const fetchAllCertificates = createAsyncThunk(
  "certificate/fetchAll",
  async () => {
    return await certificateService.getAll();
  },
);

export const createCertificate = createAsyncThunk<
  CertificateResponse, // Dữ liệu trả về (Success Payload)
  CertificateRequest   // Dữ liệu truyền vào (Argument)
>("certificate/create", async (data: CertificateRequest) => {
  const response = await certificateService.create(data);
  return response; 
});

const certificateSlice = createSlice({
  name: "certificate",
  initialState,
  reducers: {
    clearCurrentCertificate: (state) => {
      state.currentCertificate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCertificates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchAllCertificates.fulfilled,
        (state, action: PayloadAction<CertificateResponse[]>) => {
          state.isLoading = false;
          state.items = action.payload;
        },
      )
      .addCase(createCertificate.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const {clearCurrentCertificate} = certificateSlice.actions;
export default certificateSlice.reducer;
