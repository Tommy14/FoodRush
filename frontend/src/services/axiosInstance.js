// src/services/axiosInstance.js
import axios from 'axios';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlYTJkZTY5MzMzMWQwNWExNDQzN2QiLCJyb2xlIjoiZGVsaXZlcnlfcGVyc29uIiwiZW1haWwiOiJkZWxpdmVyeUBnbWFpbC5jb20iLCJpYXQiOjE3NDQ3NDQ4MzIsImV4cCI6MTc0NDc0ODQzMn0.kYxLhINDxVTGkgcbn0F7Pthoh9rl5_tS0oGLLWUJPlE';

const instance = axios.create({
    baseURL: 'http://localhost:5001',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default instance;
