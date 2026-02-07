export interface CertificateRequest{
    name: string;
    organization: string;
    issueDate: string;
    expirationDate: string;
    credentialUrl: string;
    imageUrl:string;
}

export interface CertificateResponse{
    id: number;
    name: string;
    organization: string;
    issueDate: string;
    expirationDate: string;
    credentialUrl: string;
    imageUrl:string;
}