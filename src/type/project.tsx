import { TechStackResponse } from "./techstack";

// Định nghĩa enum cho MediaType
export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

// 1. Media Request (Dùng khi gửi dữ liệu lên BE)
export interface ProjectMediaRequest {
  mediaUrl: string;
  mediaType: MediaType;
  thumbnail: boolean; 
}

// 2. Media Response (Dùng khi nhận dữ liệu từ BE)
export interface ProjectMediaResponse {
  id: number;
  mediaUrl: string;
  mediaType: MediaType;
  thumbnail: boolean;
}

// 3. Project Request (Dùng cho Form Thêm/Sửa)
export interface ProjectRequest {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  thumbnail: string;
  githubUrl?: string;
  demoUrl?: string;
  published: boolean;
  sortOrder: number;
  techStackIds: number[]; // Mảng ID để map ở BE
  mediaList: ProjectMediaRequest[]; // Danh sách media gửi đi
}

// 4. Project Response (Dùng để hiển thị danh sách/chi tiết)
export interface ProjectResponse {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  thumbnail: string;
  githubUrl: string;
  demoUrl: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  techStacks: TechStackResponse[]; // Đây là mảng TechStackResponse ông đã viết
  mediaList: ProjectMediaResponse[];
}