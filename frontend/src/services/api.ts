import axios, { AxiosInstance } from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

const apiClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UploadPayload {
  keywords: string[];
}

export interface SearchOEResponse {
  oeNumber: string;
  yvCodes: string[];
  found: boolean;
}

export const uploadFile = async (file: File, keywords: string[]) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('keywords', keywords.join(','));

  return apiClient.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const searchOE = async (oeNumber: string): Promise<string[]> => {
  const response = await apiClient.post<SearchOEResponse>('/api/search-oe', {
    oeNumber,
  });

  return response.data.yvCodes;
};

export const downloadFile = (filename: string) => {
  return `${apiUrl}/api/download/${encodeURIComponent(filename)}`;
};

export default apiClient;
