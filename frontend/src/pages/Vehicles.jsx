import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Car, CheckCircle, XCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Swal from "sweetalert2";
import api from "../services/api";
import VehicleModal from "../components/vehicles/VehicleModal";

const statusConfig = {
  ATIVO: { label: "Ativo", bg: "#dcfce7", color: "#15803d" },
  EM_MANUTENCAO: { label: "Manutenção", bg: "#fef9c3", color: "#a16207" },
  INATIVO: { label: "Inativo", bg: "#f1f5f9", color: "#64748b" },
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/vehicle");
      setVehicles(data);
    } catch {
      Swal.fire("Erro", "Não foi possível carregar os veículos.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadVehicles = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/vehicle");
        if (isMounted) setVehicles(data);
      } catch {
        Swal.fire("Erro", "Não foi possível carregar os veículos.", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadVehicles();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id, plate) => {
    const result = await Swal.fire({
      title: "Deletar veículo?",
      text: `O veículo ${plate} será removido permanentemente.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#e5e7eb",
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/vehicle/${id}`);
      Swal.fire({
        title: "Deletado!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchVehicles();
    } catch {
      Swal.fire("Erro", "Não foi possível deletar o veículo.", "error");
    }
  };

  const handleEdit = (vehicle) => {
    setEditing(vehicle);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleModalClose = (refresh) => {
    setModalOpen(false);
    setEditing(null);
    if (refresh) fetchVehicles();
  };

  const handleStatusChange = async (vehicle) => {
    const actions = {
      EM_MANUTENCAO: {
        newStatus: "ATIVO",
        title: "Concluir manutenção?",
        text: `O veículo ${vehicle.licensePlate} voltará para Ativo.`,
        confirmText: "Sim, concluir",
        icon: "question",
      },
      ATIVO: {
        newStatus: "INATIVO",
        title: "Desativar veículo?",
        text: `O veículo ${vehicle.licensePlate} será marcado como Inativo.`,
        confirmText: "Sim, desativar",
        icon: "warning",
      },
      INATIVO: {
        newStatus: "ATIVO",
        title: "Reativar veículo?",
        text: `O veículo ${vehicle.licensePlate} voltará para Ativo.`,
        confirmText: "Sim, reativar",
        icon: "question",
      },
    };

    const action = actions[vehicle.status];
    if (!action) return;

    const result = await Swal.fire({
      title: action.title,
      text: action.text,
      icon: action.icon,
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#e5e7eb",
      confirmButtonText: action.confirmText,
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await api.patch(`/vehicle/${vehicle.id}/status`, {
        status: action.newStatus,
      });
      Swal.fire({
        title: "Status atualizado!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchVehicles();
    } catch (err) {
      const msg = err.response?.data?.message || "Erro ao atualizar status.";
      Swal.fire("Erro", msg, "error");
    }
  };

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
            Veículos
          </h1>
          <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>
            {loading
              ? "..."
              : `${
                  vehicles.filter((v) =>
                    filter === "ALL" ? true : v.status === filter,
                  ).length
                } veículo(s)`}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNew}
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
          Novo veículo
        </motion.button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
          gap: 10,
        }}
      >
        {/* 🔎 Busca */}
        <input
          type="text"
          placeholder="Buscar por placa, modelo ou marca..."
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
            transition: "border 0.15s, box-shadow 0.15s",
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

        {/* 🎯 Filtro */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 13,
            background: "#fff",
            color: "#374151",
            cursor: "pointer",
            outline: "none",
            transition: "border 0.15s, box-shadow 0.15s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#6366f1";
            e.target.style.boxShadow = "0 0 0 2px rgba(99,102,241,0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e5e7eb";
            e.target.style.boxShadow = "none";
          }}
        >
          <option value="ALL">Todos</option>
          <option value="ATIVO">Ativo</option>
          <option value="EM_MANUTENCAO">Em manutenção</option>
          <option value="INATIVO">Inativo</option>
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
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr 1fr 80px 120px 140px",
            padding: "10px 20px",
            background: "#f9fafb",
            borderBottom: "0.5px solid #e5e7eb",
          }}
        >
          {["Placa", "Modelo", "Marca", "Ano", "Status", "Ações"].map((col) => (
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
        ) : vehicles.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}>
            <Car size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
            <p style={{ fontSize: 14 }}>Nenhum veículo cadastrado</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>
              Clique em "Novo veículo" para começar
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {vehicles
              .filter((v) => {
                const matchFilter = filter === "ALL" || v.status === filter;

                const searchLower = search.toLowerCase();
                const matchSearch =
                  v.licensePlate.toLowerCase().includes(searchLower) ||
                  v.model.toLowerCase().includes(searchLower) ||
                  v.brand.toLowerCase().includes(searchLower);

                return matchFilter && matchSearch;
              })
              .map((v, i) => {
                const status = statusConfig[v.status] || statusConfig.INATIVO;
                return (
                  <motion.div
                    key={v.id}
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
                      gridTemplateColumns: "120px 1fr 1fr 80px 120px 110px",
                      padding: "13px 20px",
                      borderBottom: "1px solid #f1f5f9",
                      alignItems: "center",
                      transition: "background 0.2s",
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
                    <span style={{ fontSize: 13, color: "#6b7280" }}>
                      {v.year}
                    </span>
                    <span>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontWeight: 500,
                          background: status.bg,
                          color: status.color,
                          border: "1px solid rgba(0,0,0,0.05)",
                          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
                        }}
                      >
                        {status.label}
                      </span>
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/vehicles/${v.id}`)}
                        style={{
                          background: "#eff6ff",
                          color: "#2563eb",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Eye size={13} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleStatusChange(v)}
                        title={
                          v.status === "EM_MANUTENCAO"
                            ? "Concluir manutenção"
                            : v.status === "ATIVO"
                              ? "Desativar veículo"
                              : "Reativar veículo"
                        }
                        style={{
                          background:
                            v.status === "ATIVO" ? "#f1f5f9" : "#f0fdf4",
                          color: v.status === "ATIVO" ? "#64748b" : "#15803d",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {v.status === "ATIVO" ? (
                          <XCircle size={13} />
                        ) : (
                          <CheckCircle size={13} />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(v.id, v.licensePlate)}
                        style={{
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Trash2 size={13} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <VehicleModal vehicle={editing} onClose={handleModalClose} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
