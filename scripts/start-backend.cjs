// LocalKart Cross-Platform Backend Startup Helper (CommonJS)
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const venvWin = path.join(__dirname, '..', '.venv', 'Scripts', 'python.exe');
const venvUnix = path.join(__dirname, '..', '.venv', 'bin', 'python');

let pythonExec = 'python';
if (fs.existsSync(venvWin)) {
  pythonExec = venvWin;
} else if (fs.existsSync(venvUnix)) {
  pythonExec = venvUnix;
}

console.log(`[LocalKart Backend Launcher] Starting FastAPI backend with ${pythonExec}...`);

const child = spawn(pythonExec, ['-m', 'uvicorn', 'backend.main:app', '--port', '5000', '--reload'], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
