import { api } from "./api";

export const getFeedApi = (params) => api.get("/polls", { params });
export const getMyPollsApi = () => api.get("/polls/me/list");
export const getPollApi = (pollId) => api.get(`/polls/${pollId}`);

export const createPollApi = (payload) => api.post("/polls", payload);
export const voteApi = (pollId, payload) => api.post(`/polls/${pollId}/vote`, payload);
export const bookmarkApi = (pollId) => api.post(`/polls/${pollId}/bookmark`);
export const closePollApi = (pollId) => api.patch(`/polls/${pollId}/close`);
export const deletePollApi = (pollId) => api.delete(`/polls/${pollId}`);