import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../services/api";

const actionConfig = {
  CADASTRO: {
    label: "Cadastro",
    bg: "#eff6ff",
    color: "#1d4ed8",
    dot: "#3b82f6",
  },
  MANUTENCAO: {
    label: "Manutenção",
    bg: "#fef9c3",
    color: "#a16207",
    dot: "#f59e0b",
  },
  MUDANCA_STATUS: {
    label: "Status",
    bg: "#f0fdf4",
    color: "#15803d",
    dot: "#22c55e",
  },
  ATUALIZACAO_KM: {
    label: "Quilometragem",
    bg: "#f5f3ff",
    color: "#6d28d9",
    dot: "#8b5cf6",
  },
};

export default function History() {
  const [vehicles, setVehicles] = useState([]);
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const { data: vehiclesData } = await api.get("/vehicle");
        setVehicles(vehiclesData);
        const allHistories = await Promise.all(
          vehiclesData.map(async (v) => {
            const { data } = await api.get(`/vehicles/${v.id}/history`);
            return data.map((h) => ({
              ...h,
              vehiclePlate: v.licensePlate,
              vehicleModel: v.model,
            }));
          }),
        );
        setHistories(
          allHistories
            .flat()
            .sort((a, b) => new Date(b.date) - new Date(a.date)),
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = histories.filter((h) => {
    const matchAction = filterAction === "ALL" || h.action === filterAction;
    const matchSearch =
      search === "" ||
      h.vehiclePlate?.toLowerCase().includes(search.toLowerCase()) ||
      h.description?.toLowerCase().includes(search.toLowerCase());
    return matchAction && matchSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: 28, flex: 1 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
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
          Histórico
        </h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>
          {loading ? "..." : `${filtered.length} evento(s) registrado(s)`}
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Buscar por placa ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 13,
            background: "#fff",
            color: "#374151",
            outline: "none",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#6366f1";
            e.target.style.boxShadow = "0 0 0 2px rgba(99,102,241,0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e5e7eb";
            e.target.style.boxShadow = "none";
          }}
        />
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 13,
            background: "#fff",
            color: "#374151",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="ALL">Todas as ações</option>
          <option value="CADASTRO">Cadastro</option>
          <option value="MANUTENCAO">Manutenção</option>
          <option value="MUDANCA_STATUS">Mudança de status</option>
          <option value="ATUALIZACAO_KM">Atualização de KM</option>
        </select>
      </div>

      {/* Timeline */}
      {loading ? (
        Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <Skeleton height={64} borderRadius={10} />
          </div>
        ))
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: 48,
            textAlign: "center",
            color: "#9ca3af",
            background: "#fff",
            borderRadius: 12,
            border: "0.5px solid #e5e7eb",
          }}
        >
          <ClipboardList size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
          <p style={{ fontSize: 14 }}>Nenhum evento encontrado</p>
        </div>
      ) : (
        <div style={{ position: "relative", paddingLeft: 24 }}>
          {/* Linha vertical */}
          <div
            style={{
              position: "absolute",
              left: 7,
              top: 8,
              bottom: 8,
              width: 2,
              background: "#e5e7eb",
              borderRadius: 2,
            }}
          />

          {filtered.map((h, i) => {
            const action = actionConfig[h.action] || {
              label: h.action,
              bg: "#f9fafb",
              color: "#6b7280",
              dot: "#9ca3af",
            };
            return (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  display: "flex",
                  gap: 16,
                  marginBottom: 12,
                  position: "relative",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: -20,
                    top: 18,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: action.dot,
                    border: "2px solid #fff",
                    boxShadow: `0 0 0 2px ${action.dot}40`,
                    flexShrink: 0,
                  }}
                />

                {/* Card */}
                <div
                  style={{
                    flex: 1,
                    background: "#fff",
                    borderRadius: 10,
                    padding: "12px 16px",
                    border: "0.5px solid #e5e7eb",
                    transition: "box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.06)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 20,
                          fontWeight: 500,
                          background: action.bg,
                          color: action.color,
                        }}
                      >
                        {action.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 11,
                          background: "#f4f4f4",
                          padding: "1px 6px",
                          borderRadius: 4,
                          color: "#6b7280",
                        }}
                      >
                        {h.vehiclePlate}
                      </span>
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>
                        {h.vehicleModel}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(h.date).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "#4b5563", marginTop: 6 }}>
                    {h.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
