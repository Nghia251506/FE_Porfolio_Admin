// 1. Dữ liệu chi tiết cho từng ngày trên biểu đồ
export interface GA4Response {
    date: string;   // Định dạng: "07/02" (Đã được BE format) hoặc "20260207"
    views: number;  // Số lượt xem
}

// 2. Dữ liệu cho các thẻ thống kê (Stats Cards)
export interface DashboardStatsResponse {
    totalProjects: number;
    totalCertificates: number;
    totalViews: number;
    totalVisitors: number;
}

// 3. Payload tổng hợp trả về từ API /api/dashboard/summary
export interface DashboardSummaryResponse {
    stats: DashboardStatsResponse;
    chartData: GA4Response[];
}