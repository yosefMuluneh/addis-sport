const { app, BrowserWindow } = require("electron");
const path = require("path");
const net = require("net");
const fs = require("fs");

let mainWindow;

async function getFreePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on("error", () => getFreePort(startPort + 1).then(resolve));
  });
}

async function createWindow() {
  console.log("Creating Electron window...");
  mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: false, contextIsolation: true },
    show: false,
  });

  const { width, height } = require("electron").screen.getPrimaryDisplay().workAreaSize;
  mainWindow.setSize(width, height);

  const uploadDir = path.join(app.getPath("userData"), "uploads");
  console.log(`Setting UPLOAD_DIR to: ${uploadDir}`);
  process.env.UPLOAD_DIR = uploadDir;

  const port = await getFreePort(3000);
  process.env.PORT = port.toString();
  console.log(`Using port: ${port}`);

  const serverPath = app.isPackaged
    ? path.join(process.resourcesPath, "standalone")
    : path.join(__dirname, ".next", "standalone");
  console.log(`Server path: ${serverPath}`);

  if (!fs.existsSync(serverPath)) {
    console.error(`Error: Directory does not exist: ${serverPath}`);
    if (app.isPackaged) {
      console.log(`Contents of resources: ${fs.readdirSync(process.resourcesPath).join(", ")}`);
    } else {
      console.log(`Contents of dir: ${fs.readdirSync(__dirname).join(", ")}`);
    }
    app.quit();
    return;
  }

  try {
    process.chdir(serverPath);
    console.log(`Set working directory to: ${serverPath}`);
    console.log(`Directory contents: ${fs.readdirSync(serverPath).join(", ")}`);
  } catch (err) {
    console.error(`Failed to change directory: ${err.message}`);
    app.quit();
    return;
  }

  const dbSourcePath = path.join(serverPath, "prisma", "dev.db");
  const dbDir = path.join(app.getPath("userData"), "db");
  const dbPath = path.join(dbDir, "dev.db");

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`Created db directory: ${dbDir}`);
  }

  if (!fs.existsSync(dbPath)) {
    fs.copyFileSync(dbSourcePath, dbPath);
    console.log(`Copied database from ${dbSourcePath} to ${dbPath}`);
  } else {
    console.log(`Database already exists at ${dbPath}`);
  }

  fs.chmodSync(dbPath, 0o666);
  process.env.DATABASE_URL = `file:${dbPath}`;
  console.log(`Set DATABASE_URL to: ${process.env.DATABASE_URL}`);

  const serverFile = path.join(serverPath, "server.js");
  if (!fs.existsSync(serverFile)) {
    console.error(`Error: server.js not found at ${serverFile}`);
    app.quit();
    return;
  }

  try {
    require(serverFile);
    console.log("Starting Next.js server...");
  } catch (err) {
    console.error(`Failed to start Next.js server: ${err.message}`);
    app.quit();
    return;
  }

  setTimeout(() => {
    const url = `http://localhost:${port}/auth/signin`;
    console.log(`Loading URL: ${url}`);
    mainWindow.loadURL(url).then(() => {
      console.log("URL loaded successfully");
      mainWindow.show();
    }).catch((err) => {
      console.error(`Failed to load URL: ${err.message}`);
      app.quit();
    });
  }, 2000);

  // Open DevTools for debugging
  mainWindow.webContents.openDevTools();
}

app.on("ready", () => {
  console.log("App is ready");
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});