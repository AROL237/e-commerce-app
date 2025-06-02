import fs from 'fs';
import path from 'node:path';

const schemaDir = path.join(__dirname, '/prisma/models');
const targetFile = path.join(__dirname, '/prisma/schema.prisma');


const modelfiles = fs
  .readdirSync(schemaDir)
  .filter((f) => f.endsWith('.prisma'));
const schemaContent = modelfiles.map((f) =>
  fs.readFileSync(path.join(schemaDir, f), 'utf-8'),
);

fs.writeFileSync(targetFile,'\n' + schemaContent.join('\n\n'));
