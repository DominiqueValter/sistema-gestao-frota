import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Car,
  Calendar,
  Wrench,
  BadgeDollarSign,
} from "lucide-react";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import api from "../services/api";
import VehicleModal from "../components/vehicles/VehicleModal";

const statusConfig = {
  ATIVO: {
    label: "Ativo",
    bg: "#dcfce7",
    color: "#15803d",
  },
  EM_MANUTENCAO: {
    label: "Em manutenção",
    bg: "#fef9c3",
    color: "#a16207",
  },
  INATIVO: {
    label: "Inativo",
    bg: "#f1f5f9",
    color: "#64748b",
  },
};

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const fetchVehicle = async () => {
    try {
      setLoading(true);

      const [vehicleResponse, maintenanceResponse] = await Promise.all([
        api.get(`/vehicle/${id}`),
        api.get(`/vehicles/${id}/maintenance`),
      ]);

      setVehicle(vehicleResponse.data);
      setMaintenances(maintenanceResponse.data);
    } catch (err) {
      Swal.fire(
        "Erro",
        "Não foi possível carregar os dados do veículo.",
        "error",
      );

      navigate("/vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const handleModalClose = (refresh) => {
    setModalOpen(false);

    if (refresh) {
      fetchVehicle();
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "R$ 0,00";

    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("pt-BR");
  };

  const status = statusConfig[vehicle?.status] || statusConfig.INATIVO;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        padding: 28,
        flex: 1,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/vehicles")}
            style={{
              background: "#fff",
              width: 38,
              height: 38,
              borderRadius: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #e5e7eb",
            }}
          >
            <ArrowLeft size={18} />
          </motion.button>

          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {loading ? (
                <Skeleton width={180} height={28} />
              ) : (
                `${vehicle?.brand} ${vehicle?.model}`
              )}
            </h1>

            <p
              style={{
                fontSize: 13,
                color: "#9ca3af",
                marginTop: 3,
              }}
            >
              Detalhes do veículo
            </p>
          </div>
        </div>

        {!loading && (
          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModalOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#eef2ff",
                color: "#4f46e5",
                border: "none",
                borderRadius: 10,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Pencil size={15} />
              Editar veículo
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                navigate(`/maintenances/new?vehicleId=${vehicle.id}`)
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#6366f1",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Plus size={15} />
              Nova manutenção
            </motion.button>
          </div>
        )}
      </div>

      {/* CARD VEÍCULO */}
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1px solid #e5e7eb",
          padding: 24,
          marginBottom: 24,
        }}
      >
        {loading ? (
          <Skeleton count={5} height={20} />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "#eef2ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Car size={24} color="#4f46e5" />
              </div>

              <div>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {vehicle?.brand} {vehicle?.model}
                </h2>

                <span
                  style={{
                    marginTop: 6,
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: status.bg,
                    color: status.color,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {status.label}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 0.5fr))",
                gap: 16,
              }}
            >
              <InfoCard label="Placa" value={vehicle?.licensePlate} />

              <InfoCard label="Marca" value={vehicle?.brand} />

              <InfoCard label="Modelo" value={vehicle?.model} />

              <InfoCard label="Ano" value={vehicle?.year} />

              <InfoCard
                label="Quilometragem"
                value={`${vehicle?.mileage || 0} km`}
              />

              <InfoCard label="Status" value={status.label} />
            </div>
          </>
        )}
      </div>

      {/* TABELA MANUTENÇÕES */}
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Histórico de manutenções
            </h2>

            <p
              style={{
                fontSize: 12,
                color: "#9ca3af",
                marginTop: 4,
              }}
            >
              {maintenances.length} manutenção(ões)
            </p>
          </div>
        </div>

        {/* HEADER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr 1fr 140px 120px",
            padding: "12px 22px",
            background: "#f9fafb",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {["Data", "Tipo", "Descrição", "Valor", "Status"].map((item) => (
            <span
              key={item}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {item}
            </span>
          ))}
        </div>

        {/* BODY */}
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                padding: "16px 22px",
              }}
            >
              <Skeleton height={18} />
            </div>
          ))
        ) : maintenances.length === 0 ? (
          <div
            style={{
              padding: 60,
              textAlign: "center",
              color: "#9ca3af",
            }}
          >
            <Wrench
              size={32}
              style={{
                opacity: 0.4,
                marginBottom: 10,
              }}
            />

            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Nenhuma manutenção cadastrada
            </p>

            <p
              style={{
                fontSize: 12,
                marginTop: 4,
              }}
            >
              Clique em "Nova manutenção" para adicionar
            </p>
          </div>
        ) : (
          maintenances.map((maintenance) => (
            <motion.div
              key={maintenance.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 1fr 140px 120px",
                padding: "16px 22px",
                borderBottom: "1px solid #f8fafc",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "#374151",
                }}
              >
                <Calendar size={14} />
                {formatDate(maintenance.date)}
              </div>

              <span
                style={{
                  fontSize: 13,
                  color: "#111827",
                  fontWeight: 500,
                }}
              >
                {maintenance.type}
              </span>

              <span
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                }}
              >
                {maintenance.description}
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "#059669",
                  fontWeight: 600,
                }}
              >
                <BadgeDollarSign size={14} />
                {formatCurrency(maintenance.cost)}
              </div>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color:
                    maintenance.status === "CONCLUIDA" ? "#15803d" : "#d97706",
                }}
              >
                {maintenance.status === "CONCLUIDA" ? "Concluída" : "Pendente"}
              </span>
            </motion.div>
          ))
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <VehicleModal vehicle={vehicle} onClose={handleModalClose} />
      )}
    </motion.div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div
      style={{
        background: "#f9fafb",
        borderRadius: 14,
        padding: 16,
        border: "1px solid #f1f5f9",
      }}
    >
      <p
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: "#9ca3af",
          marginBottom: 6,
          fontWeight: 600,
        }}
      >
        {label}
      </p>

      <h3
        style={{
          fontSize: 15,
          color: "#111827",
          fontWeight: 600,
        }}
      >
        {value || "-"}
      </h3>
    </div>
  );
}
