import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Car, Wrench, CheckCircle, XCircle } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../services/api";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const chartData = [
    {
      name: "Ativos",
      value: ativos,
      color: "#16a34a",
    },
    {
      name: "Manutenção",
      value: manutencao,
      color: "#d97706",
    },
    {
      name: "Inativos",
      value: inativos,
      color: "#94a3b8",
    },
  ];

  // valor fake por enquanto
  const totalMaintenanceCost = 18450;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: 28,
        flex: 1,
      }}
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

        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#1e1e2e",
          }}
        >
          Dashboard
        </h1>

        <p
          style={{
            fontSize: 13,
            color: "#9ca3af",
            marginTop: 2,
          }}
        >
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
            whileHover={{ y: -2 }}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "18px 20px",
              border: "0.5px solid #e5e7eb",
              borderTop: `3px solid ${card.color}`,
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            }}
          >
            {loading ? (
              <Skeleton height={60} />
            ) : (
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
                      fontWeight: 700,
                      color: "#1e1e2e",
                      lineHeight: 1,
                    }}
                  >
                    {card.value}
                  </p>

                  <p
                    style={{
                      fontSize: 11,
                      color: "#c4c4c4",
                      marginTop: 4,
                    }}
                  >
                    {card.sub}
                  </p>
                </div>

                <div
                  style={{
                    background: card.bg,
                    color: card.color,
                    padding: 10,
                    borderRadius: 12,
                  }}
                >
                  {card.icon}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts + métricas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 0.7fr",
          gap: 16,
        }}
      >
        {/* Gráfico */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: 20,
            border: "0.5px solid #e5e7eb",
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                width: 24,
                height: 3,
                background: "#6366f1",
                borderRadius: 2,
                marginBottom: 6,
              }}
            />

            <h2
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#1e1e2e",
              }}
            >
              Status da frota
            </h2>

            <p
              style={{
                fontSize: 12,
                color: "#9ca3af",
                marginTop: 2,
              }}
            >
              Distribuição atual dos veículos
            </p>
          </div>

          {loading ? (
            <Skeleton height={300} />
          ) : (
            <div
              style={{
                width: "100%",
                height: 300,
              }}
            >
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Lado direito */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Card financeiro */}
          <motion.div
            whileHover={{ y: -2 }}
            style={{
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              borderRadius: 14,
              padding: 22,
              color: "#fff",
              minHeight: 160,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 10px 25px rgba(99,102,241,0.25)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  opacity: 0.8,
                }}
              >
                Custos de manutenção
              </p>

              <h2
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  marginTop: 8,
                }}
              >
                R$ {totalMaintenanceCost.toLocaleString("pt-BR")}
              </h2>
            </div>

            <p
              style={{
                fontSize: 12,
                opacity: 0.75,
              }}
            >
              Total acumulado da frota
            </p>
          </motion.div>

          {/* Disponibilidade */}
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 20,
              border: "0.5px solid #e5e7eb",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "#9ca3af",
                marginBottom: 8,
              }}
            >
              Disponibilidade
            </p>

            <h3
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#16a34a",
              }}
            >
              {total > 0 ? Math.round((ativos / total) * 100) : 0}%
            </h3>

            <p
              style={{
                fontSize: 12,
                color: "#6b7280",
                marginTop: 6,
              }}
            >
              Veículos ativos na operação
            </p>
          </div>

          {/* Indicador */}
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 20,
              border: "0.5px solid #e5e7eb",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "#9ca3af",
                marginBottom: 10,
              }}
            >
              Saúde da frota
            </p>

            <div
              style={{
                width: "100%",
                height: 10,
                background: "#f1f5f9",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${total > 0 ? (ativos / total) * 100 : 0}%`,
                }}
                transition={{ duration: 0.8 }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #22c55e, #16a34a)",
                  borderRadius: 999,
                }}
              />
            </div>

            <p
              style={{
                fontSize: 11,
                color: "#9ca3af",
                marginTop: 8,
              }}
            >
              Percentual operacional da frota
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
