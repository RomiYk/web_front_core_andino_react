import { useEffect } from "react";

export default function Calculadora() {
  useEffect(() => {
    // Generar botones de casos
    const CASOS = [
      {n:1,  cliente:"Castor Pérez",         monto:1000,  plazo:12, tea:43.92, desembolso:"2026-02-02", dia:3,  cuota:100.95},
      {n:2,  cliente:"Eneida Mamani",        monto:3000,  plazo:12, tea:40.92, desembolso:"2026-02-05", dia:5,  cuota:299.59},
      {n:3,  cliente:"Ovidio Torres",        monto:5000,  plazo:18, tea:43.92, desembolso:"2026-02-10", dia:10, cuota:366.02},
      {n:4,  cliente:"Dante Flores",         monto:8000,  plazo:6,  tea:43.92, desembolso:"2026-02-15", dia:15, cuota:1480.73},
      {n:5,  cliente:"Laura Mendoza",        monto:10000, plazo:12, tea:43.92, desembolso:"2026-03-01", dia:3,  cuota:1009.46},
      {n:6,  cliente:"Boccaccio Vargas",     monto:12000, plazo:24, tea:40.92, desembolso:"2026-03-05", dia:5,  cuota:700.94},
      {n:7,  cliente:"Orlando Ríos",         monto:15000, plazo:18, tea:43.92, desembolso:"2026-03-10", dia:10, cuota:1098.07},
      {n:8,  cliente:"Gerusalemme Huanca",   monto:18000, plazo:24, tea:43.92, desembolso:"2026-03-15", dia:15, cuota:1072.10},
      {n:9,  cliente:"Pedro Calderón",       monto:20000, plazo:36, tea:43.92, desembolso:"2026-04-02", dia:3,  cuota:927.12},
      {n:10, cliente:"Félix Chávez",         monto:25000, plazo:24, tea:40.92, desembolso:"2026-04-05", dia:5,  cuota:1460.29},
      {n:11, cliente:"Hildegarda Huanca",    monto:2000,  plazo:12, tea:43.92, desembolso:"2026-04-10", dia:10, cuota:201.89},
      {n:12, cliente:"Stendhal Aguilar",     monto:4000,  plazo:18, tea:43.92, desembolso:"2026-04-15", dia:15, cuota:292.82},
      {n:13, cliente:"Kipling Soto",         monto:6000,  plazo:12, tea:40.92, desembolso:"2026-05-02", dia:3,  cuota:599.17},
      {n:14, cliente:"Erinná Espinoza",      monto:7500,  plazo:6,  tea:43.92, desembolso:"2026-05-05", dia:5,  cuota:1388.18},
      {n:15, cliente:"Annie Espinoza",       monto:9000,  plazo:24, tea:43.92, desembolso:"2026-05-10", dia:10, cuota:536.05},
      {n:16, cliente:"Homero Quispe",        monto:11000, plazo:18, tea:40.92, desembolso:"2026-05-15", dia:15, cuota:793.03},
      {n:17, cliente:"Virgilio Mamani",      monto:13500, plazo:12, tea:43.92, desembolso:"2026-06-02", dia:3,  cuota:1362.77},
      {n:18, cliente:"Ovidio Torres",        monto:16000, plazo:36, tea:43.92, desembolso:"2026-06-05", dia:5,  cuota:741.70},
      {n:19, cliente:"Dante Flores",         monto:17000, plazo:24, tea:40.92, desembolso:"2026-06-10", dia:10, cuota:993.00},
      {n:20, cliente:"Laura Mendoza",        monto:19000, plazo:18, tea:43.92, desembolso:"2026-06-15", dia:15, cuota:1390.89},
      {n:21, cliente:"Boccaccio Vargas",     monto:22000, plazo:36, tea:43.92, desembolso:"2026-07-02", dia:3,  cuota:1019.83},
      {n:22, cliente:"Orlando Ríos",         monto:24000, plazo:24, tea:40.92, desembolso:"2026-07-05", dia:5,  cuota:1401.88},
      {n:23, cliente:"Gerusalemme Huanca",   monto:1500,  plazo:6,  tea:43.92, desembolso:"2026-07-10", dia:10, cuota:277.64},
      {n:24, cliente:"Pedro Calderón",       monto:3500,  plazo:12, tea:43.92, desembolso:"2026-07-15", dia:15, cuota:353.31},
      {n:25, cliente:"Félix Chávez",         monto:5500,  plazo:18, tea:40.92, desembolso:"2026-08-02", dia:3,  cuota:396.52},
      {n:26, cliente:"Hildegarda Huanca",    monto:7000,  plazo:24, tea:43.92, desembolso:"2026-08-05", dia:5,  cuota:416.93},
      {n:27, cliente:"Stendhal Aguilar",     monto:8500,  plazo:12, tea:43.92, desembolso:"2026-08-10", dia:10, cuota:858.04},
      {n:28, cliente:"Kipling Soto",         monto:10500, plazo:36, tea:40.92, desembolso:"2026-08-15", dia:15, cuota:473.77},
      {n:29, cliente:"Erinná Espinoza",      monto:14000, plazo:18, tea:43.92, desembolso:"2026-09-02", dia:3,  cuota:1024.87},
      {n:30, cliente:"Annie Espinoza",       monto:30000, plazo:24, tea:43.92, desembolso:"2026-09-05", dia:5,  cuota:1786.83},
    ];

    window.CASOS = CASOS;
    window.teaActual = 40.92;

    const tabs = document.getElementById('casosTabs');
    if (!tabs) return;
    tabs.innerHTML = '';
    CASOS.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'caso-btn';
      btn.textContent = `C${c.n}`;
      btn.title = `${c.cliente} · S/ ${c.monto.toLocaleString()}`;
      btn.onclick = () => window.cargarCaso(c, btn);
      tabs.appendChild(btn);
    });

    document.getElementById('fdesembolso').value = new Date().toISOString().split('T')[0];
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .calc-page { font-family: 'Inter', sans-serif; background: #F7FAFC; min-height: 100vh; }
        .calc-header { background: linear-gradient(135deg, #7f1d1d 0%, #b91c1c 60%, #ef4444 100%); padding: 0; position: relative; overflow: hidden; }
        .calc-header::before { content: ''; position: absolute; top: -40px; right: -60px; width: 280px; height: 280px; background: rgba(255,255,255,0.05); border-radius: 50%; }
        .header-inner { max-width: 1100px; margin: 0 auto; padding: 28px 32px 24px; display: flex; align-items: center; gap: 20px; position: relative; z-index: 1; }
        .logo-mark { width: 52px; height: 52px; background: rgba(255,255,255,0.25); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: #fff; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .header-text h1 { font-size: 1.5rem; font-weight: 700; color: #fff; }
        .header-text p { font-size: 0.82rem; color: #f87171; margin-top: 2px; }
        .badge { margin-left: auto; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 0.72rem; font-weight: 600; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; }
        .btn-volver { margin-left: 12px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: #fff; font-size: 0.8rem; font-weight: 600; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
        .calc-main { max-width: 1100px; margin: 0 auto; padding: 28px 20px 48px; display: grid; grid-template-columns: 340px 1fr; gap: 24px; align-items: start; }
        .panel { background: #fff; border-radius: 16px; box-shadow: 0 2px 16px rgba(0,58,107,0.08); overflow: hidden; }
        .panel-head { background: #7f1d1d; padding: 16px 20px; color: #fff; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
        .casos-tabs { padding: 14px; display: flex; flex-wrap: wrap; gap: 6px; max-height: 220px; overflow-y: auto; }
        .caso-btn { padding: 5px 10px; border-radius: 8px; border: 1.5px solid #CBD5E0; background: #F7FAFC; color: #2D3748; font-size: 0.72rem; font-weight: 500; cursor: pointer; font-family: 'JetBrains Mono', monospace; }
        .caso-btn:hover { border-color: #ef4444; color: #ef4444; }
        .caso-btn.active { background: #ef4444; border-color: #ef4444; color: #fff; font-weight: 600; }
        .form-section { padding: 16px 20px 20px; border-top: 1px solid #CBD5E0; }
        .form-section h3 { font-size: 0.78rem; font-weight: 600; color: #7f1d1d; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 14px; }
        .field { margin-bottom: 12px; }
        .field label { display: block; font-size: 0.73rem; font-weight: 600; color: #4A5568; margin-bottom: 5px; }
        .field input, .field select { width: 100%; padding: 8px 12px; border: 1.5px solid #CBD5E0; border-radius: 8px; font-size: 0.85rem; color: #2D3748; background: #fff; outline: none; }
        .field input:focus, .field select:focus { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
        .field input[readonly] { background: #F7FAFC; color: #718096; }
        .tea-pills { display: flex; gap: 8px; margin-top: 4px; }
        .tea-pill { flex: 1; padding: 7px 0; border-radius: 8px; border: 1.5px solid #CBD5E0; background: #F7FAFC; font-size: 0.72rem; font-weight: 600; cursor: pointer; text-align: center; color: #4A5568; }
        .tea-pill.active { background: #7f1d1d; border-color: #7f1d1d; color: #fff; }
        .btn-calcular { width: 100%; padding: 12px; background: linear-gradient(135deg, #ef4444, #b91c1c); color: #fff; border: none; border-radius: 10px; font-size: 0.9rem; font-weight: 700; cursor: pointer; margin-top: 4px; }
        .resultado-panel { display: flex; flex-direction: column; gap: 20px; }
        .resumen-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .kpi-card { background: #fff; border-radius: 14px; padding: 18px 16px; box-shadow: 0 2px 12px rgba(127,29,29,0.07); border-left: 4px solid #ef4444; }
        .kpi-card.gold { border-left-color: #b91c1c; }
        .kpi-card.dark { border-left-color: #7f1d1d; }
        .kpi-label { font-size: 0.68rem; font-weight: 600; color: #718096; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; }
        .kpi-value { font-size: 1.45rem; font-weight: 700; color: #7f1d1d; font-family: 'JetBrains Mono', monospace; }
        .kpi-sub { font-size: 0.7rem; color: #A0AEC0; margin-top: 3px; }
        .caso-info { background: #fee2e2; border: 1.5px solid #b91c1c; border-radius: 12px; padding: 12px 16px; font-size: 0.78rem; color: #7f1d1d; display: flex; align-items: center; gap: 10px; }
        .tabla-panel { background: #fff; border-radius: 16px; box-shadow: 0 2px 16px rgba(0,58,107,0.08); overflow: hidden; }
        .tabla-header { background: linear-gradient(90deg, #7f1d1d, #b91c1c); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; }
        .tabla-header h2 { font-size: 0.85rem; font-weight: 700; color: #fff; }
        .cuotas-count { background: rgba(255,255,255,0.15); color: #f87171; font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: 12px; }
        .tabla-wrap { overflow-x: auto; max-height: 380px; overflow-y: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
        thead th { background: #fef2f2; color: #7f1d1d; font-weight: 700; padding: 10px 14px; text-align: right; font-size: 0.7rem; text-transform: uppercase; position: sticky; top: 0; border-bottom: 2px solid #ef4444; }
        thead th:first-child { text-align: center; }
        tbody tr { border-bottom: 1px solid #EDF2F7; }
        tbody tr:hover { background: #fef2f2; }
        tbody tr:last-child { background: #EBF8FF; font-weight: 700; }
        td { padding: 9px 14px; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #2D3748; }
        td:first-child { text-align: center; font-weight: 700; color: #ef4444; }
        td.fecha { font-family: 'Inter', sans-serif; font-size: 0.72rem; color: #718096; text-align: left; }
        td.interes { color: #E53E3E; }
        td.capital { color: #38A169; }
        td.saldo { color: #7f1d1d; font-weight: 600; }
        .placeholder { padding: 60px 20px; text-align: center; color: #A0AEC0; }
        .pie { padding: 10px 20px 14px; background: #F7FAFC; border-top: 1px solid #CBD5E0; display: flex; justify-content: space-between; font-size: 0.7rem; color: #A0AEC0; font-family: 'JetBrains Mono', monospace; }
      </style>

      <div class="calc-page">
        <div class="calc-header">
          <div class="header-inner">
            <div class="logo-mark">LA</div>
            <div class="header-text">
              <h1>Los Andes · Crédito Empresarial</h1>
              <p>Calculadora de cuota fija — Micro Micro · Sistema de Práctica (30 casos)</p>
            </div>
            <button class="btn-volver" onclick="window.location.href='/dashboard'">← Dashboard</button>
            <div class="badge">Los Andes · Proyecto Académico</div>
          </div>
        </div>

        <div class="calc-main">
          <div>
            <div class="panel">
              <div class="panel-head"><span>📋</span> Casos del Enunciado</div>
              <div class="casos-tabs" id="casosTabs"></div>
              <div class="form-section">
                <h3>Datos del Crédito</h3>
                <div class="field"><label>Cliente</label><input type="text" id="cliente" placeholder="Nombre del cliente" /></div>
                <div class="field"><label>Monto del Préstamo (S/)</label><input type="number" id="monto" placeholder="Ej: 10000" min="100" step="100" /></div>
                <div class="field"><label>Plazo (meses)</label><select id="plazo"><option value="6">6 meses</option><option value="12" selected>12 meses</option><option value="18">18 meses</option><option value="24">24 meses</option><option value="36">36 meses</option></select></div>
                <div class="field">
                  <label>TEA (%)</label>
                  <div class="tea-pills">
                    <div class="tea-pill active" data-tea="40.92" onclick="window.selTEA(this)">40.92% · Con seguro</div>
                    <div class="tea-pill" data-tea="43.92" onclick="window.selTEA(this)">43.92% · Sin seguro</div>
                  </div>
                  <input type="number" id="tea" value="40.92" step="0.01" style="margin-top:8px;" readonly />
                </div>
                <div class="field"><label>Fecha de desembolso</label><input type="date" id="fdesembolso" /></div>
                <div class="field"><label>Día de pago (cada mes)</label><input type="number" id="diaPago" placeholder="Ej: 5" min="1" max="28" /></div>
                <button class="btn-calcular" onclick="window.calcular()">Calcular Cronograma →</button>
              </div>
            </div>
          </div>

          <div class="resultado-panel">
            <div class="resumen-grid" id="resumenGrid" style="display:none;">
              <div class="kpi-card"><div class="kpi-label">Cuota Mensual</div><div class="kpi-value" id="kpiCuota">—</div><div class="kpi-sub">Cuota fija igual</div></div>
              <div class="kpi-card gold"><div class="kpi-label">Total a Pagar</div><div class="kpi-value" id="kpiTotal">—</div><div class="kpi-sub" id="kpiTotalSub">—</div></div>
              <div class="kpi-card dark"><div class="kpi-label">Total Intereses</div><div class="kpi-value" id="kpiIntereses">—</div><div class="kpi-sub" id="kpiTasa">—</div></div>
            </div>
            <div id="casoInfoBar" style="display:none;" class="caso-info"><span>📌</span><div id="casoInfoText"></div></div>
            <div class="tabla-panel">
              <div class="tabla-header"><h2>Cronograma de Pagos</h2><div class="cuotas-count" id="cuotasCount">— cuotas</div></div>
              <div class="tabla-wrap" id="tablaWrap"><div class="placeholder"><div style="font-size:3rem">📊</div><h3>Ingresa los datos y calcula</h3><p>O selecciona uno de los 30 casos del enunciado</p></div></div>
              <div class="pie" id="pieTabla" style="display:none;"><span>Los Andes · Caja Rural de Ahorro y Crédito</span><span>TEA <span id="pieTEA"></span>% · <span id="piePlazo"></span> cuotas</span></div>
            </div>
          </div>
        </div>
      </div>

      <script>
        window.teaActual = 40.92;
        window.selTEA = function(el) {
          document.querySelectorAll('.tea-pill').forEach(p => p.classList.remove('active'));
          el.classList.add('active');
          window.teaActual = parseFloat(el.dataset.tea);
          document.getElementById('tea').value = window.teaActual;
        };
        window.cargarCaso = function(c, btn) {
          document.querySelectorAll('.caso-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          document.getElementById('cliente').value = c.cliente;
          document.getElementById('monto').value = c.monto;
          document.getElementById('plazo').value = c.plazo;
          document.getElementById('fdesembolso').value = c.desembolso;
          document.getElementById('diaPago').value = c.dia;
          window.teaActual = c.tea;
          document.getElementById('tea').value = c.tea;
          document.querySelectorAll('.tea-pill').forEach(p => { p.classList.toggle('active', parseFloat(p.dataset.tea) === c.tea); });
          const infoBar = document.getElementById('casoInfoBar');
          document.getElementById('casoInfoText').innerHTML = '<strong>Caso ' + c.n + ' — ' + c.cliente + '</strong> · Cuota esperada: <strong>S/ ' + c.cuota.toFixed(2) + '</strong>';
          infoBar.style.display = 'flex';
          window.calcular(c.cuota);
        };
        window.calcular = function(cuotaRef) {
          const monto = parseFloat(document.getElementById('monto').value);
          const plazo = parseInt(document.getElementById('plazo').value);
          const tea = parseFloat(document.getElementById('tea').value) / 100;
          const dFecha = document.getElementById('fdesembolso').value;
          const diaPago = parseInt(document.getElementById('diaPago').value);
          if (!monto || !plazo || !tea || !dFecha || !diaPago) { alert('Completa todos los campos'); return; }
          const tem = Math.pow(1 + tea, 1/12) - 1;
          const cuota = monto * tem / (1 - Math.pow(1 + tem, -plazo));
          const fechas = [];
          const base = new Date(dFecha + 'T12:00:00');
          let mes = base.getMonth() + 1; let anio = base.getFullYear();
          for (let i = 0; i < plazo; i++) { mes++; if (mes > 12) { mes = 1; anio++; } fechas.push(new Date(anio, mes - 1, diaPago)); }
          let saldo = monto; const filas = []; let totalInteres = 0;
          for (let i = 0; i < plazo; i++) {
            const interes = saldo * tem; const capital = cuota - interes; saldo = saldo - capital;
            if (i === plazo - 1) saldo = 0; totalInteres += interes;
            filas.push({ n: i+1, fecha: fechas[i], cuota, capital, interes, saldo: Math.max(0, saldo) });
          }
          const totalPagar = cuota * plazo;
          document.getElementById('kpiCuota').textContent = 'S/ ' + fmt(cuota);
          document.getElementById('kpiTotal').textContent = 'S/ ' + fmt(totalPagar);
          document.getElementById('kpiTotalSub').textContent = plazo + ' cuotas × S/ ' + fmt(cuota);
          document.getElementById('kpiIntereses').textContent = 'S/ ' + fmt(totalInteres);
          document.getElementById('kpiTasa').textContent = 'TEA ' + (tea*100).toFixed(2) + '% · TEM ' + (tem*100).toFixed(4) + '%';
          document.getElementById('resumenGrid').style.display = 'grid';
          if (cuotaRef) {
            const dif = Math.abs(cuota - cuotaRef);
            const match = dif < 0.50;
            document.getElementById('casoInfoText').innerHTML += ' · Calculado: <strong>S/ ' + fmt(cuota) + '</strong> ' + (match ? '<span style="color:#276749">✓ Coincide (±S/ ' + dif.toFixed(2) + ')</span>' : '<span style="color:#c53030">⚠ Diferencia S/ ' + dif.toFixed(2) + '</span>');
          }
          let html = '<table><thead><tr><th>N°</th><th style="text-align:left">Fecha Pago</th><th>Cuota</th><th>Capital</th><th>Interés</th><th>Saldo</th></tr></thead><tbody>';
          filas.forEach(f => { html += '<tr><td>' + f.n + '</td><td class="fecha">' + f.fecha.toLocaleDateString("es-PE",{day:"2-digit",month:"2-digit",year:"numeric"}) + '</td><td>S/ ' + fmt(f.cuota) + '</td><td class="capital">S/ ' + fmt(f.capital) + '</td><td class="interes">S/ ' + fmt(f.interes) + '</td><td class="saldo">S/ ' + fmt(f.saldo) + '</td></tr>'; });
          html += '<tr><td>—</td><td class="fecha" style="font-weight:700">TOTALES</td><td>S/ ' + fmt(totalPagar) + '</td><td class="capital">S/ ' + fmt(monto) + '</td><td class="interes">S/ ' + fmt(totalInteres) + '</td><td class="saldo">S/ 0.00</td></tr></tbody></table>';
          document.getElementById('tablaWrap').innerHTML = html;
          document.getElementById('cuotasCount').textContent = plazo + ' cuotas';
          document.getElementById('pieTabla').style.display = 'flex';
          document.getElementById('pieTEA').textContent = (tea*100).toFixed(2);
          document.getElementById('piePlazo').textContent = plazo;
        };
        function fmt(n) { return n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
      <\/script>
    ` }} />
  );
}
