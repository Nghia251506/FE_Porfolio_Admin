import axiosInstance from '../lib/axios';

const mediaService = {
  uploadFile: async (file: File, folder: string): Promise<{ url: string; secure_url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // Lưu ý: axiosInstance của ông đã trả về response.data rồi
    return axiosInstance.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default mediaService;