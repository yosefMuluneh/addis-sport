const fs = require("fs");
const path = require("path");

const sourceDbPath = path.join(__dirname, "prisma", "dev.db");
const targetDir = path.join(__dirname, ".next", "standalone", "prisma");
const targetDbPath = path.join(targetDir, "dev.db");

const staticSourceDir = path.join(__dirname, ".next", "static");
const staticTargetDir = path.join(__dirname, ".next", "standalone", ".next", "static");

const apiSourceDir = path.join(__dirname, ".next", "server", "app", "api");
const apiTargetDir = path.join(__dirname, ".next", "standalone", "app", "api");

// Copy database
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

if (fs.existsSync(sourceDbPath)) {
  fs.copyFileSync(sourceDbPath, targetDbPath);
  console.log(`Copied ${sourceDbPath} to ${targetDbPath}`);
} else {
  console.error(`Error: Source database file ${sourceDbPath} not found. Run 'npm run seed' first.`);
  process.exit(1);
}

// Copy static assets
if (fs.existsSync(staticSourceDir)) {
  if (!fs.existsSync(path.dirname(staticTargetDir))) {
    fs.mkdirSync(path.dirname(staticTargetDir), { recursive: true });
  }
  fs.cpSync(staticSourceDir, staticTargetDir, { recursive: true });
  console.log(`Copied static assets from ${staticSourceDir} to ${staticTargetDir}`);
} else {
  console.error(`Error: Static directory ${staticSourceDir} not found.`);
  process.exit(1);
}

// Copy API routes
if (fs.existsSync(apiSourceDir)) {
  fs.cpSync(apiSourceDir, apiTargetDir, { recursive: true });
  console.log(`Copied API routes from ${apiSourceDir} to ${apiTargetDir}`);
} else {
  console.log(`Warning: API source directory ${apiSourceDir} not found—check Next.js structure`);
}