const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/moraController');
const { verificarToken, soloRol } = require('../middleware/authMiddleware');

// R1 — Consulta de mora por bandas: personal de cobranza/riesgos/gerencia
router.get('/', verificarToken, soloRol('asesor','comite','admin','gerencia','riesgos'), controller.obtenerMora);

// R2 — Registro de gestión de cobranza: asesor o riesgos
router.post('/gestion', verificarToken, soloRol('asesor','riesgos','admin'), controller.registrarGestion);

// R3 — Transiciones críticas (judicial / castigo): SOLO Riesgos o Admin (no el asesor)
router.post('/judicial', verificarToken, soloRol('riesgos','admin'), controller.derivarJudicial);
router.post('/castigo',  verificarToken, soloRol('riesgos','admin'), controller.castigar);

module.exports = router;
