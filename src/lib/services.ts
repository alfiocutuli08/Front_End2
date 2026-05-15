import { api } from "./api";
import type { User, UserCreate, UserLogin, UserUpdate, Skill, UserSkill, Match, Stats, Request, Feedback, TokenData } from "./types";

export function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function saveToken(data: TokenData) {
  localStorage.setItem("auth_token", data.access_token);
  localStorage.setItem("user_id", String(data.user_id));
  localStorage.setItem("user_name", data.name);
}

export function removeToken() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name");
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("auth_token");
}

export function getUserId(): number | null {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : null;
}

export const authService = {
  register(payload: UserCreate) {
    return api.post<TokenData>("/auth/register", payload);
  },

  login(payload: UserLogin) {
    return api.post<TokenData>("/auth/login", payload);
  },

  me() {
    return api.get<User>("/auth/me");
  },

  updateProfile(data: UserUpdate) {
    return api.put<User>("/auth/profile", data);
  },
};

export const userService = {
  getPublicProfile(userId: number) {
    return api.get<User>(`/users/public/${userId}`);
  },

  getUserSkills(userId: number) {
    return api.get<{ offered_skills: UserSkill[]; wanted_skills: UserSkill[] }>(`/users/${userId}/skills`);
  },
};

export const skillService = {
  list() {
    return api.get<Skill[]>("/skills/");
  },

  create(name: string) {
    return api.post<Skill>("/skills/", { name, description: "" });
  },
};

export const userSkillService = {
  getMySkills() {
    return api.get<UserSkill[]>("/skills/my");
  },

  addSkill(payload: { skill_name: string; level: string; type: string }) {
    return api.post<UserSkill>("/skills/my", payload);
  },

  updateSkill(id: number, payload: { skill_name: string; level: string; type: string }) {
    return api.put<UserSkill>(`/skills/my/${id}`, payload);
  },

  removeSkill(id: number) {
    return api.delete(`/skills/my/${id}`);
  },
};

export const searchService = {
  searchUsers(query: string) {
    return api.get<Match[]>("/users/search", { params: { q: query, limit: 50 } });
  },

  getMatches() {
    return api.get<Match[]>("/users/search", { params: { limit: 50 } });
  },
};

export const requestService = {
  sendRequest(payload: { receiver_id: number; skill_id: number; message?: string; mode?: string }) {
    return api.post<Request>("/requests/", payload);
  },

  acceptRequest(requestId: number) {
    return api.patch<Request>(`/requests/${requestId}`, { action: "accept" });
  },

  declineRequest(requestId: number) {
    return api.patch<Request>(`/requests/${requestId}`, { action: "reject" });
  },

  completeRequest(requestId: number) {
    return api.patch<Request>(`/requests/${requestId}`, { action: "confirm_completion" });
  },

  cancelRequest(requestId: number) {
    return api.patch<Request>(`/requests/${requestId}`, { action: "cancel" });
  },

  getMyRequests(tab: string = "all") {
    return api.get<{ requests: Request[]; pending_count: number }>("/requests/", { params: { tab } });
  },

  getPendingRequests() {
    return api.get<{ requests: Request[]; pending_count: number }>("/requests/", { params: { tab: "received" } });
  },
};

export const statsService = {
  getHomeStats() {
    return api.get<Stats>("/users/stats");
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

export const feedbackService = {
  submitFeedback(payload: { session_request_id: number; rating: number; comment?: string }) {
    return api.post<Feedback>("/feedback/", payload);
  },

  getUserFeedback(userId: number) {
    return api.get<{ feedback: Feedback[]; average_rating: number | null; total_feedback: number }>(`/feedback/user/${userId}`);
  },
};
