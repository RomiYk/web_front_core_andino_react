import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ModalSolicitud({ onClose, userId, onExito }) {
  const [form, setForm] = useState({ monto: "", plazoMeses: "12", tipoCredito: "empresarial" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/credito/solicitar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          monto: parseFloat(form.monto),
          plazoMeses: parseInt(form.plazoMeses),
          tipoCredito: form.tipoCredito
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Error al enviar solicitud");
      onExito && onExito();
      onClose();
    } catch (err) {
      setError(err.message || "Error de conexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Nueva Solicitud de Credito</h3>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Tipo de Credito</label>
            <select style={styles.input} value={form.tipoCredito} onChange={(e) => setForm({...form, tipoCredito: e.target.value})}>
              <option value="empresarial">Empresarial (TEA 43.92%)</option>
              <option value="personal">Personal (TEA 40.92%)</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Monto solicitado (S/)</label>
            <input type="number" required style={styles.input} placeholder="Ej: 5000" value={form.monto} onChange={(e) => setForm({...form, monto: e.target.value})} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Plazo (meses)</label>
            <select style={styles.input} value={form.plazoMeses} onChange={(e) => setForm({...form, plazoMeses: e.target.value})}>
              <option value="6">6 meses</option>
              <option value="12">12 meses</option>
              <option value="24">24 meses</option>
              <option value="36">36 meses</option>
              <option value="48">48 meses</option>
              <option value="60">60 meses</option>
            </select>
          </div>
          <div style={styles.btns}>
            <button type="button" style={styles.btnCancel} onClick={onClose}>Cancelar</button>
            <button type="submit" style={{...styles.btnSubmit, opacity: loading ? 0.7 : 1}} disabled={loading}>
              {loading ? "Enviando..." : "Enviar Solicitud"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", borderRadius: 20, padding: 40, width: "100%", maxWidth: 440, boxShadow: "0 25px 80px rgba(0,0,0,0.3)" },
  title: { fontSize: 20, fontWeight: 700, color: "#0f172a", margin: "0 0 20px" },
  error: { background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16, border: "1px solid #fecaca" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: "#374151" },
  input: { padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none" },
  btns: { display: "flex", gap: 12, marginTop: 8 },
  btnCancel: { flex: 1, padding: "12px 0", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 14, cursor: "pointer" },
  btnSubmit: { flex: 1, padding: "12px 0", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" },
};