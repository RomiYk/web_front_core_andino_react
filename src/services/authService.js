const authRepository = require('../repositories/authRepository');

exports.login = async (email, password) => {
  const data = await authRepository.signIn(email, password);

  const nombre =
    data.user.user_metadata?.full_name ||
    data.user.user_metadata?.nombre ||
    data.user.email.split('@')[0]; // fallback: parte del email

  // Buscar el rol asignado en roles_usuario (por defecto 'cliente')
  let rol = 'cliente';
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data: rolData } = await supabaseAdmin
      .from('roles_usuario')
      .select('rol')
      .eq('user_id', data.user.id)
      .maybeSingle();
    if (rolData?.rol) rol = rolData.rol;
  } catch (_) {
    // Si la tabla no existe aún, queda como 'cliente'
  }

  return {
    usuario: {
      id:     data.user.id,
      email:  data.user.email,
      nombre,
      rol,
    },
    token: data.session.access_token,
    // Incluimos el refresh token por si el frontend lo necesita
    refreshToken: data.session.refresh_token,
  };
};

exports.register = async (email, password, nombre) => {
  const data = await authRepository.signUp(email, password, nombre);
  return {
    email: data.user?.email || email,
    mensaje: 'Cuenta creada. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.',
    // Si Supabase tiene confirmación de email desactivada, ya puede iniciar sesión directo
    sessionActiva: !!data.session,
  };
};

exports.logout = async () => {
  await authRepository.signOut();
};

exports.getUsuarioActual = async (token) => {
  const data = await authRepository.getUser(token);

  // Buscar el rol en roles_usuario (lo crea el trigger SQL al registrarse)
  let rol = 'cliente';
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data: rolData } = await supabaseAdmin
      .from('roles_usuario')
      .select('rol')
      .eq('user_id', data.user.id)
      .maybeSingle();
    if (rolData?.rol) rol = rolData.rol;
  } catch (_) {
    // Si la tabla no existe aún, queda como 'cliente'
  }

  return {
    id:     data.user.id,
    email:  data.user.email,
    nombre:
      data.user.user_metadata?.full_name ||
      data.user.user_metadata?.nombre ||
      data.user.email.split('@')[0],
    rol,
  };
};
