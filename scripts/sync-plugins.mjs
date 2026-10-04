import { readFile, writeFile } from 'node:fs/promises';

const dataPath = new URL('../data/plugins.json', import.meta.url);
const sourcesPath = new URL('../data/plugin-sources.json', import.meta.url);
const data = JSON.parse(await readFile(dataPath, 'utf8'));
const sources = JSON.parse(await readFile(sourcesPath, 'utf8'));
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'Faidlix-portfolio-sync' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

function compareVersions(left, right) {
  const a = String(left).split('.').map(Number), b = String(right).split('.').map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) - (b[i] || 0);
  }
  return 0;
}

async function getText(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function latestCommit(repo) {
  const payload = JSON.parse(await getText(`https://api.github.com/repos/${repo}/commits?per_page=1`));
  const commit = payload[0];
  return { date: commit.commit.author.date.slice(0, 10), changes: commit.commit.message.split('\n')[0] };
}

for (const source of sources) {
  const plugin = data.plugins.find((item) => item.id === source.id);
  if (!plugin) continue;
  try {
    const rawUrl = `https://raw.githubusercontent.com/${source.repo}/main/${source.path}`;
    const raw = await getText(rawUrl);
    let version = plugin.version, download = plugin.download;
    if (source.type === 'extension-index') {
      const item = JSON.parse(raw).data.sort((a, b) => compareVersions(b.version, a.version))[0];
      version = item.version;
      download = new URL(item.archive_url, rawUrl).href;
    } else if (source.type === 'release-json') {
      const release = JSON.parse(raw);
      version = Array.isArray(release.version) ? release.version.join('.') : release.version;
      download = release.download_url;
    } else if (source.type === 'manifest') {
      version = raw.match(/^version\s*=\s*"([^"]+)"/m)?.[1] || plugin.version;
    }
    if (compareVersions(version, plugin.version) > 0) {
      const commit = await latestCommit(source.repo);
      plugin.history.push({ version, date: commit.date, changes: commit.changes });
      plugin.history.sort((a, b) => a.date.localeCompare(b.date) || compareVersions(a.version, b.version));
      plugin.version = version;
      plugin.download = download;
    }
  } catch (error) {
    console.warn(`同步 ${source.id} 失敗：${error.message}`);
  }
}
data.syncedAt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(new Date());
await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
