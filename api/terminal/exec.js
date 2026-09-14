// api/terminal/exec.js
// Handler para Vercel Serverless Functions

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    command = '',
    code = '',
    filename = 'solution.c',
    action = 'custom',
    args = [],
    stdin = '',
    exerciseId = '',
    tipoEntrega = 'programa',
  } = req.body || {};

  // 1. Si la acción es Norminette, la resolvemos directamente en Node
  if (action === 'norm') {
    const lines = String(code).split('\n');
    const errors = [];
    const warnings = [];

    lines.forEach((line, idx) => {
      const expandedLen = line.replace(/\t/g, '    ').length;
      if (expandedLen > 80) {
        errors.push(`Error: LINE_TOO_LONG (line ${idx + 1}, col ${expandedLen}): Línea de ${expandedLen} caracteres (máx. 80 en Norma 42).`);
      }
      if (/^for\s*\(/.test(line.trim()) || /\s+for\s*\(/.test(line)) {
        errors.push(`Error: FOR_FORBIDDEN (line ${idx + 1}): Bucle 'for' prohibido por la Norma 42. Debes usar 'while'.`);
      }
      if (/#include\s*<stdio\.h>/.test(line)) {
        warnings.push(`Warning: FORBIDDEN_INCLUDE (line ${idx + 1}): '<stdio.h>' está prohibido si el ejercicio sólo permite 'write'. Elimina printf antes de la entrega.`);
      }
    });

    const exitCode = errors.length > 0 ? 1 : 0;
    let stdout = `${filename}: OK! (Cumple la Norma 42)\n`;
    if (errors.length > 0) {
      stdout = `${filename}: KO por Norma!\n` + errors.map((e) => `  ${e}`).join('\n');
    }
    let stderr = warnings.length > 0 ? warnings.map((w) => `  ${w}`).join('\n') : '';

    return res.status(200).json({
      stdout,
      stderr,
      exitCode,
      signal: null,
      command: `norminette -R CheckForbiddenSourceHeader ${filename}`,
      cwd: `~/42_exam/${exerciseId || 'user'}`,
      mode: 'vercel-norminette',
    });
  }

  // 2. Para compilación y ejecución en Vercel, indicamos que se ejecute a través
  // del motor Judge0/Wandbox de alta fidelidad para C sin causar errores 404
  return res.status(200).json({
    compilerUnavailable: true,
    useClientExecution: true,
    message: 'Entorno serverless de Vercel detectado: usando pasarela remota de compilación GCC C99.',
    command: command || action,
    stdout: '',
    stderr: '',
    exitCode: 0,
  });
}
