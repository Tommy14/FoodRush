import dotenv from 'dotenv';
dotenv.config();

export const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;
export const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL;
export const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL;
export const SYSTEM_JWT = process.env.SYSTEM_JWT;
export const INTERNAL_SERVICE_API_KEY = process.env.INTERNAL_SERVICE_API_KEY;
export const USER_SERVICE_URL = process.env.USER_SERVICE_URL;