import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductsSection from "../components/ProductsSection";
import LoginModal from "../components/LoginModal";
import { useState } from "react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div id="inicio" style={{ fontFamily: "'Segoe UI', sans-serif", background: "#fff" }}>
      <Navbar onLogin={() => setModalOpen(true)} />
      <Hero onLogin={() => setModalOpen(true)} />
      <ProductsSection />
      <InfoSection />
      <Footer onLogin={() => setModalOpen(true)} />
      <LoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

function InfoSection() {
  return (
    <section style={styles.infoSection}>
      <div style={styles.infoGrid}>
        <div style={styles.infoCard}>
          <div style={styles.infoIcon}>📱</div>
          <h3 style={styles.infoTitle}>APP Los Andes Perú</h3>
          <p style={styles.infoDesc}>Descarga nuestra app y gestiona tus cuentas, paga tu crédito y consulta tu saldo desde donde estés.</p>
          <a href="https://losandes.pe/app/" target="_blank" rel="noreferrer" style={styles.infoLink}>Descargar App →</a>
        </div>
        <div style={styles.infoCard}>
          <div style={styles.infoIcon}>💬</div>
          <h3 style={styles.infoTitle}>WhatsApp</h3>
          <p style={styles.infoDesc}>Escríbenos directamente por WhatsApp y recibe atención personalizada sobre nuestros productos financieros.</p>
          <a href="https://api.whatsapp.com/send?phone=+51958315946" target="_blank" rel="noreferrer" style={styles.infoLink}>Escribir ahora →</a>
        </div>
        <div style={styles.infoCard}>
          <div style={styles.infoIcon}>📍</div>
          <h3 style={styles.infoTitle}>Nuestras Oficinas</h3>
          <p style={styles.infoDesc}>Más de 60 oficinas a nivel nacional. Encuéntranos cerca de ti y habla con uno de nuestros asesores.</p>
          <a href="https://losandes.pe/ubicacion/" target="_blank" rel="noreferrer" style={styles.infoLink}>Ver oficinas →</a>
        </div>
        <div style={styles.infoCard}>
          <div style={styles.infoIcon}>💳</div>
          <h3 style={styles.infoTitle}>Paga tu cuota</h3>
          <p style={styles.infoDesc}>Paga tu crédito fácilmente por internet, agentes corresponsales o en cualquiera de nuestras oficinas.</p>
          <a href="https://pagafacil.losandes.pe" target="_blank" rel="noreferrer" style={styles.infoLink}>Pagar ahora →</a>
        </div>
      </div>
    </section>
  );
}

