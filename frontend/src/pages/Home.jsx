import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Car, Wrench, CheckCircle, XCircle, Plus, ClipboardList, List } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import VehicleModal from '../components/vehicles/VehicleModal'
import MaintenanceModal from '../components/maintenances/MaintenanceModal'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function Home() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false)
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/vehicle')
      .then(({ data }) => setVehicles(data))
      .finally(() => setLoading(false))
  }, [])

  const total = vehicles.length
  const ativos = vehicles.filter(v => v.status === 'ATIVO').length
  const manutencao = vehicles.filter(v => v.status === 'EM_MANUTENCAO').length
  const inativos = vehicles.filter(v => v.status === 'INATIVO').length

  const quickActions = [
    {
      label: 'Novo veículo',
      desc: 'Cadastrar na frota',
      icon: <Plus size={16} />,
      iconBg: '#eef2ff',
      iconColor: '#6366f1',
      action: () => setVehicleModalOpen(true),
    },
    {
      label: 'Registrar manutenção',
      desc: 'Agendar ou registrar',
      icon: <Wrench size={16} />,
      iconBg: '#fef9c3',
      iconColor: '#a16207',
      action: () => setMaintenanceModalOpen(true),
    },
    {
      label: 'Ver histórico',
      desc: 'Eventos recentes',
      icon: <ClipboardList size={16} />,
      iconBg: '#f0fdf4',
      iconColor: '#15803d',
      action: () => navigate('/history'),
    },
    {
      label: 'Frota completa',
      desc: 'Ver todos os veículos',
      icon: <List size={16} />,
      iconBg: '#fef2f2',
      iconColor: '#dc2626',
      action: () => navigate('/vehicles'),
    },
  ]

  const stats = [
    { label: 'Total', value: total, dot: '#6366f1' },
    { label: 'Ativos', value: ativos, dot: '#22c55e' },
    { label: 'Em manutenção', value: manutencao, dot: '#f59e0b' },
    { label: 'Inativos', value: inativos, dot: '#94a3b8' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: 32, flex: 1, maxWidth: 720 }}
    >
      {/* Saudação */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ width: 32, height: 3, background: '#6366f1', borderRadius: 2, marginBottom: 10 }} />
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1e1e2e' }}>
          {getGreeting()}, Dominique
        </h1>
        <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>
          O que você precisa fazer hoje?
        </p>
      </div>

      {/* Acesso rápido */}
      <p style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>
        Acesso rápido
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 36 }}>
        {quickActions.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ scale: 1.03, borderColor: '#6366f1' }}
            whileTap={{ scale: 0.97 }}
            onClick={item.action}
            style={{
              background: '#fff',
              border: '0.5px solid #e5e7eb',
              borderRadius: 12,
              padding: '16px 14px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{
              width: 36, height: 36,
              borderRadius: 9,
              background: item.iconBg,
              color: item.iconColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {item.icon}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#1e1e2e' }}>{item.label}</p>
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status da frota */}
      <p style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>
        Status da frota
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + i * 0.07 }}
            style={{
              background: '#fff',
              border: '0.5px solid #e5e7eb',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{
              width: 8, height: 8,
              borderRadius: '50%',
              background: s.dot,
              flexShrink: 0,
              boxShadow: `0 0 0 3px ${s.dot}25`,
            }} />
            <div>
              <p style={{ fontSize: 11, color: '#9ca3af' }}>{s.label}</p>
              <p style={{ fontSize: 20, fontWeight: 600, color: '#1e1e2e', lineHeight: 1.2 }}>
                {loading ? '—' : s.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modais */}
      {vehicleModalOpen && (
        <VehicleModal
          vehicle={null}
          onClose={(refresh) => {
            setVehicleModalOpen(false)
            if (refresh) api.get('/vehicle').then(({ data }) => setVehicles(data))
          }}
        />
      )}
      {maintenanceModalOpen && (
        <MaintenanceModal
          vehicles={vehicles.filter(v => v.status === 'ATIVO')}
          onClose={(refresh) => {
            setMaintenanceModalOpen(false)
            if (refresh) api.get('/vehicle').then(({ data }) => setVehicles(data))
          }}
        />
      )}
    </motion.div>
  )
}