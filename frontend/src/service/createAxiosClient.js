//This module exports a function for creating an Axios client instance with interceptors for request and response handling

import axios from "axios";

let failedQueue = [];

export function createAxiosClient({ options, getToken, logout }) {
  const client = axios.create(options);

  client.interceptors.request.use(
    (config) => {
      if (config.authorization !== false) {
        const token = getToken();
        if (token) {
          config.headers.Authorization = token;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const originalRequest = error.config;
      originalRequest.headers = JSON.parse(
        JSON.stringify(originalRequest.headers || {})
      );
      return Promise.reject(error);
    }
  );

  return client;
}
