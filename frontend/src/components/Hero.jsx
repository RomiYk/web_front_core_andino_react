export default function Hero({ onLogin }) {
  return (
    <section style={styles.hero}>
      <div style={styles.left}>
        <div style={styles.tag}>🌄 Impulsamos tu desarrollo financiero</div>
        <h1 style={styles.h1}>
          Tu progreso crece<br />
          <span style={styles.highlight}>con Los Andes</span>
        </h1>
        <p style={styles.desc}>
          Comprometidos con la inclusión financiera en el Perú. Accede a créditos agropecuarios, PYME, personales y ahorra con las mejores condiciones para ti y tu comunidad.
        </p>
        <div style={styles.btnRow}>
          <button style={styles.btnPrimary} onClick={onLogin}>Ingresar a Banca Online</button>
          <button style={styles.btnSecondary} onClick={() => document.getElementById("creditos")?.scrollIntoView({ behavior: "smooth" })}>Simula tu crédito</button>
        </div>
        <div style={styles.stats}>
          {[["25+", "Años de experiencia"], ["60+", "Oficinas en el Perú"], ["180k+", "Clientes activos"]].map(([v, l]) => (
            <div key={l} style={styles.stat}>
              <div style={styles.statVal}>{v}</div>
              <div style={styles.statLabel}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.cardTop}>
            <div style={styles.cardLabel}>Cuenta de Ahorros</div>
            <div style={styles.cardBadge}>Activa</div>
          </div>
          <div style={styles.cardAmount}>S/ 12,450.00</div>
          <div style={styles.cardSub}>Saldo disponible</div>
          <div style={styles.cardDivider} />
          <div style={styles.cardRow}>
            <span style={styles.cardRowLabel}>TEA</span>
            <span style={styles.cardRowVal}>5.9%</span>
          </div>
          <div style={styles.cardRow}>
            <span style={styles.cardRowLabel}>Próximo pago</span>
            <span style={styles.cardRowVal}>S/ 504.73</span>
          </div>
        </div>
        <div style={styles.floatCard}>
          <span style={styles.floatIcon}>✅</span>
          <div>
            <div style={styles.floatTitle}>Crédito aprobado</div>
            <div style={styles.floatSub}>S/ 5,000 — 12 meses</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  hero: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "80px 48px", minHeight: "85vh", background: "linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)", gap: 48 },
  left: { flex: 1, maxWidth: 560 },
  tag: { display: "inline-block", background: "#fef9c3", color: "#854d0e", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, marginBottom: 24 },
  h1: { fontSize: 52, fontWeight: 800, color: "#0f172a", lineHeight: 1.15, margin: "0 0 20px" },
  highlight: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  desc: { color: "#475569", fontSize: 16, lineHeight: 1.7, marginBottom: 32 },
  btnRow: { display: "flex", gap: 16, marginBottom: 48 },
  btnPrimary: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  btnSecondary: { background: "#fff", color: "#b91c1c", border: "2px solid #b91c1c", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  stats: { display: "flex", gap: 40 },
  stat: { display: "flex", flexDirection: "column" },
  statVal: { fontSize: 28, fontWeight: 800, color: "#b91c1c" },
  statLabel: { fontSize: 12, color: "#64748b", marginTop: 2 },
  right: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" },
  card: { background: "#fff", borderRadius: 24, padding: 32, width: 300, boxShadow: "0 20px 60px rgba(185,28,28,0.15)", border: "1px solid #fee2e2" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  cardLabel: { fontSize: 13, color: "#64748b", fontWeight: 500 },
  cardBadge: { background: "#dcfce7", color: "#166534", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600 },
  cardAmount: { fontSize: 36, fontWeight: 800, color: "#0f172a", marginBottom: 4 },
  cardSub: { fontSize: 12, color: "#94a3b8", marginBottom: 20 },
  cardDivider: { height: 1, background: "#f1f5f9", marginBottom: 16 },
  cardRow: { display: "flex", justifyContent: "space-between", marginBottom: 10 },
  cardRowLabel: { fontSize: 13, color: "#64748b" },
  cardRowVal: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  floatCard: { position: "absolute", bottom: -20, left: -20, background: "#fff", borderRadius: 16, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" },
  floatIcon: { fontSize: 24 },
  floatTitle: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  floatSub: { fontSize: 12, color: "#64748b" },
};
