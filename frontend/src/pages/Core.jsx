const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

import { useEffect, useState } from "react";

const bandaConfig = {
  preventiva: { color: "#059669", bg: "#ecfdf5", icon: "[P]", label: "Preventiva" },
  temprana:   { color: "#d97706", bg: "#fffbeb", icon: "[T]", label: "Temprana" },
  tardia:     { color: "#dc2626", bg: "#fef2f2", icon: "[J]", label: "Tardia" },
  judicial:   { color: "#7c3aed", bg: "#f5f3ff", icon: "", label: "Judicial" },
  castigo:    { color: "#475569", bg: "#f8fafc", icon: "[C]", label: "Castigo" },
};
const estadoConfig = {
  pendiente:            { color: "#d97706", bg: "#fffbeb", label: "Pendiente" },
  en_evaluacion:        { color: "#0ea5e9", bg: "#e0f2fe", label: "En Evaluacion" },
  rechazado_automatico: { color: "#dc2626", bg: "#fef2f2", label: "Rechazado (RDS)" },
  aprobado_scoring:     { color: "#7c3aed", bg: "#f5f3ff", label: "Aprobado por Scoring" },
  en_comite:            { color: "#f59e0b", bg: "#fef3c7", label: "En Comite" },
  aprobado:             { color: "#059669", bg: "#ecfdf5", label: "Aprobado" },
  rechazado:            { color: "#dc2626", bg: "#fef2f2", label: "Rechazado" },
  desembolsado:         { color: "#b91c1c", bg: "#fee2e2", label: "Desembolsado" },
};

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: "[D]" },
  { key: "bandeja",   label: "Bandeja de Solicitudes", icon: "[B]" },
  { key: "comite",    label: "Propuesta y Comite", icon: "[Co]" },
  { key: "desembolso",label: "Aprobaci y Desembolso", icon: "[De]" },
  { key: "mora",      label: "Mora y Recuperaci", icon: "[M]" },
  { key: "ahorros",   label: "Captaciones / Ahorros", icon: "[A]" },
];

