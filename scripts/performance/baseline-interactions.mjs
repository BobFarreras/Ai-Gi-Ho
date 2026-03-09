// scripts/performance/baseline-interactions.mjs - Ejecuta interacciones táctiles mínimas para provocar métricas INP por escenario.
async function safeTap(locator) {
  try {
    if ((await locator.count()) < 1) return false;
    await locator.first().click({ timeout: 2500 });
    return true;
  } catch {
    return false;
  }
}

async function runTaps(page, selectors) {
  for (const selector of selectors) {
    const ok = await safeTap(page.locator(selector));
    await page.waitForTimeout(250);
    if (ok) return true;
  }
  return false;
}

export async function runScenarioInteractions(page, scenarioId) {
  await page.waitForTimeout(900);
  if (scenarioId === "home") {
    await runTaps(page, ['button[aria-label*="Seleccionar"]', "button[aria-label*='Carta']", "button"]);
    await runTaps(page, ["button:has-text('Añadir')", "button:has-text('Insertar')", "button:has-text('Remover')"]);
  } else if (scenarioId === "market") {
    await runTaps(page, ["button[aria-label*='Seleccionar']", "button:has-text('Comprar')", "button"]);
    await runTaps(page, ["button:has-text('Comprar')", "button:has-text('Pack')", "button"]);
  } else {
    await runTaps(page, ["button:has-text('Atq')", "button:has-text('Def')", "button:has-text('Activar')", "button"]);
  }
  await page.waitForTimeout(1200);
}
