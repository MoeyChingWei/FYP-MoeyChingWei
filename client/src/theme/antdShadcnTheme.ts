import type { ThemeConfig } from "antd";

/**
 * Ant Design theme tuned to feel closer to shadcn/ui:
 * zinc neutrals, subtle borders, soft shadows, system sans font.
 */
export const antdShadcnTheme: ThemeConfig = {
  token: {
    colorPrimary: "#18181b",
    colorSuccess: "#22c55e",
    colorWarning: "#ca8a04",
    colorError: "#dc2626",
    colorInfo: "#71717a",

    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    colorBgLayout: "#fafafa",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",

    colorBorder: "#e4e4e7",
    colorBorderSecondary: "#f4f4f5",

    colorText: "#09090b",
    colorTextSecondary: "#71717a",
    colorTextTertiary: "#a1a1aa",
    colorTextQuaternary: "#d4d4d8",

    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',

    boxShadow:
      "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)",
    boxShadowSecondary: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  },
  components: {
    Button: {
      primaryShadow: "none",
      defaultShadow: "none",
      borderRadius: 6,
      defaultBorderColor: "#e4e4e7",
      defaultColor: "#18181b",
      defaultHoverBg: "#fafafa",
      defaultHoverColor: "#09090b",
      defaultHoverBorderColor: "#d4d4d8",
    },
    Card: {
      borderRadiusLG: 8,
    },
    Input: {
      borderRadius: 6,
      hoverBorderColor: "#d4d4d8",
      activeBorderColor: "#18181b",
    },
    Layout: {
      bodyBg: "#fafafa",
      headerBg: "#ffffff",
      headerPadding: "0 24px",
      siderBg: "#09090b",
    },
    Menu: {
      darkItemBg: "transparent",
      darkItemSelectedBg: "#27272a",
      darkItemHoverBg: "#18181b",
      darkItemColor: "#fafafa",
      darkSubMenuItemBg: "#09090b",
    },
    Table: {
      borderColor: "#e4e4e7",
      headerBg: "#fafafa",
    },
    Typography: {
      colorTextHeading: "#09090b",
    },
  },
};
