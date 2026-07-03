const moraService = require('../services/moraService');

exports.obtenerMora = async (req, res) => {
  try {
    const data = await moraService.obtenerMora();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registrarGestion = async (req, res) => {
  try {
    const { moraId, observaciones } = req.body;
    const data = await moraService.registrarGestion(moraId, observaciones);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.derivarJudicial = async (req, res) => {
  try {
    const { moraId } = req.body;
    const data = await moraService.derivarJudicial(moraId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.castigar = async (req, res) => {
  try {
    const { moraId } = req.body;
    const data = await moraService.castigar(moraId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
