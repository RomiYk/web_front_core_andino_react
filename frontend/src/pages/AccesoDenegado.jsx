export default function AccesoDenegado() {
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuario"));
  } catch (_) {}

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>🔒</div>
        <h1 style={styles.title}>Acceso restringido</h1>
        <p style={styles.text}>
          Este módulo es exclusivo para personal autorizado de Los Andes
          (asesores, comité, riesgos o gerencia).
        </p>
        <p style={styles.role}>
          Tu rol actual: <strong>{usuario?.rol || "cliente"}</strong>
        </p>
        <button style={styles.btn} onClick={() => (window.location.href = "/dashboard")}>
          ← Volver a mi banca
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" },
  card: { background: "#fff", borderRadius: 20, padding: "48px 40px", maxWidth: 420, textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 12px" },
  text: { color: "#64748b", fontSize: 14, lineHeight: 1.6, marginBottom: 16 },
  role: { color: "#b91c1c", fontSize: 13, marginBottom: 24 },
  btn: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
};
