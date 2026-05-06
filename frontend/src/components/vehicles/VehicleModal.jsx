import { useState, useEffect } from "react";
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

export default function VehicleModal({ vehicle, onClose }) {
  const isEditing = !!vehicle;

  const [form, setForm] = useState({
    licensePlate: "",
    model: "",
    brand: "",
    year: new Date().getFullYear(),
    mileage: 0,
    status: "ATIVO",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setForm({
        licensePlate: vehicle.licensePlate,
        model: vehicle.model,
        brand: vehicle.brand,
        year: vehicle.year,
        mileage: vehicle.mileage,
        status: vehicle.status,
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.licensePlate || !form.model || !form.brand) {
      Swal.fire("Atenção", "Preencha todos os campos obrigatórios.", "warning");
      return;
    }
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/vehicle/${vehicle.id}`, form);
      } else {
        await api.post("/vehicle", form);
      }
      Swal.fire({
        title: isEditing ? "Atualizado!" : "Cadastrado!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      onClose(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Erro ao salvar veículo.";
      Swal.fire("Erro", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => onClose(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.55)", // mais elegante
          backdropFilter: "blur(6px)",
          zIndex: 40,
        }}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
        style={{
          position: "fixed",
          top: "25%",
          left: "38%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          borderRadius: 14,
          padding: 28,
          width: 480,
          zIndex: 50,
          border: "1px solid #f1f5f9",
          boxShadow: "0 25px 80px rgba(0,0,0,0.25)",
        }}
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
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: 24,
                height: 3,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
                borderRadius: 2,
                marginBottom: 6,
              }}
            />
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1e1e2e" }}>
              {isEditing ? "Editar veículo" : "Novo veículo"}
            </h2>
          </div>
          <button
            onClick={() => onClose(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Placa *</label>
              <input
                name="licensePlate"
                value={form.licensePlate}
                onChange={handleChange}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                style={inputStyle}
                placeholder="ABC1234"
                disabled={isEditing}
              />
            </div>
            <div>
              <label style={labelStyle}>Ano *</label>
              <input
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Modelo *</label>
              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                style={inputStyle}
                placeholder="Civic"
              />
            </div>
            <div>
              <label style={labelStyle}>Marca *</label>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                style={inputStyle}
                placeholder="Honda"
              />
            </div>
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
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                style={inputStyle}
              >
                <option value="ATIVO">Ativo</option>
                <option value="EM_MANUTENCAO">Em manutenção</option>
                <option value="INATIVO">Inativo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
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
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
              color: "#fff",
              border: "none",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Cadastrar"}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
