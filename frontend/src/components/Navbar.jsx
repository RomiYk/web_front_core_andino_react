import { useState } from "react";

const navItems = [
  { label: "Inicio",   id: "inicio" },
  { label: "Créditos", id: "creditos" },
  { label: "Ahorros",  id: "ahorros" },
  { label: "Seguros",  id: "seguros" },
  { label: "Talleres", id: "talleres" },
];

export default function Navbar({ onLogin }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const irASeccion = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMenuOpen(false);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => irASeccion("inicio")}>
        <div style={styles.logoIcon}>LA</div>
        <div>
          <div style={styles.logoName}>Los Andes</div>
          <div style={styles.logoSub}>Caja Rural de Ahorro y Crédito</div>
        </div>
      </div>
      <div style={styles.links}>
        {navItems.map(item => (
          <a key={item.id} style={styles.link} onClick={() => irASeccion(item.id)}>
            {item.label}
          </a>
        ))}
      </div>
      <button style={styles.btnLogin} onClick={onLogin}>Banca por Internet</button>
    </nav>
  );
}

const styles = {
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 48px", background: "#fff", boxShadow: "0 1px 0 #e5e7eb", position: "sticky", top: 0, zIndex: 100 },
  logo: { display: "flex", alignItems: "center", gap: 12, cursor: "pointer" },
  logoIcon: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", fontWeight: 800, fontSize: 18, borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" },
  logoName: { fontWeight: 700, fontSize: 16, color: "#b91c1c" },
  logoSub: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 },
  links: { display: "flex", gap: 32 },
  link: { color: "#374151", fontSize: 14, fontWeight: 500, cursor: "pointer", textDecoration: "none", transition: "color 0.2s" },
  btnLogin: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
};
