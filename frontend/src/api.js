import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: () => true,
});

client.interceptors.response.use(
  (response) => {
    
    if (response.status === 204) {
      return Promise.resolve(null);
    }
    
    const json = response.data;
    if (!json || typeof json !== "object") {
      return Promise.reject(new Error("Invalid JSON response from server"));
    }

    const httpOk = response.status >= 200 && response.status < 300;
    if (!httpOk || json.success === false) {
      const msg = json.message || "Request failed";
      return Promise.reject(new Error(msg));
    }

    return json.data;
  },
  (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(error);
  }
);


export const register = (formData) => 
  client.post("/api/v1/user/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
});

export const login = (email, password) =>
  client.post("/api/v1/user/login", { email, password });

export const logout = () => client.post("/api/v1/user/logout");

export const getCurrentUser = () => client.get("/api/v1/user/current-user");

export const refreshAccessToken = () => client.post("/api/v1/user/refresh-access-token");

export const updateAccountDetails = (data) =>
  client.patch("/api/v1/user/update-account-details", data);

export const updateUserAvatar = (formData) =>
  client.patch("/api/v1/user/update-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateUserCoverImage = (formData) =>
  client.patch("/api/v1/user/update-cover-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const changeCurrentPassword = (data) =>
  client.patch("/api/v1/user/change-password", data);

export const getUserProfile = (username) =>
  client.get(`/api/v1/user/u/${username}`);


export const createPost = (formData) =>
  client.post("/api/v1/post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAllPosts = () => client.get("/api/v1/post");

export const getUserPosts = (username) =>
  client.get(`/api/v1/post/u/${username}`);

export const updatePost = (postId, data) =>
  client.patch(`/api/v1/post/${postId}`, data);

export const deletePost = (postId) =>
  client.delete(`/api/v1/post/${postId}`);


export const togglePostLike = (postId) =>
  client.post(`/api/v1/like/${postId}`);

export const getPostLikes = (postId) =>
  client.get(`/api/v1/like/${postId}`);


export const addCommentToPost = (postId, data) =>
  client.post(`/api/v1/comment/${postId}`, data);

export const getPostComments = (postId) =>
  client.get(`/api/v1/comment/${postId}`);

export const updateComment = (commentId, data) =>
  client.patch(`/api/v1/comment/${commentId}`, data);

export const deleteComment = (commentId) =>
  client.delete(`/api/v1/comment/${commentId}`);


export const sendFriendRequest = (receiverId) =>
  client.post(`/api/v1/friendship/request/${receiverId}`);

export const getPendingRequests = () =>
  client.get("/api/v1/friendship/pending");

export const acceptFriendRequest = (requestId) =>
  client.patch(`/api/v1/friendship/accept/${requestId}`);

export const rejectFriendRequest = (requestId) =>
  client.patch(`/api/v1/friendship/reject/${requestId}`);

export const getFriendsList = () => client.get("/api/v1/friendship/list");

export const removeFriend = (friendId) =>
  client.delete(`/api/v1/friendship/remove/${friendId}`);