export default function Core() {
  let usuario = null;
  try { usuario = JSON.parse(localStorage.getItem("usuario")); } catch (_) {}
  const puedeAprobar = ["comite", "gerencia", "admin"].includes(usuario?.rol);

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [evalModal, setEvalModal] = useState(null);
  const [ingresoNeto, setIngresoNeto] = useState("");
  const [gastoFamiliar, setGastoFamiliar] = useState("");
  const [vista, setVista] = useState("dashboard");
  const [mora, setMora] = useState([]);
  const [cuentas, setCuentas] = useState([]);

  useEffect(() => { cargar(); }, []);

  const cargar = () => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }
    fetch(`${API_URL}/api/credito/todas`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setSolicitudes(d.data || []); setLoading(false); }).catch(() => setLoading(false));
    fetch(`${API_URL}/api/ahorro/todas`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setCuentas(d.data || [])).catch(() => {});
    fetch(`${API_URL}/api/mora/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setMora(d.data || [])).catch(() => {});
  };

  const handleEstado = async (solicitudId, estado) => {
    const motivo = estado === "rechazado" ? prompt("Motivo de rechazo:") : null;
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/credito/estado`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ solicitudId, estado, motivo })
    });
    cargar();
  };

  const handleEvaluar = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/credito/evaluacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ solicitudId: evalModal.id, ingresoNeto: parseFloat(ingresoNeto), gastoFamiliar: parseFloat(gastoFamiliar) })
      });
      const data = await res.json();
      if (data.success) {
        setEvalModal(null); setIngresoNeto(""); setGastoFamiliar(""); cargar();
      } else {
        alert("Error al evaluar: " + (data.message || "Error desconocido"));
      }
    } catch (err) {
      alert("Error de conexion el servidor: " + err.message);
    }
  };

  const solicitudesFiltradas = filtro === "todos" ? solicitudes : solicitudes.filter(s => s.estado === filtro);
  const pendientes  = solicitudes.filter(s => s.estado === "pendiente");
  const enComite    = solicitudes.filter(s => s.estado === "en_comite" || s.estado === "aprobado_scoring");
  const aprobadas   = solicitudes.filter(s => s.estado === "aprobado");

  if (loading) return <div style={styles.loading}>Cargando Panel Core Los Andes...</div>;

  const renderTabla = (lista) => (
    <table style={styles.table}>
      <thead>
        <tr style={styles.thead}>
          {["Cliente ID", "Monto", "Cuota", "RDS", "Score", "Estado", "Acciones"].map(h => (
            <th key={h} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {lista.length === 0 ? (
          <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "#94a3b8" }}>Sin solicitudes</td></tr>
        ) : lista.map((s, i) => {
          const cfg = estadoConfig[s.estado] || estadoConfig.pendiente;
          return (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fff5f5" }}>
              <td style={styles.td}>{s.user_id?.slice(0, 8)}...</td>
              <td style={{ ...styles.td, fontWeight: 700 }}>S/ {Number(s.monto).toFixed(2)}</td>
              <td style={{ ...styles.td, color: "#059669" }}>S/ {Number(s.cuota_mensual).toFixed(2)}</td>
              <td style={styles.td}>{s.rds != null ? `${s.rds}%` : ""}</td>
              <td style={styles.td}>{s.score != null ? s.score : ""}</td>
              <td style={styles.td}><span style={{ ...styles.badge, background: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
              <td style={styles.td}>
                <div style={styles.acciones}>
                  {s.estado === "pendiente" && <button style={styles.btnEvaluarTbl} onClick={() => setEvalModal(s)}>Evaluar</button>}
                  {(s.estado === "aprobado_scoring" || s.estado === "en_comite") && (
                    <>
                      {puedeAprobar
                        ? <button style={styles.btnAprobar} onClick={() => handleEstado(s.id, "aprobado")}> Aprobar</button>
                        : <span style={styles.soloLectura} title="Solo Comit Gerencia o Admin pueden aprobar"> Aprobar</span>
                      }
                      <button style={styles.btnRechazar} onClick={() => handleEstado(s.id, "rechazado")}> Rechazar</button>
                    </>
                  )}
                  {s.estado === "aprobado" && <button style={styles.btnDesembolsar} onClick={() => handleEstado(s.id, "desembolsado")}> Desembolsar</button>}
                  {["rechazado", "rechazado_automatico", "desembolsado"].includes(s.estado) && <span style={{ color: "#94a3b8", fontSize: 12 }}>Sin acciones</span>}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderContenido = () => {
    if (vista === "dashboard") return (
      <>
        <div style={styles.kpiRow}>
          {[
            { label: "Total Solicitudes", value: solicitudes.length, color: "#b91c1c", icon: "" },
            { label: "Pendientes",        value: pendientes.length,  color: "#d97706", icon: "" },
            { label: "En Comite",         value: enComite.length,    color: "#7c3aed", icon: "" },
            { label: "Desembolsadas",     value: solicitudes.filter(s=>s.estado==="desembolsado").length, color: "#059669", icon: "" },
          ].map((k, i) => (
            <div key={i} style={styles.kpiCard}>
              <div style={{ ...styles.kpiIcon, background: k.color + "15", color: k.color }}>{k.icon}</div>
              <div style={styles.kpiValue}>{k.value}</div>
              <div style={styles.kpiLabel}>{k.label}</div>
            </div>
          ))}
        </div>
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}><span style={styles.tableTitle}> solicitudes</span></div>
          {renderTabla(solicitudes.slice(0, 5))}
        </div>
      </>
    );
    if (vista === "bandeja") return (
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}><span style={styles.tableTitle}>Bandeja de Solicitudes</span></div>
        <div style={{ padding: "16px 20px 0" }}>
          <div style={styles.filtros}>
            {["todos", "pendiente", "en_evaluacion", "rechazado_automatico", "aprobado_scoring", "en_comite", "aprobado", "desembolsado"].map(f => (
              <button key={f} style={{ ...styles.filtroBtn, ...(filtro === f ? styles.filtroActivo : {}) }} onClick={() => setFiltro(f)}>
                {f === "todos" ? "Todos" : estadoConfig[f]?.label} ({f === "todos" ? solicitudes.length : solicitudes.filter(s => s.estado === f).length})
              </button>
            ))}
          </div>
        </div>
        {renderTabla(solicitudesFiltradas)}
      </div>
    );
    if (vista === "comite") return (
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}><span style={styles.tableTitle}>Propuesta y Comite - pendientes de resolucion</span>
        {renderTabla(enComite)}
      </div>
    );
    if (vista === "desembolso") return (
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}><span style={styles.tableTitle}>Aprobaci y Desembolso</span></div>
        {renderTabla(aprobadas)}
      </div>
    );
    if (vista === "mora") return (
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}><span style={styles.tableTitle}>Bandeja de Mora  {mora.length} cr
        <div style={{ padding: "16px 20px 0", display: "flex", gap: 10, flexWrap: "wrap" }}>
          {Object.entries(bandaConfig).map(([b, cfg]) => (
            <div key={b} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: cfg.bg, color: cfg.color }}>
              {cfg.icon} {cfg.label}: {mora.filter(m => m.banda === b).length}
            </div>
          ))}
        </div>
        <table style={styles.table}>
          <thead><tr style={styles.thead}>{["Banda","D Mora","Monto Deuda","Estado","Observaciones"].map(h=><th key={h} style={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {mora.length === 0 ? <tr><td colSpan={5} style={{textAlign:"center",padding:32,color:"#94a3b8"}}>Sin registros de mora</td></tr>
              : mora.map((m,i)=>{const cfg=bandaConfig[m.banda]||bandaConfig.preventiva;return(
              <tr key={i} style={{background:i%2===0?"#fff":"#fff5f5"}}>
                <td style={styles.td}><span style={{...styles.badge,background:cfg.bg,color:cfg.color}}>{cfg.icon} {m.banda}</span></td>
                <td style={{...styles.td,fontWeight:700,color:cfg.color}}>{m.dias_mora}</td>
                <td style={styles.td}>S/ {Number(m.monto_deuda).toFixed(2)}</td>
                <td style={styles.td}>{m.estado_gestion}</td>
                <td style={styles.td}>{m.observaciones||""}</td>
              </tr>);})}
          </tbody>
        </table>
      </div>
    );
    if (vista === "ahorros") return (
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}><span style={styles.tableTitle}>Captaciones - Cuentas de Ahorro ({cuentas.length})</span></div>
        <table style={styles.table}>
          <thead><tr style={styles.thead}>{["Cliente ID","Saldo","Meta Ahorro","Tasa Inter","Fecha Apertura"].map(h=><th key={h} style={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {cuentas.length === 0 ? <tr><td colSpan={5} style={{textAlign:"center",padding:32,color:"#94a3b8"}}>Sin cuentas registradas</td></tr>
              : cuentas.map((c,i)=>(
              <tr key={i} style={{background:i%2===0?"#fff":"#fff5f5"}}>
                <td style={styles.td}>{c.user_id?.slice(0,8)}...</td>
                <td style={{...styles.td,fontWeight:700,color:"#059669"}}>S/ {Number(c.saldo).toFixed(2)}</td>
                <td style={styles.td}>S/ {Number(c.meta_ahorro).toFixed(2)}</td>
                <td style={styles.td}>{c.tasa_interes}%</td>
                <td style={{...styles.td,color:"#94a3b8",fontSize:12}}>{new Date(c.fecha_apertura).toLocaleDateString("es-PE")}</td>
              </tr>))}
          </tbody>
        </table>
      </div>
    );
    return null;
  };

  return (
    <div style={styles.page}>
      {evalModal && (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && setEvalModal(null)}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Registrar Evaluaci  S/ {Number(evalModal.monto).toFixed(2)}</h3>
            <p style={styles.modalSub}>Cuota mensual: S/ {Number(evalModal.cuota_mensual).toFixed(2)}</p>
            <div style={styles.field}>
              <label style={styles.label}>Ingreso Neto Mensual (S/)</label>
              <input type="number" style={styles.input} value={ingresoNeto} onChange={(e) => setIngresoNeto(e.target.value)} placeholder="Ej: 2500" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Gasto Familiar Mensual (S/)</label>
              <input type="number" style={styles.input} value={gastoFamiliar} onChange={(e) => setGastoFamiliar(e.target.value)} placeholder="Ej: 800" />
            </div>
            <div style={styles.modalBtns}>
              <button style={styles.btnCancel} onClick={() => setEvalModal(null)}>Cancelar</button>
              <button style={styles.btnEval} onClick={handleEvaluar} disabled={!ingresoNeto || !gastoFamiliar}>Calcular RDS y Score</button>
            </div>
          </div>
        </div>
      )}

      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.logo}>LA</div>
          <div>
            <div style={styles.logoName}>Los Andes</div>
            <div style={styles.logoSub}>Core Bancario  Rol: {usuario?.rol || "staff"}</div>
          </div>
        </div>
        <button style={styles.btnVolver} onClick={() => window.location.href="/dashboard"}>  Dashboard</button>
      </nav>

      <div style={styles.tabsBar}>
        {TABS.map(t => (
          <button key={t.key} style={{ ...styles.tabBtn, ...(vista === t.key ? styles.tabBtnActive : {}) }} onClick={() => setVista(t.key)}>
            <span style={{ marginRight: 6 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>{renderContenido()}</div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#fff5f5", fontFamily: "'Segoe UI', sans-serif" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 48px", background: "#fff", boxShadow: "0 1px 0 #e5e7eb" },
  navLeft: { display: "flex", alignItems: "center", gap: 12 },
  logo: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", fontWeight: 800, fontSize: 18, borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" },
  logoName: { fontWeight: 700, fontSize: 16, color: "#b91c1c" },
  logoSub: { fontSize: 11, color: "#64748b" },
  btnVolver: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600 },
  tabsBar: { display: "flex", gap: 8, padding: "16px 48px", background: "#fff", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap" },
  tabBtn: { padding: "10px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#64748b" },
  tabBtnActive: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", borderColor: "transparent" },
  content: { padding: "28px 48px" },
  kpiRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  kpiCard: { background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  kpiIcon: { width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12 },
  kpiValue: { fontSize: 26, fontWeight: 800, color: "#0f172a" },
  kpiLabel: { fontSize: 12, color: "#64748b", marginTop: 2 },
  filtros: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  filtroBtn: { padding: "6px 14px", borderRadius: 20, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#64748b" },
  filtroActivo: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", borderColor: "transparent" },
  tableCard: { background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" },
  tableHeader: { padding: "16px 20px 0" },
  tableTitle: { fontSize: 15, fontWeight: 700, color: "#0f172a" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: 12 },
  thead: { background: "#f8fafc" },
  th: { padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: 12, fontWeight: 600, borderBottom: "1px solid #f1f5f9" },
  td: { padding: "14px 16px", fontSize: 13, borderBottom: "1px solid #f1f5f9", color: "#374151" },
  badge: { padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  acciones: { display: "flex", gap: 6, flexWrap: "wrap" },
  btnEvaluarTbl: { background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 },
  btnAprobar: { background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 },
  btnRechazar: { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 },
  btnDesembolsar: { background: "#fee2e2", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 },
  soloLectura: { color: "#94a3b8", fontSize: 12, padding: "5px 10px" },
  loading: { padding: 32, color: "#64748b", fontFamily: "sans-serif" },
  overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", borderRadius: 16, padding: 28, width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  modalTitle: { margin: "0 0 4px", fontSize: 18, color: "#0f172a" },
  modalSub: { color: "#64748b", fontSize: 13, marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14, boxSizing: "border-box" },
  modalBtns: { display: "flex", gap: 10, marginTop: 8 },
  btnCancel: { flex: 1, padding: "11px 0", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14 },
  btnEval: { flex: 1, padding: "11px 0", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 },
};


