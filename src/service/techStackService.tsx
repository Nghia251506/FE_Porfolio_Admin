import axiosClient from '../lib/axios';
import { TechStackRequest, TechStackResponse } from '../type/techstack';

const techStackService = {
  // Lấy toàn bộ danh sách công nghệ
  getAll: (): Promise<TechStackResponse[]> => {
    return axiosClient.get('/tech-stacks');
  },

  // Tạo mới một công nghệ
  create: (data: TechStackRequest): Promise<TechStackResponse> => {
    return axiosClient.post('/tech-stacks', data);
  },

  // Xóa công nghệ theo ID
  delete: (id: number): Promise<void> => {
    return axiosClient.delete(`/tech-stacks/${id}`);
  }
};

export default techStackService;