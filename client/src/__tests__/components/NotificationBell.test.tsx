import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotificationBell from "../../FrontEnd/components/shared/NotificationBell";
import * as notificationsApi from "../../FrontEnd/shared/api/notifications";
import * as session from "../../FrontEnd/shared/auth/session";

jest.mock("../../FrontEnd/shared/api/notifications");
jest.mock("../../FrontEnd/shared/auth/session");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

describe("NotificationBell Budget Notifications", () => {
  const budgetNotifications = [
    {
      id: 1,
      type: "BUDGET_THRESHOLD_WARNING",
      title: "Budget Warning",
      message: "IT Department budget at 85%",
      refType: "monthly_budget",
      refId: "123",
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      type: "BUDGET_THRESHOLD_EXCEEDED",
      title: "Budget Exceeded",
      message: "HR Department budget exceeded",
      refType: "monthly_budget",
      refId: "456",
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      type: "BUDGET_PREDICTION_READY",
      title: "Prediction Ready",
      message: "AI prediction for March 2026 is ready",
      refType: "budget_prediction",
      refId: "789",
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (session.getSessionUser as jest.Mock).mockReturnValue({
      id: "user-123",
      role: "DEPARTMENT_MANAGER"
    });
    (notificationsApi.fetchNotifications as jest.Mock).mockResolvedValue(budgetNotifications);
    (notificationsApi.markNotificationRead as jest.Mock).mockResolvedValue(undefined);
  });

  it("should display budget notification icons correctly", async () => {
    render(
      <BrowserRouter>
        <NotificationBell />
      </BrowserRouter>
    );

    // Open the dropdown
    const bellButton = screen.getByRole("button");
    fireEvent.click(bellButton);

    await waitFor(() => {
      expect(screen.getByText("Budget Warning")).toBeInTheDocument();
    });

    // Check that budget-specific icons are rendered
    const warningItem = screen.getByText("Budget Warning").closest("button");
    expect(warningItem).toBeInTheDocument();
  });

  it("should navigate to budget overview when clicking threshold notification", async () => {
    render(
      <BrowserRouter>
        <NotificationBell />
      </BrowserRouter>
    );

    // Open the dropdown
    const bellButton = screen.getByRole("button");
    fireEvent.click(bellButton);

    await waitFor(() => {
      expect(screen.getByText("Budget Warning")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Budget Warning"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/budget/department-overview");
    });
  });

  it("should navigate to adjustment request page when clicking adjustment notification", async () => {
    const adjustmentNotification = {
      id: 4,
      type: "BUDGET_ADJUSTMENT_APPROVED",
      title: "Adjustment Approved",
      message: "Your budget adjustment was approved",
      refType: "budget_adjustment",
      refId: "999",
      isRead: false,
      createdAt: new Date().toISOString()
    };

    (notificationsApi.fetchNotifications as jest.Mock).mockResolvedValue([adjustmentNotification]);

    render(
      <BrowserRouter>
        <NotificationBell />
      </BrowserRouter>
    );

    // Open the dropdown
    const bellButton = screen.getByRole("button");
    fireEvent.click(bellButton);

    await waitFor(() => {
      expect(screen.getByText("Adjustment Approved")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Adjustment Approved"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/budget/adjustment-request");
    });
  });
});
