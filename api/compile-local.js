export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // En hosting serverless (como Vercel), la compilación nativa por GCC de C no está disponible en la función.
  // Devolvemos 200 con compilerUnavailable: true para que el cliente pase de forma limpia e instantánea
  // a Wandbox o al simulador de memoria sin generar errores 404 en la consola del navegador.
  return res.status(200).json({
    compilerUnavailable: true,
    message: 'Compilación GCC nativa no disponible en entorno serverless. Usando simulador y motor remoto.',
    stdout: '',
    stderr: '',
    exitCode: 0,
  });
}
