import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchDashboardSummary } from "../../store/slice/dashboardSlice";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { BarChart3, Users, FolderOpen, Eye } from "lucide-react";
import { GA4Response } from "../../type/dashboard";

const getSafeChartData = (apiData: GA4Response[] | undefined) => {
  if (apiData && apiData.length > 0) return apiData;

  // Nếu ko có data, tạo 7 ngày gần nhất với view = 0 để chart ko bị trắng
  const mockData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    mockData.push({
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      views: 0,
    });
  }
  return mockData;
};

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useSelector(
    (state: RootState) => state.dashboard,
  );

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  const safeChartData = getSafeChartData(data?.chartData);

  // Skeleton Loading khi đang đợi data
  if (isLoading || !data) {
    return (
      <div className="p-8 text-center font-bold text-gray-500 animate-pulse">
        Đang kéo data từ vệ tinh Google...
      </div>
    );
  }

  const { stats, chartData } = data;

  // Cấu hình cho 4 card Stats trên cùng
  const statCards = [
    {
      label: "Total Projects",
      value: stats.totalProjects,
      icon: FolderOpen,
      color: "bg-blue-500",
    },
    {
      label: "Certificates",
      value: stats.totalCertificates,
      icon: BarChart3,
      color: "bg-green-500",
    },
    {
      label: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "bg-purple-500",
    },
    {
      label: "Visitors",
      value: stats.totalVisitors.toLocaleString(),
      icon: Users,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 font-medium">
          Real-time analytics from your portfolio
        </p>
      </div>

      {/* 4 CARDS STATS GIỮ NGUYÊN - FILL DATA THẬT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-[2rem] shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-black text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.color} p-3 rounded-2xl shadow-lg shadow-${stat.color.split("-")[1]}-100`}
                >
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHART TO TỔ BỐ THAY CHO RECENT ACTIVITY & QUICK ACTIONS */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">
              Traffic Analytics
            </h2>
            <p className="text-sm text-gray-400 font-medium">
              Page views in the last 7 days
            </p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl text-indigo-600 font-bold text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            LIVE DATA
          </div>
        </div>

        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={safeChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis dataKey="date" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} domain={[0, "auto"]} />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number, name: string) => [value, "Views"]}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#6366f1"
                strokeWidth={4}
                fill="url(#colorViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
