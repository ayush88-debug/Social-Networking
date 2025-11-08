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

// === User API ===
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

// === Post API ===
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

// === Like API ===
export const togglePostLike = (postId) =>
  client.post(`/api/v1/like/${postId}`);

export const getPostLikes = (postId) =>
  client.get(`/api/v1/like/${postId}`);

// === Comment API ===
export const addCommentToPost = (postId, data) =>
  client.post(`/api/v1/comment/${postId}`, data);

export const getPostComments = (postId) =>
  client.get(`/api/v1/comment/${postId}`);

export const updateComment = (commentId, data) =>
  client.patch(`/api/v1/comment/${commentId}`, data);

export const deleteComment = (commentId) =>
  client.delete(`/api/v1/comment/${commentId}`);

// === Friendship API ===
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
  
// === Report API ===
export const createReport = (data) =>
  client.post("/api/v1/report", data);

// === Search API ===
export const searchAll = (query) =>
  client.get(`/api/v1/search?q=${query}`);

// === Admin API ===
export const adminLogin = (email, password) =>
  client.post("/api/v1/admin/login", { email, password });

export const adminGetAnalytics = () =>
  client.get("/api/v1/admin/analytics");

export const adminGetAllUsers = () =>
  client.get("/api/v1/admin/users");

export const adminDeleteUser = (userId) =>
  client.delete(`/api/v1/admin/users/${userId}`);

export const adminUpdateUserRole = (userId, role) =>
  client.patch(`/api/v1/admin/users/${userId}/role`, { role });

export const adminGetAllPosts = () =>
  client.get("/api/v1/admin/posts");

export const adminDeletePost = (postId) =>
  client.delete(`/api/v1/admin/posts/${postId}`);

export const adminGetAllFriendRequests = () =>
  client.get("/api/v1/admin/friendships");

export const adminManageFriendRequest = (requestId, status) =>
  client.patch(`/api/v1/admin/friendships/${requestId}`, { status });

export const adminGetReports = (status = "") =>
  client.get(`/api/v1/admin/reports?status=${status}`);

export const adminUpdateReportStatus = (reportId, status) =>
  client.patch(`/api/v1/admin/reports/${reportId}`, { status });