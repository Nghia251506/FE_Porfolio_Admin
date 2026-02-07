import axios from "../lib/axios"
import {DashboardSummaryResponse} from "../type/dashboard"

const dashboardService = {
    getAll: (): Promise<DashboardSummaryResponse> => {
        return axios.get('/dashboard/summary')
    }
};

export default dashboardService;