import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProjectResponse, ProjectRequest } from '../../type/project';
import projectService from '../../service/projectService';

interface ProjectState {
  items: ProjectResponse[];
  currentProject: ProjectResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  items: [],
  currentProject: null,
  isLoading: false,
  error: null,
};

// Action lấy danh sách (có tham số isAdmin để chọn API)
export const fetchProjectsAction = createAsyncThunk(
  'project/fetchAll',
  async (isAdmin: boolean = false, { rejectWithValue }) => {
    try {
      if (isAdmin) return await projectService.getAllForAdmin();
      return await projectService.getAllPublished();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Không thể tải danh sách dự án');
    }
  }
);

// Action lấy chi tiết theo slug
export const fetchProjectDetailAction = createAsyncThunk(
  'project/fetchDetail',
  async (id: number) => {
    return await projectService.getById(id);
  }
);

export const createProjectAction = createAsyncThunk(
  'project/create',
  async (data: ProjectRequest) => {
    return await projectService.create(data);
  }
);

export const updateProjectAction = createAsyncThunk(
  'project/update',
  async ({ id, data }: { id: number; data: ProjectRequest }) => {
    return await projectService.update(id, data);
  }
);

export const deleteProjectAction = createAsyncThunk(
  'project/delete',
  async (id: number) => {
    await projectService.delete(id);
    return id;
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchProjectsAction.pending, (state) => { state.isLoading = true; })
      .addCase(fetchProjectsAction.fulfilled, (state, action: PayloadAction<ProjectResponse[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      // Fetch Detail
      .addCase(fetchProjectDetailAction.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })
      // Create
      .addCase(createProjectAction.fulfilled, (state, action) => {
        state.items.unshift(action.payload); // Đưa project mới lên đầu list
      })
      // Update
      .addCase(updateProjectAction.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      // Delete
      .addCase(deleteProjectAction.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;