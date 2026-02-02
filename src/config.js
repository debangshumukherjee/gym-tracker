// src/config.js
export const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://your-backend-app-name.onrender.com" // You will get this URL later from Render
  : "http://localhost:5000";