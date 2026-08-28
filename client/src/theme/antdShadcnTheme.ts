import type { ThemeConfig } from "antd";

/**
 * Shared OptiMind visual language: quiet operational surfaces, teal actions,
 * crisp borders and restrained elevation.
 */
export const antdShadcnTheme: ThemeConfig = {
  token: {
    colorPrimary: "#0f766e",
    colorSuccess: "#22c55e",
    colorWarning: "#ca8a04",
    colorError: "#dc2626",
    colorInfo: "#0f766e",

    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    colorBgLayout: "#f4f7fb",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",

    colorBorder: "#dce5ee",
    colorBorderSecondary: "#edf2f6",

    colorText: "#102033",
    colorTextSecondary: "#66788a",
    colorTextTertiary: "#8b9bad",
    colorTextQuaternary: "#c2ced9",

    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',

    boxShadow:
      "0 1px 2px 0 rgb(16 32 51 / 0.05)",
    boxShadowSecondary: "0 10px 26px rgb(16 32 51 / 0.08)",
  },
  components: {
    Button: {
      primaryShadow: "none",
      defaultShadow: "none",
      borderRadius: 6,
      defaultBorderColor: "#c8d5e1",
      defaultColor: "#102033",
      defaultHoverBg: "#f5fbfa",
      defaultHoverColor: "#0f766e",
      defaultHoverBorderColor: "#0f766e",
    },
    Card: {
      borderRadiusLG: 8,
    },
    Input: {
      borderRadius: 6,
      hoverBorderColor: "#0f766e",
      activeBorderColor: "#0f766e",
    },
    Layout: {
      bodyBg: "#f4f7fb",
      headerBg: "#ffffff",
      headerPadding: "0 24px",
      siderBg: "#ffffff",
    },
    Menu: {
      darkItemBg: "transparent",
      darkItemSelectedBg: "#27272a",
      darkItemHoverBg: "#18181b",
      darkItemColor: "#fafafa",
      darkSubMenuItemBg: "#09090b",
    },
    Table: {
      borderColor: "#dce5ee",
      headerBg: "#f8fafc",
    },
    Typography: {
      colorTextHeading: "#102033",
    },
  },
};
