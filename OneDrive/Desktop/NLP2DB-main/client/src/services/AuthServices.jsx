import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://nlp2db.onrender.com/api/auth";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  //console.log(user);
  return user && user.token ? { "x-auth-token": user.token } : {};
};
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const verifyToken = async () => {
  const headers = getAuthHeader();
  console.log(headers);
  if (!headers["x-auth-token"]) {
    return null;
  }

  const response = await axios.get(`${API_URL}/verifyToken`, { headers });
  return response.data;
};

// export const verifyOtp = async (otpData) => {
//   const response = await axios.post(`${API_URL}/verifyOTP`, otpData);
//   return response.data;
// };

// export const sendOtp = async (otpData) => {
//   const response = await axios.post(`${API_URL}/sendOTP`, otpData);
//   return response.data;
// };

export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);

  if (response.data.token) {
    const user = {
      token: response.data.token,
      userInfo: response.data.user,
    };
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } else {
    throw new Error("Login failed");
  }
};

export const logout = (navigate) => {
  localStorage.removeItem("user");
  navigate("/");
};
