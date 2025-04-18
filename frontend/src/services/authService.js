import { apiPublic, apiPrivate } from "../config/api";

/**
 * Register a new user
 * @param {Object} data - The signup data (name, email, phone, password, etc.)
 * @returns {Promise} Axios response
 */
export const SignupService = async (data) => {
    try {
      const response = await apiPublic.post("/auth/register", data);
      return response;
    } catch (error) {
      // Optional: Add custom logging or transformation
      throw error; // Let the caller handle the error
    }
};

/**
 * Login a user
 * @param {Object} credentials - The login credentials (email, password)
 * @returns {Promise} Axios response
 */
export const LoginService = async (credentials) => {
    try{
        const response = await apiPublic.post("/auth/login", credentials);
        return response;
    }
    catch (error) {
        // Optional: Add custom logging or transformation
        throw error; // Let the caller handle the error
    }
}

//example for apiPrivate
// export const getUserProfile = async () => {
//     try {
//         const response = await apiPrivate.get("/user/profile");
//         return response.data;
//     } catch (error) {
//         // Optional: Add custom logging or transformation
//         throw error; // Let the caller handle the error
//     }
// };
//
