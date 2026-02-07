import axiosClient from '../lib/axios'; // Hoặc đường dẫn tới file axios của ông
import { SeoMetadata } from '../type/seo';

const seoService = {
  // Lấy SEO theo URL
  getSeoByUrl: (url: string): Promise<SeoMetadata> => {
    return axiosClient.get(`/seo?url=${url}`);
  },

  // Lưu hoặc cập nhật SEO (Upsert)
  saveSeo: (data: SeoMetadata): Promise<SeoMetadata> => {
    return axiosClient.post('/seo', data);
  }
};

export default seoService;