import { fetchNotionContent } from './notion';
import { writeFile } from 'fs/promises';
export const ROOT_ID = '7d0f31048c764881a1e6df6c8684530d';

async function fetchContent() {
  const results = await fetchNotionContent(ROOT_ID);
  await writeFile('src/data.json', JSON.stringify(results));
}

fetchContent();
