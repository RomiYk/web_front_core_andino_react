const { createClient } = require('@supabase/supabase-js');

// Cliente admin para consultas internas
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token requerido. Inicia sesión nuevamente.' });
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ success: false, message: 'Sesión expirada. Inicia sesión nuevamente.' });
    }

    // Buscar rol del usuario — si no existe la tabla o no tiene rol, se asigna 'cliente'
    let rol = 'cliente';
    try {
      const { data: rolData } = await supabaseAdmin
        .from('roles_usuario')
        .select('rol')
        .eq('user_id', data.user.id)
        .maybeSingle();
      if (rolData?.rol) rol = rolData.rol;
    } catch (_) {
      // Si la tabla no existe aún, seguimos como cliente
    }

    req.user = { ...data.user, rol };
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Error de autenticación.' });
  }
};

// Permite cualquier rol de la lista O si no tiene tabla de roles
const soloRol = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'No autenticado.' });
  }
  if (!roles.includes(req.user.rol)) {
    return res.status(403).json({ success: false, message: `Acceso denegado. Rol requerido: ${roles.join(' o ')}` });
  }
  next();
};

module.exports = { verificarToken, soloRol };
