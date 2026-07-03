const ahorroService = require('../services/ahorroService');
const ROLES_STAFF = ['asesor', 'comite', 'admin', 'gerencia', 'riesgos'];

exports.obtenerCuenta = async (req, res) => {
  try {
    const { userId } = req.params;
    // Un cliente solo puede ver SU PROPIA cuenta; el staff puede ver cualquiera
    if (req.user.rol === 'cliente' && req.user.id !== userId) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para ver la cuenta de otro usuario.' });
    }
    const cuenta = await ahorroService.obtenerCuenta(userId);
    res.json({ success: true, data: cuenta });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.crearCuenta = async (req, res) => {
  try {
    const { userId, metaAhorro } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId requerido' });
    const cuenta = await ahorroService.crearCuenta(userId, metaAhorro || 0);
    res.json({ success: true, data: cuenta });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.depositar = async (req, res) => {
  try {
    const { userId, monto } = req.body;
    if (!userId || !monto) return res.status(400).json({ success: false, message: 'userId y monto requeridos' });
    const cuenta = await ahorroService.depositar(userId, monto);
    res.json({ success: true, data: cuenta });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.obtenerTodasCuentas = async (req, res) => {
  try {
    const cuentas = await ahorroService.obtenerTodasCuentas();
    res.json({ success: true, data: cuentas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.obtenerMovimientos = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.rol === 'cliente' && req.user.id !== userId) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para ver los movimientos de otro usuario.' });
    }
    const movimientos = await ahorroService.obtenerMovimientos(userId);
    res.json({ success: true, data: movimientos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
