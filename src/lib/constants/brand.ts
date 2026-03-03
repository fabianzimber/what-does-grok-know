export const brand = {
  colors: {
    primary: "#e63946",
    secondary: "#fadadd",
    accent: "#6366f1",
    gold: "#f4d03f",
    warm: "#e67e22",
    deep: "#2c3e50",
    background: "#f8f7f5",
    text: "#1a1a1a",
    muted: "#6b7280",
    border: "#e5e7eb",
    card: "rgba(255, 255, 255, 0.7)",
    glass: "rgba(255, 255, 255, 0.3)",
  },
  font: {
    family: "Inter, system-ui, -apple-system, sans-serif",
  },
  radius: {
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    full: "9999px",
  },
} as const;

export const gradients = {
  primary: "linear-gradient(135deg, #e63946 0%, #6366f1 100%)",
  warm: "linear-gradient(135deg, #e63946 0%, #e67e22 100%)",
  cool: "linear-gradient(135deg, #6366f1 0%, #2c3e50 100%)",
  gold: "linear-gradient(135deg, #f4d03f 0%, #e67e22 100%)",
  brain: "linear-gradient(135deg, #e63946 0%, #6366f1 50%, #2c3e50 100%)",
} as const;
