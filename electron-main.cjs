const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

const serverPath = path.join(__dirname, ".next/standalone");
const uploadDir = path.join(app.getPath("userData"), "uploads"); // Persistent storage

let win;
let serverProcess;

function startServer() {
  // Set environment variable for upload directory
  process.env.UPLOAD_DIR = uploadDir;

  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Copy public folder
  const publicSource = path.join(__dirname, "public");
  const publicDest = path.join(serverPath, "public");
  if (!fs.existsSync(publicDest) && fs.existsSync(publicSource)) {
    fs.cpSync(publicSource, publicDest, { recursive: true });
  }

  // Copy prisma folder
  const prismaSource = path.join(__dirname, "prisma");
  const prismaDest = path.join(serverPath, "prisma");
  if (!fs.existsSync(prismaDest) && fs.existsSync(prismaSource)) {
    fs.cpSync(prismaSource, prismaDest, { recursive: true });
  }

  // Copy .next/static folder
  const staticSource = path.join(__dirname, ".next/static");
  const staticDest = path.join(serverPath, ".next/static");
  if (!fs.existsSync(staticDest) && fs.existsSync(staticSource)) {
    fs.cpSync(staticSource, staticDest, { recursive: true });
  }

  // Sync initial uploads to public/uploads
  const uploadsDest = path.join(serverPath, "public/uploads");
  if (!fs.existsSync(uploadsDest)) {
    fs.mkdirSync(uploadsDest, { recursive: true });
  }
  if (fs.existsSync(uploadDir)) {
    fs.readdirSync(uploadDir).forEach((file) => {
      const src = path.join(uploadDir, file);
      const dest = path.join(uploadsDest, file);
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
      }
    });
  }

  // Start the Next.js server
  serverProcess = exec("node server.js", { cwd: serverPath, env: { ...process.env } }, (err) => {
    if (err) console.error("Server error:", err);
  });

  serverProcess.stdout.on("data", (data) => console.log(`Server: ${data}`));
  serverProcess.stderr.on("data", (data) => console.error(`Server Error: ${data}`));
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL("http://localhost:3000");
  win.webContents.openDevTools();

  win.on("closed", () => {
    win = null; // Fixed: Removed extra parenthesis
  });
}

app.on("ready", () => {
  startServer();
  setTimeout(createWindow, 1000);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (serverProcess) serverProcess.kill();
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) createWindow();
});

app.on("quit", () => {
  if (serverProcess) serverProcess.kill();
});