function Footer({ onLogin }) {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerTop}>
        <div style={styles.footerBrand}>
          <div style={styles.footerLogo}>LA</div>
          <div>
            <div style={styles.footerName}>Los Andes</div>
            <div style={styles.footerSub}>Caja Rural de Ahorro y Crédito</div>
          </div>
        </div>
        <div style={styles.footerLinks}>
          <div style={styles.footerCol}>
            <div style={styles.footerColTitle}>Créditos</div>
            <a style={styles.footerLink} onClick={() => document.getElementById("creditos")?.scrollIntoView({ behavior: "smooth" })}>Agropecuario</a>
            <a style={styles.footerLink} onClick={() => document.getElementById("creditos")?.scrollIntoView({ behavior: "smooth" })}>PYME</a>
            <a style={styles.footerLink} onClick={() => document.getElementById("creditos")?.scrollIntoView({ behavior: "smooth" })}>Personal</a>
            <a style={styles.footerLink} onClick={() => document.getElementById("creditos")?.scrollIntoView({ behavior: "smooth" })}>Mujer Luchadora</a>
          </div>
          <div style={styles.footerCol}>
            <div style={styles.footerColTitle}>Ahorros</div>
            <a style={styles.footerLink} onClick={() => document.getElementById("ahorros")?.scrollIntoView({ behavior: "smooth" })}>Ahorro Normal</a>
            <a style={styles.footerLink} onClick={() => document.getElementById("ahorros")?.scrollIntoView({ behavior: "smooth" })}>Ahorro Meta</a>
            <a style={styles.footerLink} onClick={() => document.getElementById("ahorros")?.scrollIntoView({ behavior: "smooth" })}>Depósito a Plazo Fijo</a>
            <a style={styles.footerLink} onClick={() => document.getElementById("ahorros")?.scrollIntoView({ behavior: "smooth" })}>Cuenta CTS</a>
          </div>
          <div style={styles.footerCol}>
            <div style={styles.footerColTitle}>Seguros</div>
            <a style={styles.footerLink} onClick={() => document.getElementById("seguros")?.scrollIntoView({ behavior: "smooth" })}>Desgravamen</a>
            <a style={styles.footerLink} onClick={() => document.getElementById("seguros")?.scrollIntoView({ behavior: "smooth" })}>Microseguro de Vida</a>
            <a style={styles.footerLink} onClick={() => document.getElementById("seguros")?.scrollIntoView({ behavior: "smooth" })}>SOAT</a>
            <a style={styles.footerLink} onClick={() => document.getElementById("seguros")?.scrollIntoView({ behavior: "smooth" })}>Seguro Oncológico</a>
          </div>
          <div style={styles.footerCol}>
            <div style={styles.footerColTitle}>Atención</div>
            <a style={styles.footerLink} href="https://api.whatsapp.com/send?phone=+51958315946" target="_blank" rel="noreferrer">Contáctanos</a>
            <a style={styles.footerLink} href="https://losandes.pe/ubicacion/" target="_blank" rel="noreferrer">Nuestras Oficinas</a>
            <a style={styles.footerLink} href="https://pagafacil.losandes.pe" target="_blank" rel="noreferrer">Canales de Pago</a>
            <button style={styles.footerBtn} onClick={onLogin}>Banca por Internet</button>
          </div>
        </div>
      </div>
      <div style={styles.footerBottom}>
        <span>© {new Date().getFullYear()} Caja Rural de Ahorro y Crédito Los Andes S.A. — RUC N.° 20322445564</span>
        <span>Supervisado por la SBS · Fondo de Seguro de Depósitos</span>
      </div>
    </footer>
  );
}

const styles = {
  infoSection: { padding: "64px 48px", background: "#fff5f5" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, maxWidth: 1100, margin: "0 auto" },
  infoCard: { background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #fee2e2", display: "flex", flexDirection: "column", gap: 8 },
  infoIcon: { fontSize: 32, marginBottom: 4 },
  infoTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 },
  infoDesc: { fontSize: 13, color: "#64748b", lineHeight: 1.6, flexGrow: 1 },
  infoLink: { color: "#b91c1c", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none" },
  footer: { background: "#1a0a0a", color: "#fff" },
  footerTop: { display: "flex", justifyContent: "space-between", padding: "48px 48px 32px", gap: 40, flexWrap: "wrap" },
  footerBrand: { display: "flex", alignItems: "center", gap: 12, alignSelf: "flex-start" },
  footerLogo: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", fontWeight: 800, fontSize: 20, borderRadius: 10, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" },
  footerName: { fontWeight: 700, fontSize: 18, color: "#fff" },
  footerSub: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  footerLinks: { display: "flex", gap: 48, flexWrap: "wrap" },
  footerCol: { display: "flex", flexDirection: "column", gap: 8 },
  footerColTitle: { fontWeight: 700, fontSize: 13, color: "#e2e8f0", marginBottom: 4 },
  footerLink: { fontSize: 13, color: "#94a3b8", cursor: "pointer", textDecoration: "none", transition: "color 0.2s" },
  footerBtn: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 4, width: "fit-content" },
  footerBottom: { borderTop: "1px solid #2d1a1a", padding: "20px 48px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontSize: 12, color: "#64748b" },
};
