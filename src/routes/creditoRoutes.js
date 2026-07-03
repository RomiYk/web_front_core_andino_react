const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/creditoController');
const { verificarToken, soloRol } = require('../middleware/authMiddleware');

// El cliente solicita y consulta SU PROPIO crédito
router.post('/solicitar',          verificarToken, soloRol('cliente','asesor','admin'), controller.crearSolicitud);
router.get('/solicitudes/:userId', verificarToken, controller.obtenerSolicitudes); // verificado en el controller: solo el dueño o staff

// Panel Core — SOLO personal autorizado, nunca un 'cliente'
router.get('/todas',       verificarToken, soloRol('asesor','comite','admin','gerencia','riesgos'), controller.obtenerTodasSolicitudes);
router.post('/evaluacion', verificarToken, soloRol('asesor','admin'),                                controller.registrarEvaluacion);
router.post('/estado',     verificarToken, soloRol('asesor','comite','admin','gerencia'),            controller.actualizarEstado);

module.exports = router;
