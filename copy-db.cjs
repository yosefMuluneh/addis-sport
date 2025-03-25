const fs = require("fs");
const path = require("path");

const sourcePath = path.join(__dirname, "prisma", "dev.db");
const targetDir = path.join(__dirname, ".next", "standalone", "prisma");
const targetPath = path.join(targetDir, "dev.db");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

if (fs.existsSync(sourcePath)) {
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`Copied ${sourcePath} to ${targetPath}`);
} else {
  console.error(`Error: Source database file ${sourcePath} not found. Run 'npm run seed' first.`);
  process.exit(1);
}