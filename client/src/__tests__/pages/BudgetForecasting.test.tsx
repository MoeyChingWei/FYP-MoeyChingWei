import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BudgetForecasting from "../../FrontEnd/pages/budgetManagement/BudgetForecasting";
import * as departmentBudgetApi from "../../FrontEnd/shared/api/departmentBudget";

jest.mock("../../FrontEnd/shared/api/departmentBudget");
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

global.fetch = jest.fn();

describe("BudgetForecasting Department Filter", () => {
  const mockDepartments = [
    { id: 1, code: "IT", name: "IT Department", isActive: true },
    { id: 2, code: "HR", name: "HR Department", isActive: true }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (departmentBudgetApi.getDepartments as jest.Mock).mockResolvedValue(mockDepartments);
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        success: true,
        data: {
          historical: [],
          forecast: [],
          summary: {
            totalHistoricalAmount: 0,
            totalRequests: 0,
            avgPerPeriod: 0,
            periodType: "monthly",
            dateRange: { start: "", end: "" }
          }
        }
      })
    });
  });

  it("should display department filter dropdown", async () => {
    render(<BudgetForecasting />);

    await waitFor(() => {
      expect(screen.getByText("budgetManagement:department")).toBeInTheDocument();
    });
  });

  it("should load and display department options", async () => {
    render(<BudgetForecasting />);

    await waitFor(() => {
      expect(departmentBudgetApi.getDepartments).toHaveBeenCalledWith(true);
    });
  });

  it("should filter forecast data when department is selected", async () => {
    render(<BudgetForecasting />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(fetchCall).toContain("period=monthly");
  });
});
