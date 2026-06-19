import axios from "axios";
import { API_ROOT } from "./base";

export type NotificationRow = {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  refType?: string | null;
  refId?: string | null;
  isRead: boolean;
  createdAt: string;
  readAt?: string | null;
};

const API = `${API_ROOT}/notifications`;

export async function fetchNotifications(userId: number): Promise<NotificationRow[]> {
  const res = await axios.get(API, { params: { userId } });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "Failed to load notifications");
  }
  return Array.isArray(res.data?.notifications)
    ? (res.data.notifications as NotificationRow[])
    : [];
}

export async function markNotificationRead(id: number): Promise<void> {
  const res = await axios.patch(`${API}/${id}/read`);
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "Failed to mark notification as read");
  }
}

export async function markAllNotificationsRead(userId: number): Promise<void> {
  const res = await axios.patch(`${API}/read-all`, { userId });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "Failed to mark all notifications as read");
  }
}

export async function deleteNotification(id: number, userId: number): Promise<void> {
  const res = await axios.delete(`${API}/${id}`, { data: { userId } });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "Failed to delete notification");
  }
}

export async function deleteReadNotifications(userId: number): Promise<void> {
  const res = await axios.delete(`${API}/history`, { data: { userId } });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "Failed to delete history notifications");
  }
}

