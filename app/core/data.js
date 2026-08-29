const DATA_FILES = ["home", "status", "projects", "focus", "ecosystem"];
const dataCache = new Map();

async function fetchJson(name) {
  const response = await fetch(`./data/${name}.json`);

  if (!response.ok) {
    throw new Error(`Unable to load ${name}.json (${response.status})`);
  }

  return response.json();
}

function loadJson(name) {
  if (!dataCache.has(name)) {
    const request = fetchJson(name).catch((error) => {
      dataCache.delete(name);
      throw error;
    });

    dataCache.set(name, request);
  }

  return dataCache.get(name);
}

export async function loadData(...names) {
  const entries = await Promise.all(
    names.map(async (name) => [name, await loadJson(name)]),
  );

  return Object.fromEntries(entries);
}

export function loadAppData() {
  return loadData(...DATA_FILES);
}
