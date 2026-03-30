import axiosInstance from './axiosInstance';

// Create a new food post (Donor only)
export const createFoodPost = async (foodPostData) => {
  try {
    const response = await axiosInstance.post('/donor/posts', foodPostData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create food post' };
  }
};

// Get all posts for logged-in donor
export const getDonorPosts = async () => {
  try {
    const response = await axiosInstance.get('/donor/posts');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch posts' };
  }
};

// Delete a food post (Donor only)
export const deleteFoodPost = async (postId) => {
  try {
    const response = await axiosInstance.delete(`/donor/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete post' };
  }
};

// Get available (LIVE) food posts - Public
export const getAvailablePosts = async () => {
  try {
    const response = await axiosInstance.get('/food-posts/available');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch available posts' };
  }
};

// Get nearby posts
export const getNearbyPosts = async (lat, lng, radius = 5.0) => {
  try {
    const response = await axiosInstance.get('/posts/nearby', {
      params: { lat, lng, radius }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch nearby posts' };
  }
};

// Get single post by ID
export const getSinglePost = async (postId) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch post' };
  }
};
