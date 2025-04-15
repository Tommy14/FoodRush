// src/services/axiosInstance.js
import axios from 'axios';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZkMDM1M2NkNzU3NWViYTRmMjQyMDYiLCJyb2xlIjoiZGVsaXZlcnlfcGVyc29uIiwiZW1haWwiOiJkZWxpdmVyeUBnbWFpbC5jb20iLCJpYXQiOjE3NDQ3Mzk5NDcsImV4cCI6MTc0NDc0MzU0N30.RVpt4qbdZaDtx7AQpScN_TIbe-7mYzyua2rrKaRU-fY';

const instance = axios.create({
    baseURL: 'http://localhost:5001',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default instance;
