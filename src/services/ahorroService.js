const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.obtenerCuenta = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from('cuentas_ahorro')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

exports.crearCuenta = async (userId, metaAhorro) => {
  const { data, error } = await supabaseAdmin
    .from('cuentas_ahorro')
    .insert([{
      user_id: userId,
      saldo: 0,
      meta_ahorro: metaAhorro,
      tasa_interes: 4.5,
      fecha_apertura: new Date().toISOString()
    }])
    .select();
  if (error) throw new Error(error.message);
  return data[0];
};

exports.depositar = async (userId, monto) => {
  const cuenta = await exports.obtenerCuenta(userId);
  if (!cuenta) throw new Error('Cuenta no encontrada');

  const nuevoSaldo = Number(cuenta.saldo) + Number(monto);
  const { data, error } = await supabaseAdmin
    .from('cuentas_ahorro')
    .update({ saldo: nuevoSaldo })
    .eq('user_id', userId)
    .select();
  if (error) throw new Error(error.message);
  return data[0];
};

exports.obtenerTodasCuentas = async () => {
  const { data, error } = await supabaseAdmin
    .from('cuentas_ahorro')
    .select('*')
    .order('fecha_apertura', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

exports.obtenerMovimientos = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from('movimientos_cuenta')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};
