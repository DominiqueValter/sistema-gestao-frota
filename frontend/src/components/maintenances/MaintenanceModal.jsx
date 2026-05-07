import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../services/api";

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "0.5px solid #e5e7eb",
  borderRadius: 8,
  fontSize: 13,
  color: "#1e1e2e",
  outline: "none",
  background: "#f9fafb",
  transition: "border-color 0.15s",
};

const labelStyle = {
  fontSize: 12,
  fontWeight: 500,
  color: "#6b7280",
  marginBottom: 5,
  display: "block",
};

export default function MaintenanceModal({ vehicles, onClose }) {
  const [form, setForm] = useState({
    vehicleId: "",
    type: "PREVENTIVA",
    description: "",
    date: new Date().toISOString().split("T")[0],
    mileage: 0,
    cost: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.vehicleId || !form.description) {
      Swal.fire("Atenção", "Preencha todos os campos obrigatórios.", "warning");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/vehicles/${form.vehicleId}/maintenance`, {
        ...form,
        date: new Date(form.date).toISOString(),
        mileage: Number(form.mileage),
        cost: Number(form.cost),
      });
      Swal.fire({
        title: "Manutenção registrada!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      onClose(true);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Erro ao registrar manutenção.";
      Swal.fire("Erro", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => onClose(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(2px)",
          zIndex: 40,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
        style={{
          position: "fixed",
          top: "23%",
          left: "38%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          borderRadius: 14,
          padding: 28,
          width: 500,
          zIndex: 50,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
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
                width: 24,
                height: 3,
                background: "#6366f1",
                borderRadius: 2,
                marginBottom: 6,
              }}
            />
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1e1e2e" }}>
              Nova manutenção
            </h2>
          </div>
          <button
            onClick={() => onClose(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Veículo *</label>
            <select
              name="vehicleId"
              value={form.vehicleId}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Selecione um veículo</option>
              {vehicles
                .filter((v) => v.status === "ATIVO")
                .map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.licensePlate} — {v.brand} {v.model}
                  </option>
                ))}
            </select>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Tipo *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="PREVENTIVA">Preventiva</option>
                <option value="CORRETIVA">Corretiva</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Data *</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Descrição *</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Ex: Troca de óleo e filtro"
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Quilometragem</label>
              <input
                name="mileage"
                type="number"
                value={form.mileage}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Custo (R$)</label>
              <input
                name="cost"
                type="number"
                step="0.01"
                value={form.cost}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 24,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClose(false)}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              border: "0.5px solid #e5e7eb",
              background: "#fff",
              color: "#6b7280",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              background: "#6366f1",
              color: "#fff",
              border: "none",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Registrando..." : "Registrar"}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
