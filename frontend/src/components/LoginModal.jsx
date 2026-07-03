import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function LoginModal({ open, onClose }) {
  const [tab, setTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ nombre: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginData.email, password: loginData.password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Credenciales incorrectas");
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("usuario", JSON.stringify(data.data.usuario));
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Error al iniciar sesion. Verifica tus datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (registerData.password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Error al registrarse");

      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registerData.email, password: registerData.password }),
      });
      const loginData = await loginRes.json();

      if (loginRes.ok && loginData.success) {
        localStorage.setItem("token", loginData.data.token);
        localStorage.setItem("usuario", JSON.stringify(loginData.data.usuario));
        window.location.href = "/dashboard";
        return;
      }

      setSuccess("Cuenta creada! Revisa tu correo para confirmar tu cuenta y luego inicia sesion.");
      setRegisterData({ nombre: "", email: "", password: "" });
      setTimeout(() => setTab("login"), 3000);
    } catch (err) {
      setError(err.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.leftPanel}>
          <div style={styles.brandIcon}>LA</div>
          <h2 style={styles.brandTitle}>Los Andes</h2>
          <p style={styles.brandSub}>Banca por Internet</p>
          <div style={styles.features}>
            {["Conexion cifrada SSL","Supervisado por la SBS","Acceso 24/7","Inclusion financiera"].map(f => (
              <div key={f} style={styles.feature}>{f}</div>
            ))}
          </div>
          <div style={styles.ruc}>
            <p style={styles.rucText}>RUC N. 20322445564</p>
            <p style={styles.rucText}>Caja Rural de Ahorro y Credito Los Andes S.A.</p>
          </div>
        </div>
        <div style={styles.rightPanel}>
          <button style={styles.closeBtn} onClick={onClose} title="Cerrar">x</button>
          <h3 style={styles.formTitle}>{tab === "login" ? "Iniciar sesion" : "Crear cuenta"}</h3>
          <div style={styles.tabs}>
            <button style={{ ...styles.tab, ...(tab === "login" ? styles.tabActive : {}) }} onClick={() => { setTab("login"); setError(""); setSuccess(""); }}>Ingresar</button>
            <button style={{ ...styles.tab, ...(tab === "register" ? styles.tabActive : {}) }} onClick={() => { setTab("register"); setError(""); setSuccess(""); }}>Registrarme</button>
          </div>
          {error   && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.successMsg}>{success}</div>}
          {tab === "login" && (
            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Correo electronico</label>
                <input type="email" required style={styles.input} placeholder="tu@correo.com" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Contrasena</label>
                <input type="password" required style={styles.input} placeholder="........" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
              </div>
              <a style={styles.forgot}>Olvidaste tu contrasena?</a>
              <button type="submit" style={{ ...styles.btnSubmit, opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? "Verificando..." : "Ingresar a mi cuenta"}</button>
              <p style={styles.hint}>Usa el email y contrasena de tu cuenta Supabase</p>
            </form>
          )}
          {tab === "register" && (
            <form onSubmit={handleRegister} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Nombre completo</label>
                <input type="text" required style={styles.input} placeholder="Juan Perez" value={registerData.nombre} onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Correo electronico</label>
                <input type="email" required style={styles.input} placeholder="tu@correo.com" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Contrasena (minimo 6 caracteres)</label>
                <input type="password" required minLength={6} style={styles.input} placeholder="........" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
              </div>
              <button type="submit" style={{ ...styles.btnSubmit, opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? "Creando cuenta..." : "Crear cuenta"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" },
  modal: { display: "flex", borderRadius: 24, overflow: "hidden", width: "100%", maxWidth: 780, maxHeight: "95vh", boxShadow: "0 25px 80px rgba(0,0,0,0.35)" },
  leftPanel: { background: "linear-gradient(160deg, #7f1d1d, #b91c1c, #ef4444)", padding: 40, width: 270, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 },
  brandIcon: { background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 800, fontSize: 26, borderRadius: 16, width: 68, height: 68, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  brandTitle: { color: "#fff", fontSize: 24, fontWeight: 800, margin: 0 },
  brandSub: { color: "rgba(255,255,255,0.8)", fontSize: 13, margin: 0 },
  features: { marginTop: 20, display: "flex", flexDirection: "column", gap: 8, width: "100%" },
  feature: { color: "rgba(255,255,255,0.9)", fontSize: 12, padding: "8px 12px", background: "rgba(255,255,255,0.12)", borderRadius: 8 },
  ruc: { marginTop: 20, textAlign: "center" },
  rucText: { color: "rgba(255,255,255,0.55)", fontSize: 10, margin: "2px 0" },
  rightPanel: { background: "#fff", padding: "36px 40px", flex: 1, position: "relative", overflowY: "auto" },
  closeBtn: { position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#94a3b8", lineHeight: 1 },
  formTitle: { fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 20px" },
  tabs: { display: "flex", background: "#f1f5f9", borderRadius: 10, padding: 4, marginBottom: 20 },
  tab: { flex: 1, padding: "9px 0", border: "none", borderRadius: 8, background: "none", cursor: "pointer", fontWeight: 500, color: "#64748b", fontSize: 14, transition: "all 0.2s" },
  tabActive: { background: "#fff", color: "#0f172a", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", fontWeight: 600 },
  error: { background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16, border: "1px solid #fecaca" },
  successMsg: { background: "#ecfdf5", color: "#065f46", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16, border: "1px solid #a7f3d0" },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: "#374151" },
  input: { padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", transition: "border 0.2s", fontFamily: "inherit" },
  forgot: { color: "#b91c1c", fontSize: 12, cursor: "pointer", textAlign: "right", marginTop: -4, fontWeight: 500 },
  btnSubmit: { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 4, transition: "opacity 0.2s" },
  hint: { fontSize: 11, color: "#94a3b8", textAlign: "center", margin: "4px 0 0" },
};