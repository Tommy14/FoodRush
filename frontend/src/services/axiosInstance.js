// src/services/axiosInstance.js
import axios from 'axios';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMmRlYTdmMTc0YzlhOWFlNDkyYjYiLCJyb2xlIjoiY3VzdG9tZXIiLCJlbWFpbCI6InRoaWhhbnNpZ0BnbWFpbC5jb20iLCJpYXQiOjE3NDQ5MTQyOTcsImV4cCI6MTc0NDkxNzg5N30.wJoxmRJz2zvr8vFWyYOL9I5X_qNAlgOXR7VRHuhWYrU';

const instance = axios.create({
    baseURL: 'http://localhost:5001',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default instance;
