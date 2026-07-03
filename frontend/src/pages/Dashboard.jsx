import { useEffect, useState } from "react";
import ModalSolicitud from "../components/ModalSolicitud";

const ROLES_STAFF = ["asesor", "comite", "admin", "gerencia", "riesgos"];

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [userId, setUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [exito, setExito] = useState(null);
  const [cuentaAhorro, setCuentaAhorro] = useState(null);
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    const u = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (!u || u === "undefined") {
      setUsuario({ email: "cliente@losandes.pe", nombre: "Cliente" });
      setUserId("a8e4b064-ca59-464e-9f69-baa40e1a529f");
      cargarSolicitudes("a8e4b064-ca59-464e-9f69-baa40e1a529f", token);
      return;
    }
    try {
      const parsed = JSON.parse(u);
      setUsuario(parsed);
      setUserId(parsed.id);
      if (parsed.id && token) {
        cargarSolicitudes(parsed.id, token);
        cargarAhorro(parsed.id, token);
        cargarMovimientos(parsed.id, token);
      }
    } catch(e) {
      setUsuario({ email: "cliente@losandes.pe", nombre: "Cliente" });
    }
  }, []);

  const cargarAhorro = (uid, token) => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/ahorro/cuenta/${uid}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setCuentaAhorro(d.data); })
      .catch(() => {});
  };

  const cargarMovimientos = (uid, token) => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/ahorro/movimientos/${uid}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setMovimientos(d.data || []); })
      .catch(() => {});
  };

  const cargarSolicitudes = (uid, token) => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/credito/solicitudes/${uid}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => { if (d.success) setSolicitudes(d.data || []); })
      .catch(() => {});
  };

  const handleExito = (solicitud) => {
    setModalOpen(false);
    setExito(solicitud);
    setSolicitudes(prev => [solicitud, ...prev]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/";
  };

  const estadoColor = { pendiente: "#d97706", aprobado: "#059669", rechazado: "#dc2626", desembolsado: "#b91c1c" };
  const estadoBg = { pendiente: "#fffbeb", aprobado: "#ecfdf5", rechazado: "#fef2f2", desembolsado: "#fee2e2" };

  const irASeccion = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!usuario) return <div style={{padding:32,color:"#64748b"}}>Cargando...</div>;

  return (
    <div id="inicio" style={styles.page}>
      {modalOpen && <ModalSolicitud onClose={() => setModalOpen(false)} userId={userId || "a8e4b064-ca59-464e-9f69-baa40e1a529f"} onExito={handleExito} />}

      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.logo}>LA</div>
          <div>
            <div style={styles.logoName}>Los Andes</div>
            <div style={styles.logoSub}>Banca por Internet</div>
          </div>
        </div>
        <div style={styles.navLinks}>
          {[
            { label: "Inicio",        id: "inicio" },
            { label: "Mis Cuentas",   id: "cuentas" },
            { label: "PrÃ©stamos",     id: "creditos-dash" },
            { label: "Transferencias",id: "transferencias" },
            { label: "Pagos",         id: "pagos" },
          ].map(l => (
            <a key={l.id} style={styles.navLink} onClick={() => irASeccion(l.id)}>{l.label}</a>
          ))}
        </div>
        <div style={styles.navRight}>
          <div style={styles.userBadge}>{(usuario.nombre || usuario.email)?.[0]?.toUpperCase()}</div>
          <button style={styles.btnLogout} onClick={handleLogout}>Salir</button>
        </div>
      </nav>

      <div style={styles.hero}>
        <div>
          <h1 style={styles.heroTitle}>Bienvenido, {usuario.nombre || usuario.email} ðŸ‘‹</h1>
          <p style={styles.heroSub}>AquÃ­ tienes un resumen de tu actividad financiera</p>
        </div>
      </div>

      <div style={styles.content}>
        {exito && (
          <div style={styles.exitoBox}>
            âœ… Solicitud enviada â€” Cuota mensual: <strong>S/ {exito.cuota_mensual}</strong> â€” Estado: <strong>{exito.estado}</strong>
          </div>
        )}

        <div id="cuentas" style={{ ...styles.cards, scrollMarginTop: 90 }}>
          {[
            { label: "Cuenta de Ahorros", value: `S/ ${Number(cuentaAhorro?.saldo || 0).toFixed(2)}`, sub: cuentaAhorro ? "Saldo disponible" : "Sin cuenta de ahorros", icon: "ðŸ¦", color: "#b91c1c" },
            { label: "CrÃ©ditos Activos", value: solicitudes.filter(s => s.estado !== "rechazado").length.toString(), sub: "Solicitudes activas", icon: "ðŸ“‹", color: "#8b5cf6" },
            { label: "PrÃ³xima Cuota", value: `S/ ${solicitudes.find(s => s.estado === "desembolsado")?.cuota_mensual || solicitudes[0]?.cuota_mensual || "0.00"}`, sub: solicitudes.length ? "Ver detalle abajo" : "Sin cuotas pendientes", icon: "ðŸ“…", color: "#059669" },
          ].map((c, i) => (
            <div key={i} style={styles.card}>
              <div style={{ ...styles.cardIcon, background: c.color + "15", color: c.color }}>{c.icon}</div>
              <div style={styles.cardLabel}>{c.label}</div>
              <div style={styles.cardValue}>{c.value}</div>
              <div style={styles.cardSub}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div id="creditos-dash" style={{ ...styles.section, scrollMarginTop: 90 }}>
          <p style={styles.sectionDesc}>Accede a crÃ©ditos agropecuarios, PYME o personales con las mejores tasas de Los Andes.</p>
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={() => setModalOpen(true)}>+ Nueva Solicitud</button>
            <button style={{...styles.btnSecondary, borderColor:"#b91c1c", color:"#b91c1c"}} onClick={() => window.location.href="/calculadora.html"}>ðŸ“Š Calculadora 30 Casos</button>
            {ROLES_STAFF.includes(usuario?.rol) && (
              <>
                <button style={styles.btnSecondary} onClick={() => window.location.href="/mora"}>Ver Bandeja de Mora</button>
                <button style={{...styles.btnSecondary, borderColor:"#7c3aed", color:"#7c3aed"}} onClick={() => window.location.href="/core"}>ðŸ¦ Panel Core</button>
              </>
            )}
          </div>
          {!ROLES_STAFF.includes(usuario?.rol) && (
            <p style={styles.staffHint}>ðŸ”’ Bandeja de Mora y Panel Core son exclusivos para personal autorizado de Los Andes.</p>
          )}
        </div>

        {solicitudes.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Mis Solicitudes</h2>
            {solicitudes.map((s, i) => (
              <div key={i} style={styles.solicitudRow}>
                <div>
                  <div style={styles.solicitudMonto}>S/ {Number(s.monto).toFixed(2)}</div>
                  <div style={styles.solicitudDetalle}>{s.plazo_meses} meses â€” TEA {s.tasa_anual}% â€” Cuota S/ {Number(s.cuota_mensual).toFixed(2)}</div>
                </div>
                <span style={{ padding:"5px 12px", borderRadius:20, fontSize:12, fontWeight:600, background: estadoBg[s.estado] || "#f1f5f9", color: estadoColor[s.estado] || "#64748b" }}>
                  {s.estado}
                </span>
              </div>
            ))}
          </div>
        )}

        {movimientos.length > 0 && (
          <div id="movimientos" style={{ ...styles.section, scrollMarginTop: 90 }}>
            <h2 style={styles.sectionTitle}>Movimientos de Cuenta</h2>
            <p style={styles.sectionDesc}>Historial de depÃ³sitos y desembolsos en tu cuenta de ahorros.</p>
            {movimientos.map((m, i) => (
              <div key={i} style={styles.solicitudRow}>
                <div>
                  <div style={styles.solicitudMonto}>+ S/ {Number(m.monto).toFixed(2)}</div>
                  <div style={styles.solicitudDetalle}>
                    {m.descripcion} â€” {new Date(m.created_at).toLocaleDateString("es-PE")}
                  </div>
                </div>
                <span style={{ padding:"5px 12px", borderRadius:20, fontSize:12, fontWeight:600, background: "#ecfdf5", color: "#059669" }}>
                  Saldo: S/ {Number(m.saldo_resultante).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div id="transferencias" style={{ ...styles.section, scrollMarginTop: 90 }}>
          <h2 style={styles.sectionTitle}>Transferencias</h2>
          <p style={styles.sectionDesc}>Transferencias entre cuentas Los Andes y a otros bancos. Esta funciÃ³n estarÃ¡ disponible prÃ³ximamente.</p>
          <div style={styles.proximamente}>ðŸš§ MÃ³dulo en construcciÃ³n para este proyecto acadÃ©mico</div>
        </div>


        <div id="pagos" style={{ ...styles.section, scrollMarginTop: 90 }}>
          <h2 style={styles.sectionTitle}>Pagos</h2>
          <p style={styles.sectionDesc}>Paga tus cuotas de crÃ©dito, servicios y recibos directamente desde tu cuenta.</p>
          <div style={styles.proximamente}>ðŸš§ MÃ³dulo en construcciÃ³n para este proyecto acadÃ©mico</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#fff5f5", fontFamily: "'Segoe UI', sans-serif" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 48px", background: "#fff", boxShadow: "0 1px 0 #e5e7eb", position: "sticky", top: 0, zIndex: 100 },
  navLeft: { display: "flex", alignItems: "center", gap: 12 },
  logo: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", fontWeight: 800, fontSize: 18, borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" },
  logoName: { fontWeight: 700, fontSize: 16, color: "#b91c1c" },
  logoSub: { fontSize: 11, color: "#64748b" },
  navLinks: { display: "flex", gap: 28 },
  navLink: { color: "#374151", fontSize: 14, fontWeight: 500, cursor: "pointer", textDecoration: "none" },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  userBadge: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", fontWeight: 700, fontSize: 16, borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" },
  btnLogout: { background: "none", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, color: "#64748b", fontWeight: 500 },
  hero: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", padding: "40px 48px", color: "#fff" },
  heroTitle: { margin: 0, fontSize: 28, fontWeight: 800 },
  heroSub: { margin: "8px 0 0", opacity: 0.85, fontSize: 15 },
  content: { padding: "32px 48px" },
  exitoBox: { background: "#ecfdf5", color: "#065f46", padding: "14px 20px", borderRadius: 12, marginBottom: 24, fontSize: 14, border: "1px solid #a7f3d0" },
  cards: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 },
  card: { background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  cardIcon: { width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 },
  cardLabel: { fontSize: 13, color: "#64748b", marginBottom: 6 },
  cardValue: { fontSize: 30, fontWeight: 800, color: "#0f172a", marginBottom: 4 },
  cardSub: { fontSize: 12, color: "#94a3b8" },
  section: { background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 20 },
  sectionTitle: { margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0f172a" },
  sectionDesc: { color: "#64748b", fontSize: 14, marginBottom: 20 },
  staffHint: { color: "#94a3b8", fontSize: 12, marginTop: 14, fontStyle: "italic" },
  proximamente: { background: "#f8fafc", color: "#94a3b8", padding: "14px 18px", borderRadius: 10, fontSize: 13, border: "1px dashed #e2e8f0", textAlign: "center" },
  btnRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  btnPrimary: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  btnSecondary: { background: "#fff", color: "#b91c1c", border: "2px solid #b91c1c", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  solicitudRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f1f5f9" },
  solicitudMonto: { fontSize: 16, fontWeight: 700, color: "#0f172a" },
  solicitudDetalle: { fontSize: 12, color: "#64748b", marginTop: 2 },
};


