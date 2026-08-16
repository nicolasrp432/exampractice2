import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILDS_DIR = path.join(__dirname, '.c_builds');

// Asegurar que exista el directorio de compilación
if (!fs.existsSync(BUILDS_DIR)) {
  fs.mkdirSync(BUILDS_DIR, { recursive: true });
}

export function setupLocalCompiler(server) {
  server.middlewares.use(async (req, res, next) => {
    if (req.url === '/api/compile-local' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', async () => {
        try {
          const { code, args = [] } = JSON.parse(body);

          const result = await compileAndRunLocal(code, args);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        } catch (err) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            compileError: `Error interno de compilación local: ${err.message}`,
            stdout: '',
            stderr: '',
            exitCode: -1
          }));
        }
      });
    } else {
      next();
    }
  });
}

function compileAndRunLocal(code, args) {
  return new Promise((resolve) => {
    const fileId = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const sourcePath = path.join(BUILDS_DIR, `temp_${fileId}.c`);
    const binaryPath = path.join(BUILDS_DIR, `temp_${fileId}.exe`);

    // Escribir el código en un archivo temporal
    fs.writeFileSync(sourcePath, code, 'utf8');

    // Comando de compilación tipo 42 (sin banderas muy restrictivas por si no tienen gcc compatible)
    // Usamos gcc o clang si está disponible
    const compileCmd = `gcc -Wall -Wextra -Werror "${sourcePath}" -o "${binaryPath}"`;

    exec(compileCmd, { timeout: 10000 }, (error, stdout, stderr) => {
      // Limpiar archivo .c
      try { fs.unlinkSync(sourcePath); } catch (e) {}

      if (error) {
        // Si no se encuentra gcc
        if (error.message.includes('not recognized') || error.message.includes('CommandNotFoundException') || error.message.includes('ENOENT')) {
          resolve({
            compilerUnavailable: true,
            compileError: `El compilador 'gcc' no está instalado o no se encuentra en el PATH del sistema.\nPara compilar localmente, instala MinGW o WSL y añádelo al PATH.`,
            stdout: '',
            stderr: '',
            exitCode: -1
          });
          return;
        }

        // Error de compilación estándar
        resolve({
          compileError: stderr || stdout || error.message,
          stdout: '',
          stderr: '',
          exitCode: -1
        });
        return;
      }

      // Ejecutar el binario con argumentos y timeout para evitar bucles infinitos (3 segundos)
      let programStdout = '';
      let programStderr = '';
      let killedByTimeout = false;

      const child = spawn(binaryPath, args, { timeout: 3000 });

      child.stdout.on('data', (data) => {
        programStdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        programStderr += data.toString();
      });

      // Manejar timeout
      child.on('error', (spawnErr) => {
        try { fs.unlinkSync(binaryPath); } catch (e) {}
        resolve({
          compileError: `Error al ejecutar el binario: ${spawnErr.message}`,
          stdout: programStdout,
          stderr: programStderr,
          exitCode: -1
        });
      });

      child.on('close', (code, signal) => {
        // Limpiar ejecutable
        try { fs.unlinkSync(binaryPath); } catch (e) {}

        if (signal === 'SIGTERM' || signal === 'SIGKILL' || child.killed) {
          resolve({
            compileError: 'Ejecución cancelada: Tiempo de ejecución excedido (posible bucle infinito o espera de input)',
            stdout: programStdout,
            stderr: programStderr,
            exitCode: -1
          });
        } else {
          resolve({
            compileError: null,
            stdout: programStdout,
            stderr: programStderr,
            exitCode: code ?? 0
          });
        }
      });
    });
  });
}
