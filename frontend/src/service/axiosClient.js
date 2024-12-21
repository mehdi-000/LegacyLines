// This module exports an Axios client instance configured with a base URL, timeout, and headers
// It also includes functions to retrieve authentication tokens and log out

import { createAxiosClient } from "./createAxiosClient";

// Obtain the base URL from environment variables
let BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Retrieve the authentication token from local storage
function getToken() {
  const token = localStorage.getItem("token");
  return token;
}

// Log out by clearing the authentication token and reloading the window
async function logout(){
  localStorage.removeItem("token");
  window.location.reload();
}

// Create the Axios client instance with configured options
export const client = createAxiosClient({
  options: {
    baseURL: BASE_URL,
    timeout: 300000,
    headers: {
      'Content-Type': 'application/json',
    }
  },
  getToken,
  logout
})
