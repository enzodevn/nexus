import { spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function relative(filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(directory, extension) {
  const entries = await fs.readdir(path.join(root, directory), {
    withFileTypes: true,
  });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(root, directory, entry.name);

    if (entry.isDirectory()) {
      files.push(
        ...(await collectFiles(path.relative(root, entryPath), extension)),
      );
    } else if (entry.name.endsWith(extension)) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function withoutCssCommentsAndStrings(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""');
}

function requireString(value, label) {
  assert(typeof value === "string" && value.trim().length > 0, `${label} must be a non-empty string.`);
}

function requireList(value, label, minimum = 1) {
  assert(Array.isArray(value) && value.length >= minimum, `${label} must contain at least ${minimum} item${minimum === 1 ? "" : "s"}.`);
}

function requireBoolean(value, label) {
  assert(typeof value === "boolean", `${label} must be a boolean.`);
}

function requireUniqueStrings(value, label, minimum = 1) {
  requireList(value, label, minimum);

  if (!Array.isArray(value)) return;

  const normalized = value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim().toLowerCase());

  value.forEach((item, index) => requireString(item, `${label}[${index}]`));
  assert(new Set(normalized).size === value.length, `${label} must not contain duplicate values.`);
}

async function validateJavaScript() {
  const files = [
    ...(await collectFiles("app", ".js")),
    ...(await collectFiles("components", ".js")),
  ];

  for (const file of files) {
    const syntax = spawnSync(process.execPath, ["--check", file], {
      encoding: "utf8",
    });
    assert(
      syntax.status === 0,
      `${relative(file)} failed syntax validation: ${(syntax.stderr || syntax.stdout).trim()}`,
    );

    const source = await fs.readFile(file, "utf8");
    const imports = source.matchAll(
      /(?:from\s*|import\s*)["'](\.{1,2}\/[^"']+)["']/g,
    );

    for (const match of imports) {
      const target = path.resolve(path.dirname(file), match[1]);
      assert(
        await exists(target),
        `${relative(file)} imports a missing file: ${match[1]}`,
      );
    }
  }

  return files.length;
}

async function validateJson() {
  const files = await collectFiles("data", ".json");
  const parsed = new Map();

  for (const file of files) {
    try {
      parsed.set(path.basename(file), JSON.parse(await fs.readFile(file, "utf8")));
    } catch (error) {
      failures.push(`${relative(file)} is not valid JSON: ${error.message}`);
    }
  }

  return { count: files.length, parsed };
}

async function validateCss() {
  const files = await collectFiles("styles", ".css");
  const breakpoints = [];

  for (const file of files) {
    const source = await fs.readFile(file, "utf8");
    const structuralSource = withoutCssCommentsAndStrings(source);
    const openingBraces = structuralSource.match(/\{/g)?.length ?? 0;
    const closingBraces = structuralSource.match(/\}/g)?.length ?? 0;

    assert(
      openingBraces === closingBraces,
      `${relative(file)} has unbalanced CSS blocks (${openingBraces} opening, ${closingBraces} closing).`,
    );

    for (const match of source.matchAll(
      /@import\s+(?:url\(\s*)?["']([^"']+)["']\s*\)?\s*;/g,
    )) {
      const target = path.resolve(path.dirname(file), match[1]);
      assert(
        await exists(target),
        `${relative(file)} imports a missing stylesheet: ${match[1]}`,
      );
    }

    for (const match of source.matchAll(
      /@media\s*\(\s*max-width:\s*([\d.]+)px\s*\)/g,
    )) {
      breakpoints.push(Number(match[1]));
    }
  }

  assert(breakpoints.some((width) => width <= 480), "Responsive contract is missing a mobile breakpoint at or below 480px.");
  assert(breakpoints.some((width) => width >= 700 && width <= 900), "Responsive contract is missing a compact/tablet breakpoint between 700px and 900px.");
  assert(breakpoints.some((width) => width >= 1000), "Responsive contract is missing a large-layout breakpoint at or above 1000px.");

  return { count: files.length, breakpointCount: breakpoints.length };
}

async function validateDocumentContract() {
  const htmlPath = path.join(root, "index.html");
  const html = await fs.readFile(htmlPath, "utf8");

  const requirements = [
    [/<html\s+lang=["'][^"']+["']/i, "index.html must declare a document language."],
    [/<meta\s+name=["']viewport["']/i, "index.html must include responsive viewport metadata."],
    [/<meta\s+name=["']description["']/i, "index.html must include a search description."],
    [/<meta\s+name=["']robots["']/i, "index.html must include indexing instructions."],
    [/<meta\s+property=["']og:title["']/i, "index.html must include an Open Graph title."],
    [/<meta\s+property=["']og:description["']/i, "index.html must include an Open Graph description."],
    [/<meta\s+name=["']twitter:card["']/i, "index.html must include X card metadata."],
    [/<link\s+rel=["']manifest["']/i, "index.html must reference the site manifest."],
    [/<script\s+id=["']site-structured-data["']\s+type=["']application\/ld\+json["']/i, "index.html must expose structured site identity."],
    [/<a[^>]+class=["'][^"']*skip-link[^"']*["'][^>]+href=["']#main-content["']/i, "index.html must provide a skip link to the main content."],
    [/<script\s+type=["']module["'][^>]+src=["'].\/app\/main\.js["']/i, "index.html must load the application as an ES module."],
  ];

  for (const [pattern, message] of requirements) assert(pattern.test(html), message);

  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const reference = match[1];
    if (/^(?:data:|https?:|mailto:|#)/.test(reference)) continue;
    const cleanReference = reference.split(/[?#]/)[0];
    assert(
      await exists(path.resolve(root, cleanReference)),
      `index.html references a missing local file: ${reference}`,
    );
  }

  const mainSource = await fs.readFile(path.join(root, "app", "main.js"), "utf8");
  const shellSource = await fs.readFile(
    path.join(root, "components", "layout", "shell.js"),
    "utf8",
  );
  const motionSource = await fs.readFile(
    path.join(root, "styles", "foundation", "motion.css"),
    "utf8",
  );

  assert(shellSource.includes('<main id="main-content" tabindex="-1">'), "The application shell must expose a programmatically focusable main landmark.");
  assert(shellSource.includes('aria-current="page"'), "The primary navigation must expose the current route to assistive technology.");
  assert(shellSource.includes('aria-controls="primary-navigation"'), "The compact navigation control must identify the navigation it controls.");
  assert(mainSource.includes('aria-busy'), "Route transitions must expose their loading state with aria-busy.");
  assert(mainSource.includes('mainContent?.focus'), "Route transitions must move keyboard focus to the new main content.");
  assert(mainSource.includes('prefers-reduced-motion: reduce'), "JavaScript motion must respect the reduced-motion preference.");
  assert(motionSource.includes('@media (prefers-reduced-motion: reduce)'), "CSS motion must respect the reduced-motion preference.");

  const routeStart = mainSource.indexOf("const routes = {");
  const routeEnd = mainSource.indexOf("\n  };", routeStart);
  assert(routeStart >= 0 && routeEnd > routeStart, "The application route table could not be inspected.");

  const routeBlock = routeStart >= 0 && routeEnd > routeStart
    ? mainSource.slice(routeStart, routeEnd)
    : "";
  const routes = [...routeBlock.matchAll(/^\s{4}"([^"]+)":/gm)].map(
    (match) => match[1],
  );
  const expectedRoutes = [
    "/",
    "/about",
    "/contact",
    "/projects",
    "/projects/:slug",
    "/labs",
    "/roadmap",
    "*",
  ];

  assert(
    JSON.stringify(routes) === JSON.stringify(expectedRoutes),
    `Route contract changed. Expected ${expectedRoutes.join(", ")}; found ${routes.join(", ") || "none"}.`,
  );

  return routes.length;
}

async function validateMetadataContract(siteData) {
  assert(siteData && typeof siteData === "object", "data/site.json must contain an object.");
  requireString(siteData?.identity?.name, "data/site.json identity.name");
  requireString(siteData?.identity?.headline, "data/site.json identity.headline");
  requireString(siteData?.identity?.title, "data/site.json identity.title");
  requireString(siteData?.identity?.description, "data/site.json identity.description");
  requireString(siteData?.identity?.language, "data/site.json identity.language");
  requireString(siteData?.identity?.locale, "data/site.json identity.locale");
  requireString(siteData?.identity?.themeColor, "data/site.json identity.themeColor");
  requireString(siteData?.author?.name, "data/site.json author.name");
  requireString(siteData?.author?.role, "data/site.json author.role");
  requireList(siteData?.author?.sameAs, "data/site.json author.sameAs", 2);
  assert(
    siteData?.identity?.publicUrl === null
      || /^https:\/\/[^/]+\/$/.test(siteData?.identity?.publicUrl ?? ""),
    "The public URL must be null or use HTTPS and end at the origin root.",
  );

  for (const [index, profile] of (siteData?.author?.sameAs ?? []).entries()) {
    assert(/^https:\/\//.test(profile), `data/site.json author.sameAs[${index}] must use HTTPS.`);
  }

  const expectedRoutes = [
    "/",
    "/about",
    "/contact",
    "/projects",
    "/projects/:slug",
    "/labs",
    "/roadmap",
    "*",
  ];
  const routeKeys = Object.keys(siteData?.routes ?? {});
  assert(
    JSON.stringify(routeKeys) === JSON.stringify(expectedRoutes),
    `Metadata route contract changed. Expected ${expectedRoutes.join(", ")}; found ${routeKeys.join(", ") || "none"}.`,
  );

  for (const route of expectedRoutes) {
    const metadata = siteData?.routes?.[route];
    requireString(metadata?.title, `data/site.json routes.${route}.title`);
    requireString(metadata?.description, `data/site.json routes.${route}.description`);
    requireString(metadata?.type, `data/site.json routes.${route}.type`);
    requireString(metadata?.robots, `data/site.json routes.${route}.robots`);
    assert((metadata?.title?.length ?? 0) <= 65, `data/site.json routes.${route}.title must remain at or below 65 characters.`);
    assert(
      (metadata?.description?.length ?? 0) >= 80 && (metadata?.description?.length ?? 0) <= 170,
      `data/site.json routes.${route}.description must remain between 80 and 170 characters.`,
    );
  }

  assert(siteData?.routes?.["/projects/:slug"]?.shareImage === false, "Project detail metadata must clear the inherited site image when projects do not provide their own primary image.");
  assert(siteData?.routes?.["*"]?.robots === "noindex, nofollow", "Unknown routes must remain excluded from indexing.");

  requireString(siteData?.sharing?.imagePath, "data/site.json sharing.imagePath");
  requireString(siteData?.sharing?.imageAlt, "data/site.json sharing.imageAlt");
  assert(siteData?.sharing?.width === 1200, "The social image width must be 1200 pixels.");
  assert(siteData?.sharing?.height === 630, "The social image height must be 630 pixels.");

  const imagePath = path.resolve(root, siteData?.sharing?.imagePath ?? "");
  assert(imagePath.startsWith(`${root}${path.sep}`), "The social image path must remain inside the repository.");
  assert(await exists(imagePath), `The social image is missing: ${relative(imagePath)}.`);

  if (await exists(imagePath)) {
    const image = await fs.readFile(imagePath);
    const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    assert(image.subarray(0, 8).equals(pngSignature), "The social preview must be a valid PNG file.");
    assert(image.length >= 24, "The social preview PNG is incomplete.");

    if (image.length >= 24) {
      assert(image.readUInt32BE(16) === 1200, "The social preview file must be exactly 1200 pixels wide.");
      assert(image.readUInt32BE(20) === 630, "The social preview file must be exactly 630 pixels high.");
    }
  }

  const html = await fs.readFile(path.join(root, "index.html"), "utf8");
  assert(
    !/<link\s+rel=["']canonical["']/i.test(html),
    "index.html must not commit a canonical URL before a public origin is selected.",
  );
  assert(
    !/<meta\s+property=["']og:url["']/i.test(html),
    "index.html must not commit an Open Graph URL before a public origin is selected.",
  );
  assert(
    !/<meta\s+(?:property=["']og:image|name=["']twitter:image)["']/i.test(html),
    "index.html must not commit absolute sharing URLs before a public origin is selected.",
  );

  const structuredMatch = html.match(
    /<script\s+id=["']site-structured-data["']\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i,
  );
  if (structuredMatch) {
    try {
      const structuredData = JSON.parse(structuredMatch[1]);
      const website = structuredData?.["@graph"]?.find(
        (entry) => entry?.["@type"] === "WebSite",
      );
      assert(
        website && !("url" in website),
        "Structured WebSite data must not commit a URL before a public origin is selected.",
      );
    } catch (error) {
      failures.push(`index.html structured data is not valid JSON: ${error.message}`);
    }
  }

  const manifest = JSON.parse(
    await fs.readFile(path.join(root, "site.webmanifest"), "utf8"),
  );
  assert(manifest.name === siteData?.identity?.title, "The web manifest name must match the NEXUS site title.");
  assert(manifest.theme_color === siteData?.identity?.themeColor, "The web manifest theme color must match site metadata.");
  requireList(manifest.icons, "site.webmanifest icons");

  for (const icon of manifest.icons ?? []) {
    requireString(icon.src, "site.webmanifest icon.src");
    assert(await exists(path.resolve(root, icon.src)), `site.webmanifest references a missing icon: ${icon.src}.`);
  }

  const robots = await fs.readFile(path.join(root, "robots.txt"), "utf8");
  assert(/^User-agent:\s*\*/m.test(robots), "robots.txt must define the default crawler policy.");
  assert(/^Disallow:\s*\/$/m.test(robots), "robots.txt must block indexing while the portfolio is private.");
  assert(!/Sitemap:/i.test(robots), "robots.txt must not publish a sitemap before a public origin is selected.");
  assert(!(await exists(path.join(root, "sitemap.xml"))), "sitemap.xml must remain absent while no public origin is configured.");

  const metadataSource = await fs.readFile(
    path.join(root, "app", "core", "metadata.js"),
    "utf8",
  );
  assert(metadataSource.includes("getPublicDocumentUrl"), "Route metadata must resolve the verified public URL centrally.");
  assert(metadataSource.includes("site.identity.publicUrl"), "Route metadata must use the optional public URL from structured data.");
  assert(metadataSource.includes("LOCAL_HOSTNAMES"), "Local preview origins must be excluded from canonical metadata.");
  assert(metadataSource.includes("getPublicImageUrl"), "Social metadata must derive its absolute image URL only from the public origin.");
  assert(metadataSource.includes("shareImage !== false"), "Route metadata must support clearing inherited social images.");
  assert(metadataSource.includes("SoftwareSourceCode"), "Project detail routes must expose record-specific structured data.");

  return routeKeys.length;
}

function validateContact(contactData) {
  assert(contactData && typeof contactData === "object", "data/contact.json must contain an object.");
  requireString(contactData?.meta?.title, "data/contact.json meta.title");
  requireString(contactData?.position?.title, "data/contact.json position.title");
  requireString(contactData?.profile?.name, "data/contact.json profile.name");
  requireList(contactData?.profile?.focus, "data/contact.json profile.focus");
  requireList(contactData?.channels?.items, "data/contact.json channels.items", 3);
  requireList(contactData?.context?.items, "data/contact.json context.items", 1);

  const channels = Array.isArray(contactData?.channels?.items)
    ? contactData.channels.items
    : [];
  const names = new Set();
  const destinations = new Set();

  for (const [index, channel] of channels.entries()) {
    const label = `contact.channels.items[${index}]`;
    requireString(channel.name, `${label}.name`);
    requireString(channel.type, `${label}.type`);
    requireString(channel.value, `${label}.value`);
    requireString(channel.description, `${label}.description`);
    requireString(channel.action, `${label}.action`);
    assert(!names.has(channel.name), `${label}.name duplicates ${channel.name}.`);
    assert(!destinations.has(channel.href), `${label}.href duplicates ${channel.href}.`);
    assert(/^(?:https:\/\/|mailto:)/.test(channel.href), `${label}.href must use HTTPS or mailto.`);
    assert(channel.signal === "active", `${label}.signal must identify a verified active channel.`);
    names.add(channel.name);
    destinations.add(channel.href);
  }

  assert(channels.some((channel) => channel.href.startsWith("mailto:")), "The contact contract must include one explicitly approved professional email channel.");
  assert(channels.filter((channel) => channel.href.startsWith("https://")).length >= 2, "The contact contract must include at least two verified HTTPS profiles.");

  return channels.length;
}

async function validateAutomationContract() {
  const packageData = JSON.parse(
    await fs.readFile(path.join(root, "package.json"), "utf8"),
  );
  const workflow = await fs.readFile(
    path.join(root, ".github", "workflows", "quality.yml"),
    "utf8",
  );

  assert(packageData.private === true, "The validation package must remain private.");
  assert(packageData.scripts?.validate === "node ./scripts/validate.mjs", "package.json must expose the dependency-free validation command.");
  assert(!packageData.dependencies, "Runtime dependencies are not allowed in the current NEXUS architecture.");
  assert(workflow.includes("contents: read"), "The quality workflow must use read-only repository permissions.");
  assert(workflow.includes("actions/checkout@v7"), "The quality workflow must use the approved checkout action major.");
  assert(workflow.includes("actions/setup-node@v7"), "The quality workflow must use the approved setup-node action major.");
  assert(workflow.includes("package-manager-cache: false"), "The dependency-free workflow must keep package caching disabled.");
  assert(workflow.includes("npm ci --ignore-scripts"), "The quality workflow must install the locked production build toolchain without lifecycle scripts.");
  assert(workflow.includes("npm audit --audit-level=high"), "The quality workflow must reject high-severity build toolchain vulnerabilities.");
  assert(workflow.includes("npm run build"), "The quality workflow must build the production bundle before validation.");
  assert(workflow.includes("npm run validate"), "The quality workflow must execute the same validation command used locally.");
  assert(/^  push:\s*$/m.test(workflow) && /^  pull_request:\s*$/m.test(workflow), "The quality workflow must validate every push and pull request.");

  return "local command + GitHub Actions";
}

async function validateDeliveryContract() {
  const packageData = JSON.parse(
    await fs.readFile(path.join(root, "package.json"), "utf8"),
  );
  const packageLock = JSON.parse(
    await fs.readFile(path.join(root, "package-lock.json"), "utf8"),
  );
  const lockRoot = packageLock.packages?.[""];

  assert(packageData.scripts?.dev === "vite", "package.json must expose the Vite development command.");
  assert(
    packageData.scripts?.build === "vite build && node ./scripts/build-worker.mjs",
    "package.json must build the static application before generating the production worker.",
  );
  assert(packageData.engines?.node === ">=22.13.0", "The build engine must use the supported Node.js baseline.");
  assert(
    JSON.stringify(Object.keys(packageData.devDependencies ?? {}).sort()) === JSON.stringify(["vite"]),
    "Vite must remain the only development dependency in the delivery toolchain.",
  );
  assert(packageData.devDependencies?.vite === "8.2.2", "Vite must remain pinned to the audited release.");
  assert(!packageData.dependencies, "Production runtime dependencies are not allowed in the NEXUS architecture.");

  assert(packageLock.lockfileVersion === 3, "package-lock.json must use the current deterministic lockfile format.");
  assert(!lockRoot?.dependencies, "The lockfile must not introduce production runtime dependencies.");
  assert(
    JSON.stringify(Object.keys(lockRoot?.devDependencies ?? {}).sort()) === JSON.stringify(["vite"])
      && lockRoot?.devDependencies?.vite === "8.2.2",
    "The lockfile root must match the pinned production build tools.",
  );
  assert(
    packageLock.packages?.["node_modules/vite"]?.version === "8.2.2",
    "The resolved Vite package must match the audited release.",
  );

  const viteSource = await fs.readFile(path.join(root, "vite.config.js"), "utf8");
  const workerSource = await fs.readFile(
    path.join(root, "scripts", "build-worker.mjs"),
    "utf8",
  );
  const gitignore = await fs.readFile(path.join(root, ".gitignore"), "utf8");

  assert(viteSource.includes("preserveStaticContracts()"), "The production build must preserve data, robots and manifest files.");
  assert(workerSource.includes('"X-Content-Type-Options": "nosniff"'), "The production worker must prevent MIME sniffing.");
  assert(workerSource.includes('"X-Frame-Options": "DENY"'), "The production worker must prevent framing.");
  assert(workerSource.includes('status: 405'), "The production worker must reject unsupported HTTP methods.");
  assert(gitignore.includes("/node_modules/") && gitignore.includes("/dist/"), "Generated dependencies and build output must remain outside version control.");

  return "portable worker + locked build toolchain";
}

async function validateProjects(projectData, siteData) {
  assert(projectData && typeof projectData === "object", "data/projects.json must contain an object.");
  requireString(projectData?.meta?.index, "data/projects.json meta.index");
  requireString(projectData?.meta?.eyebrow, "data/projects.json meta.eyebrow");
  requireString(projectData?.meta?.title, "data/projects.json meta.title");
  requireString(projectData?.meta?.description, "data/projects.json meta.description");
  requireString(projectData?.meta?.platformVersion, "data/projects.json meta.platformVersion");
  assert(/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(projectData?.meta?.platformVersion ?? ""), "data/projects.json meta.platformVersion must use semantic versioning.");
  requireString(projectData?.registry?.eyebrow, "data/projects.json registry.eyebrow");
  requireString(projectData?.registry?.title, "data/projects.json registry.title");
  requireString(projectData?.registry?.description, "data/projects.json registry.description");
  requireList(projectData?.projects, "data/projects.json projects", 1);

  const projects = Array.isArray(projectData?.projects) ? projectData.projects : [];
  const ids = new Set();
  const slugs = new Set();
  const projectStatuses = new Set(["Stable", "In development", "Planned", "Paused", "Concept"]);
  const projectSignals = new Set(["active", "muted"]);
  const milestoneSequence = ["Current", "Next", "Future"];
  const requiredProjectFields = [
    "id",
    "slug",
    "code",
    "shortName",
    "name",
    "category",
    "status",
    "signal",
    "featured",
    "hasCaseStudy",
    "summary",
    "objective",
    "focus",
    "stack",
    "architecture",
    "milestones",
  ];

  const schemaPath = path.join(root, "schemas", "project.schema.json");
  assert(await exists(schemaPath), "schemas/project.schema.json must document the project contract.");

  if (await exists(schemaPath)) {
    try {
      const schema = JSON.parse(await fs.readFile(schemaPath, "utf8"));
      assert(schema?.["x-nexus-contract-version"] === "1.0.0", "The project schema must expose contract version 1.0.0.");
      assert(
        JSON.stringify(schema?.required ?? []) === JSON.stringify(requiredProjectFields),
        "The project schema required fields must match the automated project contract.",
      );
    } catch (error) {
      failures.push(`schemas/project.schema.json is not valid JSON: ${error.message}`);
    }
  }

  for (const [index, project] of projects.entries()) {
    const label = `projects[${index}]`;
    requireString(project.id, `${label}.id`);
    requireString(project.slug, `${label}.slug`);
    requireString(project.code, `${label}.code`);
    requireString(project.shortName, `${label}.shortName`);
    requireString(project.name, `${label}.name`);
    requireString(project.category, `${label}.category`);
    requireString(project.status, `${label}.status`);
    requireString(project.signal, `${label}.signal`);
    requireBoolean(project.featured, `${label}.featured`);
    requireBoolean(project.hasCaseStudy, `${label}.hasCaseStudy`);
    requireString(project.summary, `${label}.summary`);
    requireString(project.objective, `${label}.objective`);
    requireString(project.focus, `${label}.focus`);
    requireUniqueStrings(project.stack, `${label}.stack`, 1);
    requireList(project.architecture, `${label}.architecture`);
    requireList(project.milestones, `${label}.milestones`, 3);

    assert(!ids.has(project.id), `${label}.id duplicates ${project.id}.`);
    assert(!slugs.has(project.slug), `${label}.slug duplicates ${project.slug}.`);
    ids.add(project.id);
    slugs.add(project.slug);

    assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id ?? ""), `${label}.id must use lowercase kebab-case.`);
    assert(project.id === project.slug, `${label}.id and ${label}.slug must match.`);
    assert(!("route" in project), `${label}.route must be derived by the framework instead of stored in project data.`);
    assert(/^SYS \/ [A-Z0-9-]+$/.test(project.code ?? ""), `${label}.code must follow SYS / PROJECT.`);
    assert(/ (?:Platform|Pipeline|System|Application|Service|Research)$/.test(project.category ?? ""), `${label}.category must end with a shared system type.`);
    assert(projectStatuses.has(project.status), `${label}.status must use the shared project lifecycle vocabulary.`);
    assert(projectSignals.has(project.signal), `${label}.signal must be active or muted.`);

    for (const [stageIndex, stage] of (project.architecture ?? []).entries()) {
      const stageLabel = `${label}.architecture[${stageIndex}]`;
      requireString(stage.index, `${stageLabel}.index`);
      requireString(stage.name, `${stageLabel}.name`);
      requireString(stage.description, `${stageLabel}.description`);
      assert(stage.index === String(stageIndex + 1).padStart(2, "0"), `${stageLabel}.index must follow its sequence position.`);
    }

    const milestoneStates = (project.milestones ?? []).map((milestone) => milestone.state);
    assert(
      JSON.stringify(milestoneStates) === JSON.stringify(milestoneSequence),
      `${label}.milestones must follow Current, Next, Future.`,
    );

    for (const [milestoneIndex, milestone] of (project.milestones ?? []).entries()) {
      const milestoneLabel = `${label}.milestones[${milestoneIndex}]`;
      requireString(milestone.state, `${milestoneLabel}.state`);
      requireString(milestone.title, `${milestoneLabel}.title`);
      requireString(milestone.description, `${milestoneLabel}.description`);
    }

    if (project.hasCaseStudy) {
      const caseStudy = project.caseStudy;
      assert(caseStudy && typeof caseStudy === "object", `${label} must include caseStudy content.`);
      requireString(caseStudy?.eyebrow, `${label}.caseStudy.eyebrow`);
      requireString(caseStudy?.description, `${label}.caseStudy.description`);
      requireString(caseStudy?.problem?.title, `${label}.caseStudy.problem.title`);
      requireString(caseStudy?.problem?.description, `${label}.caseStudy.problem.description`);
      requireString(caseStudy?.solution?.title, `${label}.caseStudy.solution.title`);
      requireString(caseStudy?.solution?.description, `${label}.caseStudy.solution.description`);
      requireUniqueStrings(caseStudy?.capabilities, `${label}.caseStudy.capabilities`);
      requireUniqueStrings(caseStudy?.challenges, `${label}.caseStudy.challenges`);
      requireUniqueStrings(caseStudy?.learnings, `${label}.caseStudy.learnings`);
      requireList(caseStudy?.links, `${label}.caseStudy.links`);

      const evidence = caseStudy?.evidence;
      assert(evidence && typeof evidence === "object", `${label} must include verified repository evidence.`);
      requireString(evidence?.eyebrow, `${label}.caseStudy.evidence.eyebrow`);
      requireString(evidence?.title, `${label}.caseStudy.evidence.title`);
      requireString(evidence?.description, `${label}.caseStudy.evidence.description`);
      requireString(evidence?.audit?.revision, `${label}.caseStudy.evidence.audit.revision`);
      requireString(evidence?.audit?.verifiedOn, `${label}.caseStudy.evidence.audit.verifiedOn`);
      requireString(evidence?.audit?.source, `${label}.caseStudy.evidence.audit.source`);
      requireString(evidence?.snapshot, `${label}.caseStudy.evidence.snapshot`);
      requireList(evidence?.metrics, `${label}.caseStudy.evidence.metrics`, 3);
      requireList(evidence?.findings, `${label}.caseStudy.evidence.findings`, 3);

      assert(
        /^[a-f0-9]{40}$/.test(evidence?.audit?.revision ?? ""),
        `${label}.caseStudy.evidence.audit.revision must be a full lowercase Git commit SHA.`,
      );
      const auditDate = new Date(`${evidence?.audit?.verifiedOn ?? ""}T00:00:00Z`);
      assert(
        /^\d{4}-\d{2}-\d{2}$/.test(evidence?.audit?.verifiedOn ?? "")
          && !Number.isNaN(auditDate.getTime())
          && auditDate.toISOString().slice(0, 10) === evidence?.audit?.verifiedOn,
        `${label}.caseStudy.evidence.audit.verifiedOn must be a valid ISO date.`,
      );
      assert(
        new RegExp(
          `^https://github\\.com/[^/]+/[^/]+/commit/${evidence?.audit?.revision ?? ""}$`,
        ).test(evidence?.audit?.source ?? ""),
        `${label}.caseStudy.evidence.audit.source must identify the audited GitHub commit.`,
      );

      const metricLabels = new Set();

      for (const [metricIndex, metric] of (evidence?.metrics ?? []).entries()) {
        requireString(metric.value, `${label}.caseStudy.evidence.metrics[${metricIndex}].value`);
        requireString(metric.label, `${label}.caseStudy.evidence.metrics[${metricIndex}].label`);
        requireString(metric.description, `${label}.caseStudy.evidence.metrics[${metricIndex}].description`);
        assert(!metricLabels.has(metric.label), `${label}.caseStudy.evidence.metrics[${metricIndex}].label duplicates ${metric.label}.`);
        metricLabels.add(metric.label);
      }

      for (const [findingIndex, finding] of (evidence?.findings ?? []).entries()) {
        requireString(finding.state, `${label}.caseStudy.evidence.findings[${findingIndex}].state`);
        requireString(finding.title, `${label}.caseStudy.evidence.findings[${findingIndex}].title`);
        requireString(finding.description, `${label}.caseStudy.evidence.findings[${findingIndex}].description`);
        assert(["active", "muted"].includes(finding.signal), `${label}.caseStudy.evidence.findings[${findingIndex}].signal must be active or muted.`);
      }

      const linkLabels = new Set();
      const linkDestinations = new Set();

      for (const [linkIndex, link] of (caseStudy?.links ?? []).entries()) {
        requireString(link.label, `${label}.caseStudy.links[${linkIndex}].label`);
        requireString(link.href, `${label}.caseStudy.links[${linkIndex}].href`);
        assert(/^https:\/\//.test(link.href), `${label}.caseStudy.links[${linkIndex}].href must use HTTPS.`);
        assert(!linkLabels.has(link.label), `${label}.caseStudy.links[${linkIndex}].label duplicates ${link.label}.`);
        assert(!linkDestinations.has(link.href), `${label}.caseStudy.links[${linkIndex}].href duplicates ${link.href}.`);
        linkLabels.add(link.label);
        linkDestinations.add(link.href);
      }

      assert(
        linkDestinations.has(evidence?.audit?.source),
        `${label}.caseStudy.links must expose the structured audit source.`,
      );
    } else {
      assert(!project.caseStudy, `${label}.caseStudy must be omitted until hasCaseStudy is true.`);
    }
  }

  const featuredProjects = projects.filter((project) => project.featured);
  assert(featuredProjects.length === 1, "The project registry must contain exactly one featured project.");
  assert(featuredProjects.every((project) => project.hasCaseStudy), "The featured project must include a complete case study.");

  const guidePath = path.join(root, "docs", "PROJECT_FRAMEWORK.md");
  assert(await exists(guidePath), "docs/PROJECT_FRAMEWORK.md must explain how to register a project.");

  if (await exists(guidePath)) {
    const guide = await fs.readFile(guidePath, "utf8");
    assert(guide.includes("data/projects.json"), "The project guide must identify the registry source file.");
    assert(guide.includes("schemas/project.schema.json"), "The project guide must reference the formal schema.");
    assert(guide.includes("npm run validate"), "The project guide must include the validation command.");
  }

  if (projects.length) {
    try {
      const registryProject = projects.find((project) => project.hasCaseStudy) ?? projects[0];
      const [projectCore, projectRegistry, projectDetail, projectMetadata] = await Promise.all([
        import("../app/core/projects.js"),
        import("../components/sections/projects.js"),
        import("../components/sections/project-detail.js"),
        import("../app/core/metadata.js"),
      ]);

      const derivedRoutes = projects.map((project) => projectCore.getProjectRoute(project));
      assert(new Set(derivedRoutes).size === projects.length, "Derived project routes must remain unique.");

      for (const project of projects) {
        assert(
          projectCore.findProjectBySlug(projects, ` ${project.slug.toUpperCase()} `) === project,
          `The project resolver must find ${project.slug} without requiring route-specific code.`,
        );
      }

      const probe = structuredClone(registryProject);
      Object.assign(probe, {
        id: "framework-probe",
        slug: "framework-probe",
        code: "SYS / FRAMEWORK-PROBE",
        shortName: "Framework Probe",
        name: "Project Framework Probe",
        featured: false,
      });

      const probeRoute = projectCore.getProjectRoute(probe);
      const registryMarkup = projectRegistry.renderProjectsSections({
        ...projectData,
        projects: [...projects, probe],
      });
      const detailMarkup = projectDetail.renderProjectDetailSections(probe);

      assert(
        registryMarkup.includes(`href="${probeRoute}"`) && registryMarkup.includes(probe.name),
        "A data-only project record must generate its registry card and case-study route.",
      );
      assert(
        detailMarkup.includes(probe.name) && detailMarkup.includes(probe.objective),
        "A data-only project record must render through the shared case-study component.",
      );

      const pendingProbe = structuredClone(probe);
      Object.assign(pendingProbe, {
        id: "pending-framework-probe",
        slug: "pending-framework-probe",
        code: "SYS / PENDING-FRAMEWORK-PROBE",
        shortName: "Pending Probe",
        name: "Pending Project Framework Probe",
        status: "Planned",
        signal: "muted",
        hasCaseStudy: false,
      });
      delete pendingProbe.caseStudy;

      const pendingRoute = projectCore.getProjectRoute(pendingProbe);
      const pendingRegistryMarkup = projectRegistry.renderProjectsSections({
        ...projectData,
        projects: [...projects, pendingProbe],
      });
      const unavailableMarkup = projectDetail.renderProjectUnavailable(pendingProbe);
      const pendingMetadata = projectMetadata.resolveProjectMetadata(
        siteData,
        [...projects, pendingProbe],
        pendingProbe.slug,
      );

      assert(
        !projectCore.hasPublishedCaseStudy(pendingProbe)
          && pendingRegistryMarkup.includes(pendingProbe.name)
          && pendingRegistryMarkup.includes("Case study pending verified evidence")
          && !pendingRegistryMarkup.includes(`href="${pendingRoute}"`),
        "A project without verified evidence must remain visible without an active case-study link.",
      );
      assert(
        unavailableMarkup.includes(pendingProbe.name),
        "A direct route to an unpublished case study must render a clear unavailable state.",
      );
      assert(
        pendingMetadata.robots === "noindex, nofollow" && pendingMetadata.project === null,
        "An unpublished case study must remain excluded from indexing and structured project data.",
      );
    } catch (error) {
      failures.push(`The data-driven project rendering probe failed: ${error.message}`);
    }
  }

  return {
    caseStudyCount: projects.filter((project) => project.hasCaseStudy).length,
    projectCount: projects.length,
    contractVersion: "1.0.0",
  };
}

async function run() {
  const javascriptCount = await validateJavaScript();
  const { count: jsonCount, parsed } = await validateJson();
  const { count: cssCount, breakpointCount } = await validateCss();
  const routeCount = await validateDocumentContract();
  const metadataRouteCount = await validateMetadataContract(parsed.get("site.json"));
  const projectContract = await validateProjects(
    parsed.get("projects.json"),
    parsed.get("site.json"),
  );
  const contactChannelCount = validateContact(parsed.get("contact.json"));
  const automationContract = await validateAutomationContract();
  const deliveryContract = await validateDeliveryContract();

  if (failures.length) {
    console.error(`\nNEXUS quality gates failed (${failures.length}):`);
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exitCode = 1;
    return;
  }

  console.log("NEXUS quality gates passed");
  console.log(`  JavaScript syntax and imports: ${javascriptCount} modules`);
  console.log(`  JSON and content contracts: ${jsonCount} datasets, ${projectContract.caseStudyCount} case studies, ${contactChannelCount} contact channels`);
  console.log(`  Project framework: contract ${projectContract.contractVersion}, ${projectContract.projectCount} registered systems`);
  console.log(`  CSS structure and responsive rules: ${cssCount} stylesheets, ${breakpointCount} breakpoints`);
  console.log(`  Accessibility and routing contracts: ${routeCount} route patterns`);
  console.log(`  Metadata and social sharing: ${metadataRouteCount} route definitions, 1200x630 preview`);
  console.log(`  Automation contract: ${automationContract}`);
  console.log(`  Production delivery: ${deliveryContract}`);
  console.log("  Runtime dependencies: 0");
}

await run();
