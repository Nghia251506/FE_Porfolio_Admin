export interface TechStackRequest{
    name: string;
    iconUrl: string;
    proficiency: string;
    category: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'TOOL' | 'OTHERS';
}

export interface TechStackResponse {
    id: number;
    name: string;
    iconUrl: string;
    proficiency: string;
    category: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'TOOL' | 'OTHERS';
}