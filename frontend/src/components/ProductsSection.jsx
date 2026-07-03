const creditos = [
  { icon: "🌾", title: "Crédito Agropecuario", desc: "Financia tus actividades agrícolas y ganaderas con tasas competitivas adaptadas al ciclo de tu cosecha." },
  { icon: "🏢", title: "Crédito PYME", desc: "Impulsa tu negocio con créditos flexibles para micro y pequeñas empresas con plazos hasta 36 meses." },
  { icon: "👩", title: "Mujer Luchadora", desc: "Crédito especial diseñado para empoderar a las mujeres emprendedoras con condiciones preferenciales." },
];

const ahorros = [
  { icon: "🏦", title: "Ahorro Meta", desc: "Alcanza tus metas con nuestra cuenta de ahorro programado de alta rentabilidad y sin comisiones." },
  { icon: "💰", title: "Depósito a Plazo Fijo", desc: "Invierte tu dinero y obtén una TEA de hasta 5.9% anual con total seguridad y respaldo de la SBS." },
  { icon: "📈", title: "Cuenta CTS", desc: "Transfiere tu CTS y obtén una de las mejores tasas del mercado con disponibilidad según ley." },
];

const seguros = [
  { icon: "🛡️", title: "Seguro de Desgravamen", desc: "Protege a tu familia de la deuda pendiente en caso de fallecimiento o invalidez total." },
  { icon: "❤️", title: "Microseguro de Vida", desc: "Protección económica accesible para ti y tus seres queridos ante cualquier imprevisto." },
  { icon: "🚗", title: "SOAT", desc: "Cobertura obligatoria para tu vehículo con la mejor atención y respaldo de Los Andes." },
];

const talleres = [
  { icon: "📚", title: "Educación Financiera", desc: "Talleres gratuitos para aprender a manejar tu dinero, ahorrar mejor y planificar tu futuro." },
  { icon: "🌱", title: "Emprendimiento Rural", desc: "Capacitaciones para fortalecer tu negocio agropecuario o PYME con herramientas prácticas." },
  { icon: "💡", title: "Finanzas Digitales", desc: "Aprende a usar la banca por internet, transferencias y pagos digitales de forma segura." },
];

function Grid({ id, title, sub, items }) {
  return (
    <section id={id} style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.sub}>{sub}</p>
      </div>
      <div style={styles.grid}>
        {items.map((p, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.icon}>{p.icon}</div>
            <h3 style={styles.cardTitle}>{p.title}</h3>
            <p style={styles.cardDesc}>{p.desc}</p>
            <a style={styles.link} onClick={() => document.getElementById("creditos")?.scrollIntoView({ behavior: "smooth" })}>Ver más →</a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ProductsSection() {
  return (
    <>
      <Grid id="creditos" title="Nuestros Créditos" sub="Financiamiento pensado para tu crecimiento" items={creditos} />
      <Grid id="ahorros" title="Nuestros Ahorros" sub="Haz crecer tu dinero con seguridad y respaldo" items={ahorros} />
      <Grid id="seguros" title="Nuestros Seguros" sub="Protección para ti y tu familia" items={seguros} />
      <Grid id="talleres" title="Talleres Gratuitos" sub="Fortalece tus conocimientos financieros con nosotros" items={talleres} />
    </>
  );
}

const styles = {
  section: { padding: "64px 48px", background: "#fff", scrollMarginTop: 80 },
  header: { textAlign: "center", marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "0 0 10px" },
  sub: { color: "#64748b", fontSize: 15 },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1100, margin: "0 auto" },
  card: { background: "#fff5f5", borderRadius: 16, padding: 28, border: "1px solid #fee2e2", transition: "transform 0.2s" },
  icon: { fontSize: 36, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 10px" },
  cardDesc: { fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 16 },
  link: { color: "#b91c1c", fontSize: 14, fontWeight: 600, cursor: "pointer" },
};
