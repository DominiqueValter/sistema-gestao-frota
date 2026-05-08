import { motion } from "framer-motion";
import { FolderGit2, Code2, LifeBuoy } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        height: 60,
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        borderTop: "1px solid #e5e7eb",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Esquerda */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* Infos */}
        <div style={{ lineHeight: 1.1 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Gestão de Frotas
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 4,
              fontSize: 11,
              color: "#9ca3af",
            }}
          >
            <span>v1.0.0</span>

            <span>•</span>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#16a34a",
                position: "relative",
              }}
            >
              {/* Ping */}
              <motion.span
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  left: -1,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
              {/* Bolinha fixa */}
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#16a34a",
                  position: "relative",
                  zIndex: 1,
                }}
              />
              Online
            </div>
          </div>
        </div>
      </div>

      {/* Direita */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 12,
          color: "#6b7280",
        }}
      >
        <motion.a
          href="mailto:dominique.mariah.vltr@gmail.com?subject=Suporte%20-%20Sistema%20de%20Frota"
          whileHover={{ y: -1 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            textDecoration: "none",
            color: "#6b7280",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          <LifeBuoy size={14} />
          Suporte
        </motion.a>

        <motion.a
          href="https://github.com/DominiqueValter"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.08 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            textDecoration: "none",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          <FolderGit2 size={14} />
          GitHub
        </motion.a>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: "#9ca3af",
          }}
        >
          <Code2 size={12} fill="#ef4444" color="#ef4444" />

          <span>Dominique © 2026</span>
        </div>
      </div>
    </footer>
  );
}
