// scripts/vercel/prune-deployments.mjs - Lista y borra despliegues viejos de Vercel para no agotar el Deployment Storage.
//
// Por qué existe: Vercel guarda una copia completa del build de CADA despliegue. Con un public/ pesado,
// unas pocas semanas de pushes llenan la cuota (10 GB en Hobby) y el panel empieza a avisar.
//
// Seguridad: por defecto NO borra nada (modo informe). Hay que pasar --yes explícitamente. Nunca toca
// el despliegue de producción actual ni los N más recientes que sirven de rollback.
//
// Uso:
//   VERCEL_TOKEN=xxx node scripts/vercel/prune-deployments.mjs              (informe)
//   VERCEL_TOKEN=xxx node scripts/vercel/prune-deployments.mjs --yes        (borra)
//   ... --keep-production=5 --keep-days=14
//
// El token se saca de https://vercel.com/account/tokens y se pasa por entorno: nunca se escribe en el repo.
const API = "https://api.vercel.com";
const PROJECT_ID = process.env.VERCEL_PROJECT_ID ?? "prj_nU0knSF2glVCoGquUQNHuvlhiWla";
const TEAM_ID = process.env.VERCEL_TEAM_ID ?? "team_CoM7Bw14q1OKhRvg6HFj3qvB";
const TOKEN = process.env.VERCEL_TOKEN;

const args = process.argv.slice(2);
const shouldDelete = args.includes("--yes");
const keepProduction = Number(args.find((a) => a.startsWith("--keep-production="))?.split("=")[1] ?? 3);
const keepDays = Number(args.find((a) => a.startsWith("--keep-days="))?.split("=")[1] ?? 7);

function fail(message) {
  console.error(`prune-deployments -> ${message}`);
  process.exit(1);
}

async function api(path) {
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(`${API}${path}${separator}teamId=${TEAM_ID}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!response.ok) fail(`${path} respondió ${response.status}: ${await response.text()}`);
  return response.json();
}

/** Recorre todas las páginas de despliegues del proyecto. */
async function listAllDeployments() {
  const all = [];
  let until = "";
  for (;;) {
    const page = await api(`/v6/deployments?projectId=${PROJECT_ID}&limit=100${until}`);
    all.push(...page.deployments);
    if (!page.pagination?.next) return all;
    until = `&until=${page.pagination.next}`;
  }
}

/** Id del despliegue que ahora mismo sirve el dominio de producción: intocable. */
async function readLiveProductionId() {
  const project = await api(`/v9/projects/${PROJECT_ID}`);
  return project.targets?.production?.id ?? null;
}

function formatDate(timestamp) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

async function main() {
  if (!TOKEN) fail("Falta VERCEL_TOKEN en el entorno (https://vercel.com/account/tokens).");

  const [deployments, liveProductionId] = await Promise.all([listAllDeployments(), readLiveProductionId()]);
  const cutoff = Date.now() - keepDays * 24 * 60 * 60 * 1000;

  // Los N despliegues de producción más recientes se conservan como red de rollback.
  const rollbackIds = new Set(
    deployments
      .filter((deployment) => deployment.target === "production" && deployment.state === "READY")
      .sort((left, right) => right.created - left.created)
      .slice(0, keepProduction)
      .map((deployment) => deployment.uid ?? deployment.id),
  );

  const keep = [];
  const remove = [];
  for (const deployment of deployments) {
    const id = deployment.uid ?? deployment.id;
    let reason = null;
    if (id === liveProductionId) reason = "producción en vivo";
    else if (rollbackIds.has(id)) reason = "rollback";
    else if (deployment.created > cutoff) reason = `reciente (<${keepDays}d)`;

    if (reason) keep.push({ deployment, reason });
    else remove.push(deployment);
  }

  console.log(`Proyecto ${PROJECT_ID}: ${deployments.length} despliegues.`);
  for (const { deployment, reason } of keep) {
    console.log(`  conservar  ${formatDate(deployment.created)}  ${deployment.state.padEnd(8)} ${deployment.url}  (${reason})`);
  }
  console.log(`\n${remove.length} candidatos a borrar:`);
  for (const deployment of remove) {
    console.log(`  borrar     ${formatDate(deployment.created)}  ${deployment.state.padEnd(8)} ${deployment.url}`);
  }

  if (remove.length === 0) return;
  if (!shouldDelete) {
    console.log("\nModo informe: no se ha borrado nada. Repite con --yes para borrarlos de verdad.");
    return;
  }

  let deleted = 0;
  for (const deployment of remove) {
    const id = deployment.uid ?? deployment.id;
    const response = await fetch(`${API}/v13/deployments/${id}?teamId=${TEAM_ID}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!response.ok) {
      console.error(`  fallo al borrar ${deployment.url}: ${response.status}`);
      continue;
    }
    deleted += 1;
  }
  console.log(`\nBorrados ${deleted} de ${remove.length}.`);
}

main();
