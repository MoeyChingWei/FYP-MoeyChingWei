import axios from "axios";
import { API_ROOT } from "./base";

export type FeedbackType = "ISSUE" | "IMPROVEMENT" | "COMMENT";

export type FeedbackRow = {
  id: number;
  userId: number;
  type: FeedbackType;
  description: string;
  status: string;
  adminComment?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string | null;
    email: string;
    role: string;
  };
};

const API = `${API_ROOT}/feedback`;

export async function fetchFeedbacks(): Promise<FeedbackRow[]> {
  const res = await axios.get(API);
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "Failed to load feedback");
  }
  return Array.isArray(res.data?.feedbacks) ? (res.data.feedbacks as FeedbackRow[]) : [];
}

export async function submitFeedback(input: {
  userId: number;
  type: FeedbackType;
  description: string;
}): Promise<FeedbackRow> {
  const res = await axios.post(API, input);
  if (!res.data?.success || !res.data?.feedback) {
    throw new Error(res.data?.message ?? "Failed to submit feedback");
  }
  return res.data.feedback as FeedbackRow;
}

