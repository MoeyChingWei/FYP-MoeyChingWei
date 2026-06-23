import React, { useMemo } from "react";
import { Modal, Collapse, Typography, List, Tag, Space, Divider } from "antd";
import {
  BookOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  TruckOutlined,
  InboxOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { isFinanceRole, UserRole } from "../../shared/types/roles";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface UserGuideModalProps {
  visible: boolean;
  onClose: () => void;
  userRole?: string;
}

interface GuideSection {
  key: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function UserGuideModal({
  visible,
  onClose,
  userRole,
}: UserGuideModalProps): React.ReactElement {
  const { t } = useTranslation("userGuide");

  const guideSections = useMemo((): GuideSection[] => {
    const sections: GuideSection[] = [];

    // Common sections for all roles
    sections.push({
      key: "getting-started",
      title: t("gettingStarted.title"),
      icon: <BookOutlined />,
      content: (
        <>
          <Paragraph>
            {t("gettingStarted.welcome")}
          </Paragraph>
          <Title level={5}>{t("gettingStarted.navigation")}</Title>
          <List size="small">
            <List.Item>
              <Text>• {t("gettingStarted.navItems.sidebar")}</Text>
            </List.Item>
            <List.Item>
              <Text>• {t("gettingStarted.navItems.profile")}</Text>
            </List.Item>
            <List.Item>
              <Text>• {t("gettingStarted.navItems.overview")}</Text>
            </List.Item>
            <List.Item>
              <Text>• {t("gettingStarted.navItems.notifications")}</Text>
            </List.Item>
          </List>
        </>
      ),
    });

    // Role-specific sections
    if (userRole === UserRole.ADMIN) {
      sections.push({
        key: "admin-guide",
        title: t("admin.title"),
        icon: <SafetyCertificateOutlined />,
        content: (
          <>
            <Title level={5}>{t("admin.userManagement")}</Title>
            <Paragraph>
              <Text strong>{t("admin.whatYouCanDo")}</Text>
            </Paragraph>
            <List size="small">
              <List.Item>• {t("admin.userCapabilities.create")}</List.Item>
              <List.Item>• {t("admin.userCapabilities.assignRoles")}</List.Item>
              <List.Item>• {t("admin.userCapabilities.activate")}</List.Item>
              <List.Item>• {t("admin.userCapabilities.auditLogs")}</List.Item>
            </List>

            <Paragraph style={{ marginTop: 16 }}>
              <Text strong>{t("admin.howToCreateUser")}</Text>
            </Paragraph>
            <List size="small" bordered>
              <List.Item>1. {t("admin.createUserSteps.step1")}</List.Item>
              <List.Item>2. {t("admin.createUserSteps.step2")}</List.Item>
              <List.Item>3. {t("admin.createUserSteps.step3")}</List.Item>
              <List.Item>4. {t("admin.createUserSteps.step4")}</List.Item>
              <List.Item>5. {t("admin.createUserSteps.step5")}</List.Item>
            </List>

            <Divider />

            <Title level={5}>{t("admin.categoryManagement")}</Title>
            <Paragraph>
              <Text strong>{t("admin.whatYouCanDo")}</Text>
            </Paragraph>
            <List size="small">
              <List.Item>• {t("admin.categoryCapabilities.items")}</List.Item>
              <List.Item>• {t("admin.categoryCapabilities.units")}</List.Item>
              <List.Item>• {t("admin.categoryCapabilities.suppliers")}</List.Item>
            </List>
          </>
        ),
      });
    }

    if (
      userRole === UserRole.EMPLOYEE ||
      userRole === UserRole.DEPARTMENT_EXECUTIVE ||
      userRole === UserRole.MANAGER ||
      isFinanceRole(userRole)
    ) {
      sections.push({
        key: "purchasing-guide",
        title: t("purchasing.title"),
        icon: <ShoppingCartOutlined />,
        content: (
          <>
            <Title level={5}>{t("purchasing.requestCreation")}</Title>
            <Tag color="green">{t("purchasing.availableFor")}</Tag>
            <Paragraph style={{ marginTop: 8 }}>
              <Text strong>{t("purchasing.whatYouCanDo")}</Text>
            </Paragraph>
            <List size="small">
              <List.Item>• {t("purchasing.requestCapabilities.create")}</List.Item>
              <List.Item>• {t("purchasing.requestCapabilities.specify")}</List.Item>
              <List.Item>• {t("purchasing.requestCapabilities.draft")}</List.Item>
            </List>

            <Paragraph style={{ marginTop: 16 }}>
              <Text strong>{t("purchasing.howToCreateRequest")}</Text>
            </Paragraph>
            <List size="small" bordered>
              <List.Item>1. {t("purchasing.createRequestSteps.step1")}</List.Item>
              <List.Item>2. {t("purchasing.createRequestSteps.step2")}</List.Item>
              <List.Item>3. {t("purchasing.createRequestSteps.step3")}</List.Item>
              <List.Item>4. {t("purchasing.createRequestSteps.step4")}</List.Item>
              <List.Item>5. {t("purchasing.createRequestSteps.step5")}</List.Item>
            </List>

            <Paragraph style={{ marginTop: 16 }}>
              <Text strong>{t("purchasing.tips")}</Text>
            </Paragraph>
            <List size="small">
              <List.Item>• {t("purchasing.tipsList.draft")}</List.Item>
              <List.Item>• {t("purchasing.tipsList.justification")}</List.Item>
              <List.Item>• {t("purchasing.tipsList.dates")}</List.Item>
            </List>
          </>
        ),
      });
    }

    if (userRole === UserRole.DEPARTMENT_EXECUTIVE) {
      sections.push({
        key: "approval-guide",
        title: t("approval.title"),
        icon: <CheckCircleOutlined />,
        content: (
          <>
            <Title level={5}>{t("approval.requestApproval")}</Title>
            <Tag color="blue">{t("approval.availableFor")}</Tag>
            <Paragraph style={{ marginTop: 8 }}>
              <Text strong>{t("approval.whatYouCanDo")}</Text>
            </Paragraph>
            <List size="small">
              <List.Item>• {t("approval.approvalCapabilities.review")}</List.Item>
              <List.Item>• {t("approval.approvalCapabilities.approve")}</List.Item>
              <List.Item>• {t("approval.approvalCapabilities.viewDetails")}</List.Item>
            </List>

            <Paragraph style={{ marginTop: 16 }}>
              <Text strong>{t("approval.howToApprove")}</Text>
            </Paragraph>
            <List size="small" bordered>
              <List.Item>1. {t("approval.approveSteps.step1")}</List.Item>
              <List.Item>2. {t("approval.approveSteps.step2")}</List.Item>
              <List.Item>3. {t("approval.approveSteps.step3")}</List.Item>
              <List.Item>4. {t("approval.approveSteps.step4")}</List.Item>
              <List.Item>5. {t("approval.approveSteps.step5")}</List.Item>
            </List>

            <Divider />

            <Title level={5}>{t("approval.poCreation")}</Title>
            <Paragraph>
              <Text strong>{t("approval.howToCreatePO")}</Text>
            </Paragraph>
            <List size="small" bordered>
              <List.Item>1. {t("approval.createPOSteps.step1")}</List.Item>
              <List.Item>2. {t("approval.createPOSteps.step2")}</List.Item>
              <List.Item>3. {t("approval.createPOSteps.step3")}</List.Item>
              <List.Item>4. {t("approval.createPOSteps.step4")}</List.Item>
              <List.Item>5. {t("approval.createPOSteps.step5")}</List.Item>
            </List>
          </>
        ),
      });
    }

    if (userRole === UserRole.MANAGER) {
      sections.push({
        key: "po-approval-guide",
        title: t("poApproval.title"),
        icon: <FileTextOutlined />,
        content: (
          <>
            <Title level={5}>{t("poApproval.reviewApproval")}</Title>
            <Tag color="purple">{t("poApproval.availableFor")}</Tag>
            <Paragraph style={{ marginTop: 8 }}>
              <Text strong>{t("poApproval.whatYouCanDo")}</Text>
            </Paragraph>
            <List size="small">
              <List.Item>• {t("poApproval.poCapabilities.review")}</List.Item>
              <List.Item>• {t("poApproval.poCapabilities.approve")}</List.Item>
              <List.Item>• {t("poApproval.poCapabilities.viewDetails")}</List.Item>
            </List>

            <Paragraph style={{ marginTop: 16 }}>
              <Text strong>{t("poApproval.howToApprove")}</Text>
            </Paragraph>
            <List size="small" bordered>
              <List.Item>1. {t("poApproval.approveSteps.step1")}</List.Item>
              <List.Item>2. {t("poApproval.approveSteps.step2")}</List.Item>
              <List.Item>3. {t("poApproval.approveSteps.step3")}</List.Item>
              <List.Item>4. {t("poApproval.approveSteps.step4")}</List.Item>
              <List.Item>5. {t("poApproval.approveSteps.step5")}</List.Item>
            </List>

            <Divider />

            <Title level={5}>{t("poApproval.smartApproval")}</Title>
            <Paragraph>
              <Text strong>{t("poApproval.configureRules")}</Text>
            </Paragraph>
            <List size="small">
              <List.Item>• {t("poApproval.smartCapabilities.threshold")}</List.Item>
              <List.Item>• {t("poApproval.smartCapabilities.criteria")}</List.Item>
              <List.Item>• {t("poApproval.smartCapabilities.navigate")}</List.Item>
            </List>
          </>
        ),
      });
    }

    if (userRole === UserRole.SUPPLIER) {
      sections.push({
        key: "supplier-guide",
        title: t("supplier.title"),
        icon: <TruckOutlined />,
        content: (
          <>
            <Title level={5}>{t("supplier.orderAcknowledgement")}</Title>
            <Tag color="orange">{t("supplier.availableFor")}</Tag>
            <Paragraph style={{ marginTop: 8 }}>
              <Text strong>{t("supplier.whatYouCanDo")}</Text>
            </Paragraph>
            <List size="small">
              <List.Item>• {t("supplier.supplierCapabilities.view")}</List.Item>
              <List.Item>• {t("supplier.supplierCapabilities.acknowledge")}</List.Item>
              <List.Item>• {t("supplier.supplierCapabilities.update")}</List.Item>
            </List>

            <Paragraph style={{ marginTop: 16 }}>
              <Text strong>{t("supplier.howToAcknowledge")}</Text>
            </Paragraph>
            <List size="small" bordered>
              <List.Item>1. {t("supplier.acknowledgeSteps.step1")}</List.Item>
              <List.Item>2. {t("supplier.acknowledgeSteps.step2")}</List.Item>
              <List.Item>3. {t("supplier.acknowledgeSteps.step3")}</List.Item>
              <List.Item>4. {t("supplier.acknowledgeSteps.step4")}</List.Item>
              <List.Item>5. {t("supplier.acknowledgeSteps.step5")}</List.Item>
            </List>

            <Divider />

            <Title level={5}>{t("supplier.deliveryManagement")}</Title>
            <Paragraph>
              <Text strong>{t("supplier.howToRecordDelivery")}</Text>
            </Paragraph>
            <List size="small" bordered>
              <List.Item>1. {t("supplier.deliverySteps.step1")}</List.Item>
              <List.Item>2. {t("supplier.deliverySteps.step2")}</List.Item>
              <List.Item>3. {t("supplier.deliverySteps.step3")}</List.Item>
              <List.Item>4. {t("supplier.deliverySteps.step4")}</List.Item>
              <List.Item>5. {t("supplier.deliverySteps.step5")}</List.Item>
            </List>
          </>
        ),
      });
    }

    // Common sections
    sections.push({
      key: "tracking-guide",
      title: t("tracking.title"),
      icon: <InboxOutlined />,
      content: (
        <>
          <Title level={5}>{t("tracking.itemTracking")}</Title>
          <Paragraph>
            <Text strong>{t("tracking.whatYouCanDo")}</Text>
          </Paragraph>
          <List size="small">
            <List.Item>• {t("tracking.trackingCapabilities.requests")}</List.Item>
            <List.Item>• {t("tracking.trackingCapabilities.orders")}</List.Item>
            <List.Item>• {t("tracking.trackingCapabilities.deliveries")}</List.Item>
            <List.Item>• {t("tracking.trackingCapabilities.search")}</List.Item>
          </List>

          <Paragraph style={{ marginTop: 16 }}>
            <Text strong>{t("tracking.howToTrack")}</Text>
          </Paragraph>
          <List size="small" bordered>
            <List.Item>1. {t("tracking.trackingSteps.step1")}</List.Item>
            <List.Item>2. {t("tracking.trackingSteps.step2")}</List.Item>
            <List.Item>3. {t("tracking.trackingSteps.step3")}</List.Item>
            <List.Item>4. {t("tracking.trackingSteps.step4")}</List.Item>
          </List>
        </>
      ),
    });

    sections.push({
      key: "profile-settings",
      title: t("profile.title"),
      icon: <UserOutlined />,
      content: (
        <>
          <Title level={5}>{t("profile.managing")}</Title>
          <Paragraph>
            <Text strong>{t("profile.whatYouCanDo")}</Text>
          </Paragraph>
          <List size="small">
            <List.Item>• {t("profile.profileCapabilities.update")}</List.Item>
            <List.Item>• {t("profile.profileCapabilities.password")}</List.Item>
            <List.Item>• {t("profile.profileCapabilities.avatar")}</List.Item>
            <List.Item>• {t("profile.profileCapabilities.notifications")}</List.Item>
          </List>

          <Paragraph style={{ marginTop: 16 }}>
            <Text strong>{t("profile.howToUpdate")}</Text>
          </Paragraph>
          <List size="small" bordered>
            <List.Item>1. {t("profile.updateSteps.step1")}</List.Item>
            <List.Item>2. {t("profile.updateSteps.step2")}</List.Item>
            <List.Item>3. {t("profile.updateSteps.step3")}</List.Item>
            <List.Item>4. {t("profile.updateSteps.step4")}</List.Item>
          </List>

          <Paragraph style={{ marginTop: 16 }}>
            <Text strong>{t("profile.howToChangePassword")}</Text>
          </Paragraph>
          <List size="small" bordered>
            <List.Item>1. {t("profile.passwordSteps.step1")}</List.Item>
            <List.Item>2. {t("profile.passwordSteps.step2")}</List.Item>
            <List.Item>3. {t("profile.passwordSteps.step3")}</List.Item>
            <List.Item>4. {t("profile.passwordSteps.step4")}</List.Item>
          </List>
        </>
      ),
    });

    sections.push({
      key: "notifications",
      title: t("notifications.title"),
      icon: <SettingOutlined />,
      content: (
        <>
          <Title level={5}>{t("notifications.understanding")}</Title>
          <Paragraph>
            {t("notifications.description")}
          </Paragraph>

          <Paragraph>
            <Text strong>{t("notifications.types")}</Text>
          </Paragraph>
          <List size="small">
            <List.Item>
              <Tag color="green">{t("notifications.typesList.success")}</Tag> - {t("notifications.typesList.successDesc")}
            </List.Item>
            <List.Item>
              <Tag color="blue">{t("notifications.typesList.info")}</Tag> - {t("notifications.typesList.infoDesc")}
            </List.Item>
            <List.Item>
              <Tag color="orange">{t("notifications.typesList.warning")}</Tag> - {t("notifications.typesList.warningDesc")}
            </List.Item>
          </List>

          <Paragraph style={{ marginTop: 16 }}>
            <Text strong>{t("notifications.managing")}</Text>
          </Paragraph>
          <List size="small">
            <List.Item>• {t("notifications.managingList.click")}</List.Item>
            <List.Item>• {t("notifications.managingList.markAll")}</List.Item>
            <List.Item>• {t("notifications.managingList.history")}</List.Item>
            <List.Item>• {t("notifications.managingList.delete")}</List.Item>
          </List>
        </>
      ),
    });

    return sections;
  }, [userRole, t]);

  return (
    <Modal
      title={
        <Space>
          <BookOutlined />
          <span>{t("modal.title")}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
      styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
    >
      <Paragraph>
        {t("modal.description")}
        {userRole && (
          <>
            {" "}{t("modal.yourRole")} <Tag color="blue">{userRole}</Tag>
          </>
        )}
      </Paragraph>

      <Collapse
        defaultActiveKey={["getting-started"]}
        expandIconPosition="end"
        style={{ marginTop: 16 }}
      >
        {guideSections.map((section) => (
          <Panel
            header={
              <Space>
                {section.icon}
                <Text strong>{section.title}</Text>
              </Space>
            }
            key={section.key}
          >
            {section.content}
          </Panel>
        ))}
      </Collapse>
    </Modal>
  );
}
