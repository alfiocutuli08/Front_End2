import { api } from "./api";
import type { User, UserCreate, UserLogin, UserUpdate, Skill, UserSkill, Match, Stats, Request, Feedback } from "./types";

// ── GESTIONE UTENTE LOGGATO ──

export function getUserId(): number | null {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : null;
}

export function saveUserId(id: number) {
  localStorage.setItem("user_id", String(id));
}

export function removeUserId() {
  localStorage.removeItem("user_id");
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("user_id");
}

// ── AUTH ──

export const authService = {
  register(payload: UserCreate) {
    return api.post<User>("/auth/register", payload);
  },

  login(payload: UserLogin) {
    return api.post<User>("/auth/login", payload);
  },

  me() {
    const uid = getUserId();
    return api.get<User>("/auth/me", { params: { user_id: uid } });
  },
};

// ── UTENTI ──

export const userService = {
  getProfile(userId: number) {
    return api.get<User>(`/users/${userId}`);
  },

  getPublicProfile(userId: number) {
    return api.get<User>(`/users/${userId}`);
  },

  updateProfile(userId: number, data: UserUpdate) {
    return api.put<User>(`/users/${userId}`, data);
  },
};

// ── SKILL GLOBALI ──

export const skillService = {
  list() {
    return api.get<Skill[]>("/skills");
  },

  create(name: string) {
    return api.post<Skill>("/skills", { name });
  },
};

// ── SKILL UTENTE ──

export const userSkillService = {
  getUserSkills(userId: number) {
    return api.get<UserSkill[]>(`/users/${userId}/skills`);
  },

  addSkill(userId: number, payload: { skill_id: number; category: string; level: string }) {
    return api.post<UserSkill>(`/users/${userId}/skills`, payload);
  },

  removeSkill(userId: number, usId: number) {
    return api.delete(`/users/${userId}/skills/${usId}`);
  },
};

// ── RICERCA ──

export const searchService = {
  searchUsers(query: string) {
    return api.get<Match[]>("/users/search", { params: { q: query } });
  },

  getMatches() {
    return api.get<Match[]>("/users/matches");
  },
};

// ── RICHIESTE ──

export const requestService = {
  sendRequest(toUserId: number) {
    const uid = getUserId();
    return api.post<Request>("/requests", { to_user_id: toUserId }, { params: { from_user_id: uid } });
  },

  acceptRequest(requestId: number) {
    const uid = getUserId();
    return api.put<Request>(`/requests/${requestId}/accept`, null, { params: { user_id: uid } });
  },

  declineRequest(requestId: number) {
    const uid = getUserId();
    return api.put<Request>(`/requests/${requestId}/decline`, null, { params: { user_id: uid } });
  },

  completeRequest(requestId: number) {
    const uid = getUserId();
    return api.put<Request>(`/requests/${requestId}/complete`, null, { params: { user_id: uid } });
  },

  cancelRequest(requestId: number) {
    const uid = getUserId();
    return api.delete(`/requests/${requestId}`, { params: { user_id: uid } });
  },

  getMyRequests() {
    const uid = getUserId();
    return api.get<Request[]>("/requests/mine", { params: { user_id: uid } });
  },

  getPendingRequests() {
    const uid = getUserId();
    return api.get<Request[]>("/requests/pending", { params: { user_id: uid } });
  },
};

// ── STATS ──

export const statsService = {
  getHomeStats() {
    return api.get<Stats>("/stats/home");
  },
};

// ── FEEDBACK ──

export const reportService = {
  reportUser(userId: number, reason: string) {
    const uid = getUserId();
    return api.post("/reports", { user_id: userId, reason }, { params: { from_user_id: uid } });
  },
};

export const blockService = {
  blockUser(userId: number) {
    const uid = getUserId();
    return api.post("/blocks", { blocked_user_id: userId }, { params: { user_id: uid } });
  },

  unblockUser(userId: number) {
    const uid = getUserId();
    return api.delete(`/blocks/${userId}`, { params: { user_id: uid } });
  },

  getBlockedUsers() {
    const uid = getUserId();
    return api.get<number[]>("/blocks/mine", { params: { user_id: uid } });
  },
};

export const feedbackService = {
  submitFeedback(payload: { to_user_id: number; request_id: number; rating: number; comment: string }) {
    const uid = getUserId();
    return api.post<Feedback>("/feedback", payload, { params: { from_user_id: uid } });
  },

  getUserFeedback(userId: number) {
    return api.get<Feedback[]>(`/users/${userId}/feedback`);
  },
};
