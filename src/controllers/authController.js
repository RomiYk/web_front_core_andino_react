const authService = require('../services/authService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'El correo y la contraseña son obligatorios.'
      });
    }

    const resultado = await authService.login(email.trim().toLowerCase(), password);
    res.json({ success: true, data: resultado });

  } catch (error) {
    // Siempre 401 para errores de credenciales (no revelar si el email existe)
    res.status(401).json({ success: false, message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'El correo y la contraseña son obligatorios.'
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres.'
      });
    }

    const resultado = await authService.register(
      email.trim().toLowerCase(),
      password,
      nombre?.trim() || 'Cliente'
    );

    res.json({
      success: true,
      data: resultado,
      message: resultado.mensaje,
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    await authService.logout();
    res.json({ success: true, message: 'Sesión cerrada.' });
  } catch (error) {
    // Logout siempre devuelve OK aunque falle (el frontend ya limpió el token)
    res.json({ success: true, message: 'Sesión cerrada.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token requerido.' });
    }
    const usuario = await authService.getUsuarioActual(token);
    res.json({ success: true, data: usuario });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
