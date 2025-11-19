export interface SearchKeyword {
  id: string;
  value: string;
}

export interface UploadResponse {
  filename: string;
  message: string;
}

export interface ApiError {
  error: string;
  message?: string;
}
