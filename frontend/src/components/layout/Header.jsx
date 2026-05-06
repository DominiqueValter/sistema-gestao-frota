import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Sun, Moon, LogOut, User } from "lucide-react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const itemStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    fontSize: 13,
    color: "#374151",
    background: "none",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  };

  return (
    <div
      style={{
        height: 60,
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 20px",
        gap: 14,
      }}
    >
      {/* 🔔 Notificação */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        style={{
          position: "relative",
          cursor: "pointer",
          padding: 8,
          borderRadius: 8,
        }}
      >
        <Bell size={18} color="#6b7280" />
        <span
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 6,
            height: 6,
            background: "#ef4444",
            borderRadius: "50%",
          }}
        />
      </motion.div>

      {/* 🌙☀️ Toggle */}
      <motion.div
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        style={{
          cursor: "pointer",
          padding: 8,
          borderRadius: 8,
          background: "#f9fafb",
        }}
      >
        {darkMode ? (
          <Sun size={18} color="#f59e0b" />
        ) : (
          <Moon size={18} color="#6366f1" />
        )}
      </motion.div>

      {/* 👤 Avatar + Dropdown */}
      <div
        style={{
          position: "relative",
          paddingLeft: 10,
          borderLeft: "1px solid #e5e7eb",
        }}
      >
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => setOpen(!open)}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#6366f1",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          D
        </motion.div>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                top: 45,
                right: 0,
                width: 180,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                overflow: "hidden",
                zIndex: 10,
              }}
            >
              {/* Nome */}
              <div
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 500, color: "#1e1e2e" }}>
                  Dominique
                </p>
                <p style={{ fontSize: 11, color: "#9ca3af" }}>Administrador</p>
              </div>

              {/* Opções */}
              <div style={{ padding: 6 }}>
                <motion.button
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  style={itemStyle}
                >
                  <User size={14} />
                  Configurações
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: "#fef2f2" }}
                  style={{ ...itemStyle, color: "#dc2626" }}
                >
                  <LogOut size={14} />
                  Sair
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
