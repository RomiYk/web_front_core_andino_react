const creditoService = require('../services/creditoService');

const ROLES_STAFF = ['asesor', 'comite', 'admin', 'gerencia', 'riesgos'];

exports.crearSolicitud = async (req, res) => {
  try {
    const { userId, monto, plazoMeses, tipoCredito } = req.body;
    if (!userId || !monto || !plazoMeses || !tipoCredito) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }
    // Un cliente solo puede solicitar crédito para sí mismo, nunca a nombre de otro userId
    if (req.user.rol === 'cliente' && req.user.id !== userId) {
      return res.status(403).json({ success: false, message: 'No puedes solicitar un crédito a nombre de otro usuario.' });
    }
    const solicitud = await creditoService.crearSolicitud(userId, monto, plazoMeses, tipoCredito);
    res.json({ success: true, data: solicitud });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.obtenerSolicitudes = async (req, res) => {
  try {
    const { userId } = req.params;
    // Un cliente solo puede ver SUS PROPIAS solicitudes; el staff puede ver cualquiera
    if (req.user.rol === 'cliente' && req.user.id !== userId) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para ver las solicitudes de otro usuario.' });
    }
    const solicitudes = await creditoService.obtenerSolicitudes(userId);
    res.json({ success: true, data: solicitudes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.obtenerTodasSolicitudes = async (req, res) => {
  try {
    const solicitudes = await creditoService.obtenerTodasSolicitudes();
    res.json({ success: true, data: solicitudes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.actualizarEstado = async (req, res) => {
  try {
    const { solicitudId, estado, motivo } = req.body;
    if (!solicitudId || !estado) {
      return res.status(400).json({ success: false, message: 'solicitudId y estado son obligatorios' });
    }

    // Regla de negocio: aprobar/rechazar solicitudes en comité requiere rol 'comite', 'gerencia' o 'admin'
    // El 'asesor' puede mover el flujo pero no dar la aprobación final de comité
    if (estado === 'aprobado' && req.user.rol === 'asesor') {
      return res.status(403).json({ success: false, message: 'Solo Comité, Gerencia o Administración pueden aprobar un crédito.' });
    }

    const solicitud = await creditoService.actualizarEstado(solicitudId, estado, motivo);
    res.json({ success: true, data: solicitud });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registrarEvaluacion = async (req, res) => {
  try {
    const { solicitudId, ingresoNeto, gastoFamiliar } = req.body;
    if (!solicitudId || ingresoNeto == null || gastoFamiliar == null) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }
    const solicitud = await creditoService.registrarEvaluacion(solicitudId, ingresoNeto, gastoFamiliar);
    res.json({ success: true, data: solicitud });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
