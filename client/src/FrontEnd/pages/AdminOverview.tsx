import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Empty, Spin, Table, Tag, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";

import { getSessionUser } from "../shared/auth/session";
import {
  fetchFeedbacks,
  type FeedbackRow,
} from "../shared/api/feedback";
import {
  fetchNotifications,
  markNotificationRead,
  type NotificationRow,
} from "../shared/api/notifications";
import UserGuideModal from "../components/UserGuide/UserGuideModal";
import styles from "./AdminOverview.module.css";

const { Text, Title } = Typography;

type UnreadFeedback = {
  feedback: FeedbackRow;
  notification: NotificationRow;
};

export default function AdminOverview(): React.ReactElement {
  const navigate = useNavigate();
  const sessionUser = useMemo(() => getSessionUser(), []);
  const [items, setItems] = useState<UnreadFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [userGuideVisible, setUserGuideVisible] = useState(false);

  const load = useCallback(async () => {
    if (!sessionUser?.id) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [notifications, feedbacks] = await Promise.all([
        fetchNotifications(sessionUser.id),
        fetchFeedbacks(sessionUser),
      ]);
      const feedbackById = new Map(feedbacks.map((feedback) => [feedback.id, feedback]));
      const unreadFeedbacks = notifications
        .filter(
          (notification) =>
            !notification.isRead &&
            (notification.type === "FEEDBACK" || notification.refType === "feedback"),
        )
        .map((notification) => {
          const feedback = feedbackById.get(Number(notification.refId));
          return feedback ? { feedback, notification } : null;
        })
        .filter((item): item is UnreadFeedback => item !== null);

      setItems(unreadFeedbacks);
    } catch (error: any) {
      message.error(error?.message ?? "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }, [sessionUser?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const markAsRead = async (notificationId: number): Promise<boolean> => {
    setMarkingId(notificationId);
    try {
      await markNotificationRead(notificationId);
      setItems((current) =>
        current.filter((item) => item.notification.id !== notificationId),
      );
      return true;
    } catch (error: any) {
      message.error(error?.message ?? "Failed to mark feedback as read");
      return false;
    } finally {
      setMarkingId(null);
    }
  };

  const openFeedback = async (item: UnreadFeedback) => {
    const marked = await markAsRead(item.notification.id);
    if (marked) navigate("/settings/feedback");
  };

  return (
    <section className={styles.page} aria-labelledby="feedback-overview-title">
      <header className={styles.header}>
        <div>
          <div className={styles.headingRow}>
            <MessageOutlined className={styles.headingIcon} />
            <Title id="feedback-overview-title" level={3} className={styles.title}>
              New feedback
            </Title>
          </div>
          <Text type="secondary">Unread feedback submitted by system users.</Text>
        </div>
        <div className={styles.headerActions}>
          <Button icon={<QuestionCircleOutlined />} onClick={() => setUserGuideVisible(true)}>
            User Guide
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => void load()} loading={loading}>
            Refresh
          </Button>
        </div>
      </header>

      <div className={styles.tableSurface}>
        {loading ? (
          <div className={styles.loading}>
            <Spin />
          </div>
        ) : items.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No unread feedback"
            className={styles.empty}
          />
        ) : (
          <Table<UnreadFeedback>
            rowKey={(item) => item.notification.id}
            dataSource={items}
            pagination={{ pageSize: 8, hideOnSinglePage: true }}
            className={styles.table}
            onRow={(item) => ({
              onClick: () => void openFeedback(item),
              className: styles.clickableRow,
            })}
            columns={[
              {
                title: "Type",
                dataIndex: ["feedback", "type"],
                width: 145,
                render: (type: string) => <Tag color="blue">{type}</Tag>,
              },
              {
                title: "Description",
                dataIndex: ["feedback", "description"],
                render: (description: string) => <span className={styles.description}>{description}</span>,
              },
              {
                title: "From",
                key: "from",
                width: 260,
                render: (_, item) => (
                  <span>
                    {item.feedback.user?.name ?? "Unknown"}
                    <span className={styles.email}> ({item.feedback.user?.email ?? "Unknown"})</span>
                  </span>
                ),
              },
              {
                title: "Received",
                dataIndex: ["feedback", "createdAt"],
                width: 180,
                render: (createdAt: string) => (
                  <span className={styles.date}>
                    <ClockCircleOutlined />
                    {new Date(createdAt).toLocaleString()}
                  </span>
                ),
              },
              {
                title: "",
                key: "actions",
                width: 150,
                render: (_, item) => (
                  <Button
                    icon={<CheckOutlined />}
                    loading={markingId === item.notification.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      void markAsRead(item.notification.id);
                    }}
                  >
                    Mark as read
                  </Button>
                ),
              },
            ]}
          />
        )}
      </div>

      <UserGuideModal
        visible={userGuideVisible}
        onClose={() => setUserGuideVisible(false)}
        userRole={sessionUser?.role}
      />
    </section>
  );
}
