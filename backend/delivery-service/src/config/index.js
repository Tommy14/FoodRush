import dotenv from 'dotenv';

dotenv.config();

export const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL;
export const INTERNAL_SERVICE_API_KEY = process.env.INTERNAL_SERVICE_API_KEY;
export const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;
export const SYSTEM_JWT = process.env.SYSTEM_JWT;
export const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
export const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL;
export const LOCATION_SERVICE_URL = process.env.LOCATION_SERVICE_URL;
