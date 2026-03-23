import axiosInstance from './axiosInstance';

export const loginUser = async (credentials) => {
    // Use real backend call instead of mock
    return axiosInstance.post('/auth/login', credentials);
};

export const registerUser = async (userData) => {
    // Current formData uses correct field names, but we add hardcoded coordinates for now
    const requestBody = {
        ...userData,
        latitude: 17.3850,
        longitude: 78.4867
    };

    return axiosInstance.post('/auth/register', requestBody);
};
