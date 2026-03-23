import axiosInstance from './axiosInstance';

export const getVolunteerDashboard = async () => {
    return axiosInstance.get('/volunteer/dashboard');
};

export const updateVolunteerStatus = async (isOnline) => {
    return axiosInstance.put(`/volunteer/status?online=${isOnline}`);
};

export const getFoodPosts = async () => {
    // Should be in foodPostApi, but for now we put it here
    return axiosInstance.get('/food-posts/available');
};

export const claimFoodPost = async (postId) => {
    return axiosInstance.post(`/volunteer/claims/${postId}`);
};

export const confirmDelivery = async (deliveryData) => {
    return axiosInstance.put('/volunteer/claims/deliver', deliveryData);
};
