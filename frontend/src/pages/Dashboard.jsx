import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Car, Wrench, CheckCircle, XCircle } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const statusConfig = {
  ATIVO: { label: "Ativo", bg: "#dcfce7", color: "#15803d" },
  EM_MANUTENCAO: { label: "Manutenção", bg: "#fef9c3", color: "#a16207" },
  INATIVO: { label: "Inativo", bg: "#f1f5f9", color: "#64748b" },
};

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/vehicle")
      .then(({ data }) => setVehicles(data))
      .finally(() => setLoading(false));
  }, []);

  const total = vehicles.length;
  const ativos = vehicles.filter((v) => v.status === "ATIVO").length;
  const manutencao = vehicles.filter(
    (v) => v.status === "EM_MANUTENCAO",
  ).length;
  const inativos = vehicles.filter((v) => v.status === "INATIVO").length;

  const cards = [
    {
      label: "Total de veículos",
      value: total,
      icon: <Car size={20} />,
      color: "#6366f1",
      bg: "#eef2ff",
      sub: "frota completa",
    },
    {
      label: "Ativos",
      value: ativos,
      icon: <CheckCircle size={20} />,
      color: "#16a34a",
      bg: "#dcfce7",
      sub: "disponíveis",
    },
    {
      label: "Em manutenção",
      value: manutencao,
      icon: <Wrench size={20} />,
      color: "#d97706",
      bg: "#fef9c3",
      sub: "indisponíveis",
    },
    {
      label: "Inativos",
      value: inativos,
      icon: <XCircle size={20} />,
      color: "#94a3b8",
      bg: "#f1f5f9",
      sub: "fora de operação",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: 28, flex: 1 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            width: 32,
            height: 3,
            background: "#6366f1",
            borderRadius: 2,
            marginBottom: 8,
          }}
        />
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#1e1e2e" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>
          Visão geral da frota
        </p>
      </div>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "18px 20px",
              border: "0.5px solid #e5e7eb",
              borderTop: `3px solid ${card.color}`,
            }}
          >
            {loading ? (
              <Skeleton height={60} />
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#9ca3af",
                        marginBottom: 6,
                      }}
                    >
                      {card.label}
                    </p>
                    <p
                      style={{
                        fontSize: 28,
                        fontWeight: 600,
                        color: "#1e1e2e",
                        lineHeight: 1,
                      }}
                    >
                      {card.value}
                    </p>
                    <p style={{ fontSize: 11, color: "#c4c4c4", marginTop: 4 }}>
                      {card.sub}
                    </p>
                  </div>
                  <div
                    style={{
                      background: card.bg,
                      color: card.color,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    {card.icon}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent vehicles table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "0.5px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "0.5px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                width: 24,
                height: 3,
                background: "#6366f1",
                borderRadius: 2,
                marginBottom: 6,
              }}
            />
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "#1e1e2e" }}>
              Veículos recentes
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/vehicles")}
            style={{
              background: "none",
              border: "0.5px solid #e5e7eb",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              color: "#6b7280",
              cursor: "pointer",
            }}
          >
            Ver todos
          </motion.button>
        </div>

        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr 1fr 80px 120px",
            padding: "10px 20px",
            background: "#f9fafb",
            borderBottom: "0.5px solid #e5e7eb",
          }}
        >
          {["Placa", "Modelo", "Marca", "Ano", "Status"].map((col) => (
            <span
              key={col}
              style={{
                fontSize: 11,
                color: "#9ca3af",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {col}
            </span>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                padding: "14px 20px",
                borderBottom: "0.5px solid #f0f0f0",
              }}
            >
              <Skeleton height={16} />
            </div>
          ))
        ) : vehicles.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
            <Car size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
            <p style={{ fontSize: 13 }}>Nenhum veículo cadastrado ainda</p>
          </div>
        ) : (
          vehicles.slice(0, 5).map((v, i) => {
            const status = statusConfig[v.status] || statusConfig.INATIVO;
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 1fr 80px 120px",
                  padding: "13px 20px",
                  borderBottom: "0.5px solid #f5f5f5",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    background: "#f4f4f4",
                    padding: "2px 8px",
                    borderRadius: 4,
                    color: "#1e1e2e",
                    display: "inline-block",
                    width: "fit-content",
                  }}
                >
                  {v.licensePlate}
                </span>
                <span style={{ fontSize: 13, color: "#1e1e2e" }}>
                  {v.model}
                </span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  {v.brand}
                </span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>{v.year}</span>
                <span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontWeight: 500,
                      background: status.bg,
                      color: status.color,
                    }}
                  >
                    {status.label}
                  </span>
                </span>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
