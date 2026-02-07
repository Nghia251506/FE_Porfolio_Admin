import axios from "../lib/axios";
import {CertificateRequest,CertificateResponse} from "../type/certificate";

const certificateService = {
    getAll: (): Promise<CertificateResponse[]> => {
        return axios.get('/certificates');
    },
    create: (data: CertificateRequest): Promise<CertificateResponse> => {
        return axios.post('/certificates', data);
    }
};

export default certificateService;