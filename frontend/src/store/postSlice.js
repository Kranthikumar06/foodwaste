import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nearbyPosts: [],
  myPosts: [],
  selectedPost: null,
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setNearbyPosts: (state, action) => {
      state.nearbyPosts = action.payload;
      state.error = null;
    },
    setMyPosts: (state, action) => {
      state.myPosts = action.payload;
      state.error = null;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    addPost: (state, action) => {
      state.myPosts.unshift(action.payload);
    },
    removePost: (state, action) => {
      state.myPosts = state.myPosts.filter(post => post.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setNearbyPosts,
  setMyPosts,
  setSelectedPost,
  addPost,
  removePost,
  setLoading,
  setError,
} = postSlice.actions;
export default postSlice.reducer;
