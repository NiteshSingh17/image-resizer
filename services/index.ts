'use client';

import { ApiErrorResponse, create } from "apisauce";
export const apiClient = create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

export const API_URIS = {
  resizeImage: '/resize',
}

export type AxiosError = ApiErrorResponse<null>['originalError'];
