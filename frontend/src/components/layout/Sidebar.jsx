import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { section: "Principal" },
  {
    to: "/",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
    ),
  },

  { section: "Gestão" },
  {
    to: "/vehicles",
    label: "Veículos",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="1" y="4" width="14" height="9" rx="2" />
        <circle cx="4.5" cy="13" r="1.5" />
        <circle cx="11.5" cy="13" r="1.5" />
        <path d="M3 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
      </svg>
    ),
  },
  {
    to: "/maintenances",
    label: "Manutenções",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3l2 2" />
      </svg>
    ),
  },
  {
    to: "/history",
    label: "Histórico",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M2 4h12M2 8h8M2 12h10" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? 70 : 240,
        background: "linear-gradient(180deg, #1e1e2e, #181825)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* LOGO */}
      <div
        style={{
          padding: "20px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
          }}
        >
          🚗
        </div>

        {!collapsed && (
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
            Gestão de Frota
          </span>
        )}
      </div>

      {/* NAV */}
      <nav
        style={{
          padding: "12px 8px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {navItems.map((item, index) => {
          // SECTION TITLE
          if (item.section) {
            return !collapsed ? (
              <span
                key={index}
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  margin: "14px 10px 6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              >
                {item.section}
              </span>
            ) : null;
          }

          // NAV ITEM
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              title={collapsed ? item.label : ""}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 13,
                marginBottom: 4,
                color: isActive ? "#fff" : "#9ca3af",
                background: isActive
                  ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                  : "transparent",
                transition: "all 0.2s ease",
                position: "relative",
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains("active")) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains("active")) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                {item.icon}
              </span>

              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER / COLLAPSE */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          margin: "10px",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 10,
          borderRadius: 10,
          cursor: "pointer",
          color: "#9ca3af",
          border: "none",
          background: "rgba(255,255,255,0.03)",
          fontSize: 12,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.03)")
        }
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{
            transform: collapsed ? "rotate(180deg)" : "none",
            transition: "transform 0.3s",
          }}
        >
          <path d="M10 3L6 8l4 5" />
        </svg>

        {!collapsed && <span>Recolher</span>}
      </button>
    </aside>
  );
}
