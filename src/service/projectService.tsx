import axiosInstance from '../lib/axios';
import { ProjectRequest, ProjectResponse } from '../type/project';

const projectService = {
  // Cho khách xem (Chỉ các project đã publish)
  getAllPublished: (): Promise<ProjectResponse[]> => {
    return axiosInstance.get('/projects');
  },

  // Cho Admin quản lý (Toàn bộ project, bao gồm cả ẩn/hiện)
  getAllForAdmin: (): Promise<ProjectResponse[]> => {
    return axiosInstance.get('/projects/admin/all');
  },
  getById: (id: number): Promise<ProjectResponse> => {
    return axiosInstance.get(`/projects/admin/${id}`);
  },

  // Lấy chi tiết theo Slug (Dành cho trang chi tiết Next.js hoặc Admin xem trước)
  getBySlug: (slug: string): Promise<ProjectResponse> => {
    return axiosInstance.get(`/projects/${slug}`);
  },

  create: (data: ProjectRequest): Promise<ProjectResponse> => {
    return axiosInstance.post('/projects', data);
  },

  update: (id: number, data: ProjectRequest): Promise<ProjectResponse> => {
    return axiosInstance.put(`/projects/${id}`, data);
  },

  delete: (id: number): Promise<void> => {
    return axiosInstance.delete(`/projects/${id}`);
  }
};

export default projectService;