/* eslint-env node */
import { promises as fs } from 'fs';
import path from 'path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const seedPath = path.resolve(rootDir, 'src/api/seedData.js');
const dbPath = path.resolve(rootDir, 'db.json');

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  const hasSeed = await fileExists(seedPath);
  if (!hasSeed) {
    console.error('No MirageJS seed file found at src/api/seedData.js');
    process.exit(1);
  }

  const seedModule = await import(pathToFileURL(seedPath));
  const seedData = seedModule.seedData || {};

  const {
    pages = [],
    sections = [],
    templates = [],
    surveys = [],
    surveyResponses = [],
    users = [],
    settings = [],
  } = seedData;

  const normalizedSurveys = surveys.map((survey, index) => ({
    ...survey,
    id: survey.id || index + 1,
    createdAt: survey.createdAt || new Date().toISOString(),
  }));

  const payload = {
    pages,
    sections,
    templates,
    surveys: normalizedSurveys,
    surveyResponses,
    users,
    settings,
  };

  await fs.writeFile(dbPath, JSON.stringify(payload, null, 2));
  console.log(`✅ Mirage data migrated to ${dbPath}`);
}

run().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});

