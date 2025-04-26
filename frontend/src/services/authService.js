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


/**
 * Get all users pending activation
 * @returns {Promise} Axios response
 */
export const getPendingActivations = async () => {
  try {
    console.log('Making API call to fetch pending activations');
    const response = await apiPrivate.get("/auth/pending-activations");
    console.log('Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getPendingActivations:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Activate a user account
 * @param {string} userId - The ID of the user to activate
 * @returns {Promise} Axios response
 */
export const activateUser = async (userId) => {
  try {
    const response = await apiPrivate.post(
      "/auth/activate-user", { 
      userId, 
      activate: true 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


/**
 * Get all users (for admin management)
 * @returns {Promise} Axios response
 */
export const getAllUsers = async () => {
  try {
    console.log('Making API call to fetch all users');
    const response = await apiPrivate.get("/auth/all-users");
    console.log('Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getAllUsers:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Deactivate a user account
 * @param {string} userId - The ID of the user to deactivate
 * @returns {Promise} Axios response
 */
export const deactivateUser = async (userId) => {
  try {
    const response = await apiPrivate.post("/auth/activate-user", { 
      userId, 
      activate: false 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject a user account
 * @param {string} userId - The ID of the user to reject
 * @param {string} reason - Reason for rejection
 * @returns {Promise} Axios response
 */
export const rejectUser = async (userId, reason) => {
  try {
    const response = await apiPrivate.post("/auth/reject-user", { 
      userId, 
      reason 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


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
