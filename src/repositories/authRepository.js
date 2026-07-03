const { createClient } = require('@supabase/supabase-js');

// Para auth usamos el cliente admin (SERVICE_KEY) para evitar problemas con RLS
const getAdminClient = () => createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Para signIn usamos ANON KEY (Supabase Auth lo requiere así)
const getAnonClient = () => createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.signIn = async (email, password) => {
  const client = getAnonClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    // Traducir mensajes de error de Supabase al español
    if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
      throw new Error('Email o contraseña incorrectos. Verifica tus datos e intenta de nuevo.');
    }
    if (error.message.includes('Email not confirmed')) {
      throw new Error('Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada.');
    }
    if (error.message.includes('Too many requests')) {
      throw new Error('Demasiados intentos fallidos. Espera unos minutos e intenta de nuevo.');
    }
    throw new Error(error.message || 'Error al iniciar sesión.');
  }

  if (!data?.session) {
    throw new Error('No se pudo iniciar sesión. Intenta de nuevo.');
  }

  return data;
};

exports.signUp = async (email, password, nombre) => {
  const client = getAnonClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: nombre, nombre },
    },
  });

  if (error) {
    if (error.message.includes('User already registered') || error.message.includes('already registered')) {
      throw new Error('Ya existe una cuenta con ese correo. Inicia sesión en su lugar.');
    }
    if (error.message.includes('Password should be')) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }
    throw new Error(error.message || 'Error al crear la cuenta.');
  }

  return data;
};

exports.signOut = async () => {
  const client = getAnonClient();
  await client.auth.signOut();
};

exports.getUser = async (token) => {
  const client = getAdminClient();
  const { data, error } = await client.auth.getUser(token);
  if (error || !data?.user) {
    throw new Error('Sesión inválida o expirada. Inicia sesión nuevamente.');
  }
  return data;
};
