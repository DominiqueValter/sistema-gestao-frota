import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Wrench } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Swal from "sweetalert2";
import api from "../services/api";
import MaintenanceModal from "../components/maintenances/MaintenanceModal";

const typeConfig = {
  PREVENTIVA: { label: "Preventiva", bg: "#eff6ff", color: "#1d4ed8" },
  CORRETIVA: { label: "Corretiva", bg: "#fef2f2", color: "#dc2626" },
};

export default function Maintenances() {
  const [vehicles, setVehicles] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: vehiclesData } = await api.get("/vehicle");
      setVehicles(vehiclesData);

      const allMaintenances = await Promise.all(
        vehiclesData.map(async (v) => {
          const { data } = await api.get(`/vehicles/${v.id}/maintenance`);
          return data.map((m) => ({
            ...m,
            vehiclePlate: v.licensePlate,
            vehicleModel: v.model,
          }));
        }),
      );
      setMaintenances(allMaintenances.flat());
    } catch {
      Swal.fire("Erro", "Não foi possível carregar as manutenções.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleModalClose = (refresh) => {
    setModalOpen(false);
    if (refresh) fetchData();
  };

  const filtered = maintenances.filter((m) => {
    const matchType = filterType === "ALL" || m.type === filterType;
    const matchSearch =
      search === "" ||
      m.vehiclePlate?.toLowerCase().includes(search.toLowerCase()) ||
      m.vehicleModel?.toLowerCase().includes(search.toLowerCase()) ||
      m.description?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: 28, flex: 1 }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
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
            Manutenções
          </h1>
          <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>
            {loading ? "..." : `${filtered.length} registro(s)`}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setModalOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <Plus size={15} />
          Nova manutenção
        </motion.button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <input
          type="text"
          placeholder="Buscar por placa, modelo ou descrição..."
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
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
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
          <option value="ALL">Todos os tipos</option>
          <option value="PREVENTIVA">Preventiva</option>
          <option value="CORRETIVA">Corretiva</option>
        </select>
      </div>

      {/* Table */}
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
            display: "grid",
            gridTemplateColumns: "120px 1fr 100px 120px 100px 100px",
            padding: "10px 20px",
            background: "#f9fafb",
            borderBottom: "0.5px solid #e5e7eb",
          }}
        >
          {["Placa", "Descrição", "Tipo", "Data", "KM", "Custo"].map((col) => (
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

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
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
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}>
            <Wrench size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
            <p style={{ fontSize: 14 }}>Nenhuma manutenção encontrada</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((m, i) => {
              const type = typeConfig[m.type] || typeConfig.PREVENTIVA;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr 100px 120px 100px 100px",
                    padding: "13px 20px",
                    borderBottom: "0.5px solid #f5f5f5",
                    alignItems: "center",
                    transition: "background 0.15s",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 12,
                        background: "#f4f4f4",
                        padding: "2px 8px",
                        borderRadius: 4,
                        color: "#1e1e2e",
                      }}
                    >
                      {m.vehiclePlate}
                    </span>
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                      {m.vehicleModel}
                    </p>
                  </div>
                  <span style={{ fontSize: 13, color: "#1e1e2e" }}>
                    {m.description}
                  </span>
                  <span>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontWeight: 500,
                        background: type.bg,
                        color: type.color,
                      }}
                    >
                      {type.label}
                    </span>
                  </span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>
                    {new Date(m.date).toLocaleDateString("pt-BR")}
                  </span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>
                    {m.mileage.toLocaleString("pt-BR")} km
                  </span>
                  <span
                    style={{ fontSize: 13, fontWeight: 500, color: "#1e1e2e" }}
                  >
                    {m.cost.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <MaintenanceModal vehicles={vehicles} onClose={handleModalClose} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
