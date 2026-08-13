const net = require('net');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const backendDir = path.resolve(__dirname, '../../backend');
const bundledPython = path.join(backendDir, 'venv', 'Scripts', 'python.exe');
const python = fs.existsSync(bundledPython) ? bundledPython : 'python';

function portIsOpen() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port: 8000 });
    socket.setTimeout(300);
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('timeout', () => { socket.destroy(); resolve(false); });
    socket.once('error', () => resolve(false));
  });
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function startBackend() {
  if (await portIsOpen()) return;

  const child = spawn(python, ['manage.py', 'runserver', '127.0.0.1:8000'], {
    cwd: backendDir,
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  });
  child.unref();

  for (let attempt = 0; attempt < 40; attempt += 1) {
    await wait(250);
    if (await portIsOpen()) return;
  }

  throw new Error('Django backend could not start on http://127.0.0.1:8000.');
}

startBackend().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
