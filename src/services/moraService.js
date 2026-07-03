const supabase = require('../config/supabase');

exports.obtenerMora = async () => {
  const { data, error } = await supabase
    .from('mora_creditos')
    .select('*')
    .order('dias_mora', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

exports.registrarGestion = async (moraId, observaciones) => {
  const { data, error } = await supabase
    .from('mora_creditos')
    .update({
      estado_gestion: 'gestionado',
      fecha_ultima_gestion: new Date().toISOString(),
      observaciones
    })
    .eq('id', moraId)
    .select();
  if (error) throw new Error(error.message);
  return data[0];
};

exports.derivarJudicial = async (moraId) => {
  const { data: mora } = await supabase
    .from('mora_creditos')
    .select('dias_mora')
    .eq('id', moraId)
    .single();
  if (mora.dias_mora < 121) throw new Error('Solo creditos con mas de 120 dias de mora pueden derivarse a judicial');
  const { data, error } = await supabase
    .from('mora_creditos')
    .update({ banda: 'judicial', estado_gestion: 'derivado_judicial' })
    .eq('id', moraId)
    .select();
  if (error) throw new Error(error.message);
  return data[0];
};

exports.castigar = async (moraId) => {
  const { data: mora } = await supabase
    .from('mora_creditos')
    .select('dias_mora')
    .eq('id', moraId)
    .single();
  if (mora.dias_mora <= 180) throw new Error('Solo creditos con mas de 180 dias pueden ser castigados');
  const { data, error } = await supabase
    .from('mora_creditos')
    .update({ banda: 'castigo', estado_gestion: 'castigado' })
    .eq('id', moraId)
    .select();
  if (error) throw new Error(error.message);
  return data[0];
};
