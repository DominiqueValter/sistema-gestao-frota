import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  CarFront,
  Wrench,
  History,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { section: "Principal" },
  {
    to: "/",
    label: "Inicio",
    icon: <Home size={18} />,
  },
  {
    to: "/Dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },

  { section: "Gestão" },
  {
    to: "/vehicles",
    label: "Veículos",
    icon: <CarFront size={18} />,
  },
  {
    to: "/maintenances",
    label: "Manutenções",
    icon: <Wrench size={18} />,
  },
  {
    to: "/history",
    label: "Histórico",
    icon: <History size={18} />,
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
                  color: "#e9eef6",
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
                color: isActive ? "#fff" : "#b3c4e0",
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
        <ChevronLeft
          size={16}
          style={{
            transform: collapsed ? "rotate(180deg)" : "none",
            transition: "transform 0.3s",
          }}
        />

        {!collapsed && <span>Recolher</span>}
      </button>
    </aside>
  );
}
