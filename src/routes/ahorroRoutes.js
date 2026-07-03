const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/ahorroController');
const { verificarToken, soloRol } = require('../middleware/authMiddleware');

router.get('/cuenta/:userId', verificarToken, controller.obtenerCuenta); // verificado en controller: dueño o staff
router.get('/movimientos/:userId', verificarToken, controller.obtenerMovimientos); // verificado en controller: dueño o staff
router.post('/crear',         verificarToken, soloRol('cliente','asesor','admin'), controller.crearCuenta);
router.post('/depositar',     verificarToken, soloRol('cliente','asesor','admin'), controller.depositar);
router.get('/todas',          verificarToken, soloRol('asesor','comite','admin','gerencia','riesgos'), controller.obtenerTodasCuentas);

module.exports = router;
