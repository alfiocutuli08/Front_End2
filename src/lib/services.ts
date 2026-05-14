import { api } from "./api";
import type { Token, User, UserCreate, UserLogin, UserProfile, Match, Stats, Request } from "./types";

export const authService = {
  register(payload: UserCreate) {
    return api.post<Token>("/auth/register", payload);
  },

  login(payload: UserLogin) {
    return api.post<Token>("/auth/login", payload);
  },

  me() {
    return api.get<User>("/auth/me");
  },

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  },

  saveToken(token: string) {
    localStorage.setItem("auth_token", token);
  },

  removeToken() {
    localStorage.removeItem("auth_token");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  },
};

export const userService = {
  getProfile(userId: number) {
    return api.get<UserProfile>(`/users/${userId}`);
  },

  getPublicProfile(userId: number) {
    return api.get<UserProfile>(`/users/${userId}/public`);
  },

  updateProfile(data: Partial<UserProfile>) {
    return api.put<UserProfile>("/users/me", data);
  },
};

export const searchService = {
  searchUsers(query: string) {
    return api.get<Match[]>("/users/search", { params: { q: query } });
  },

  getMatches() {
    return api.get<Match[]>("/users/matches");
  },
};

export const requestService = {
  sendRequest(toUserId: number) {
    return api.post<Request>("/requests", { to_user_id: toUserId });
  },

  acceptRequest(requestId: number) {
    return api.put<Request>(`/requests/${requestId}/accept`);
  },

  declineRequest(requestId: number) {
    return api.put<Request>(`/requests/${requestId}/decline`);
  },

  cancelRequest(requestId: number) {
    return api.delete(`/requests/${requestId}`);
  },

  getMyRequests() {
    return api.get<Request[]>("/requests/mine");
  },

  getPendingRequests() {
    return api.get<Request[]>("/requests/pending");
  },
};

export const statsService = {
  getHomeStats() {
    return api.get<Stats>("/stats/home");
  },
};

export const reportService = {
  reportUser(userId: number, reason: string) {
    return api.post("/reports", { user_id: userId, reason });
  },
};

export const blockService = {
  blockUser(userId: number) {
    return api.post("/blocks", { blocked_user_id: userId });
  },

  unblockUser(userId: number) {
    return api.delete(`/blocks/${userId}`);
  },

  getBlockedUsers() {
    return api.get<number[]>("/blocks/mine");
  },
};
