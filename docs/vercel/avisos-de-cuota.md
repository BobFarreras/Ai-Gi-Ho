<!-- docs/vercel/avisos-de-cuota.md - Por qué Vercel avisa de cuota y cómo bajarla sin romper nada. -->
# Avisos de cuota en Vercel

Estado a **2026-09-12** (plan Hobby, cuentan **todos** los proyectos de la cuenta):

| Métrica | Uso | Límite | Comentario |
|---|---|---|---|
| **Deployment Storage** | 8,94 GB | 10 GB | **el que avisa** |
| Fluid Active CPU | 47m 11s | 4h | holgado |
| Functions Storage | 1,15 GB | 10 GB | holgado |
| Edge Requests | 67K | 1M | holgado |

## Por qué se llena el Deployment Storage

Vercel **congela una copia completa del build en cada despliegue** y la guarda hasta que se borra. No es
el sitio el que ocupa 9 GB: son cuarenta copias del sitio. Con `public/` en 236 MB, cada push a `main` o
`develop` costaba un cuarto de giga.

## Las tres palancas, de más a menos inmediata

### 1. Borrar despliegues viejos

```bash
VERCEL_TOKEN=xxx pnpm vercel:prune:deployments
```

Modo informe: lista qué conservaría y qué borraría, **sin tocar nada**. Conserva siempre el despliegue de
producción en vivo, los 3 de producción más recientes (red de rollback) y todo lo de los últimos 7 días;
el resto son candidatos. Para borrarlos de verdad hay que repetirlo con `--yes`:

```bash
VERCEL_TOKEN=xxx pnpm vercel:prune:deployments --yes
```

Ajustable con `--keep-production=5` y `--keep-days=14`. El token se saca de
[vercel.com/account/tokens](https://vercel.com/account/tokens) y **se pasa por entorno, nunca al repo**.

Borrar un despliegue es **irreversible**: se pierde la posibilidad de hacer rollback instantáneo a él.
Por eso el script nunca borra sin `--yes` y por eso conserva los más recientes.

### 2. Política de retención (para que no vuelva a pasar)

Panel de Vercel → proyecto → *Settings* → *Deployment Retention*. Pon a caducar los **previews** y los
**cancelados/errored** (30 días va bien) y deja producción con más margen. A partir de ahí se limpia solo
y el script de arriba pasa a ser algo excepcional.

### 3. Que cada despliegue pese menos

```bash
pnpm media:compress:videos:dry   # informe
pnpm media:compress:videos       # recomprime y reemplaza
```

Recomprime los `.mp4` de `public/assets/videos` a bitrate de web **sin cambiar rutas ni resolución**, así
que no hay que tocar ni una línea de código de la app. Salta los que ya están optimizados (por debajo de
4 Mbps) y no reemplaza si el ahorro no llega al 15%.

Aplicado el 2026-09-12: **119,9 MB → 56,2 MB (−53%)**. Los másters venían a 20-23 Mbps (calidad de
edición, no de web); ahora van a CRF 26, que se comparó fotograma a fotograma contra el original en la
fusión más exigente y no se distingue.

| Vídeo | Antes | Después |
|---|---|---|
| `fusion/gemgpt.mp4` | 22,6 MB | 8,9 MB |
| `fusion/kaclauli.mp4` | 21,4 MB | 9,4 MB |
| `fusion/pytgress.mp4` | 19,3 MB | 8,5 MB |
| `fusion/curshost.mp4` | 16,4 MB | 7,1 MB |
| `story/act-1/intro-act-1.mp4` | 13,6 MB | 6,1 MB |
| `story/act-2/intro-act-2.mp4` | 13,6 MB | 6,2 MB |
| `story/act-4/genNvim.mp4` | 4,8 MB | 1,9 MB |

**Lo que queda por hacer:** `public/assets/renders` son 62 MB y muchas piezas están a 4096×4096 o más
(`exec-fusion-super-c.webp` mide 5408×3072 y pesa 12,2 MB) para pintarse como overlay a pantalla completa.
Reescalarlas a 2048 px de lado mayor bajaría `public/` otros ~45 MB, pero es una decisión visual y no se
toca sin pedirlo.

### Por qué NO se movieron los vídeos a Supabase Storage

Era la idea inicial, pero el proyecto de Supabase está en plan **free**: 1 GB de almacenamiento (caben)
y **5 GB de salida al mes** (no caben). Sirviendo `intro-act-1.mp4` sin comprimir eran ~370
visualizaciones al mes antes de agotar la cuota, y con ella agotada los jugadores se quedan sin
cinemáticas hasta el mes siguiente. Se cambiaba un problema de almacenamiento por uno de disponibilidad.
Comprimidos y servidos desde el CDN de Vercel no hay ninguno de los dos.

## El otro aviso: "has not collected data during the past 7 days"

Ese es de **Web Analytics** y no tiene nada que ver con la cuota. Faltaban dos cosas:

1. El paquete `@vercel/analytics` con `<Analytics />` montado en el layout raíz. **Hecho** el 2026-09-12
   ([layout.tsx](../../src/app/layout.tsx)).
2. Activar *Web Analytics* en la pestaña **Analytics** del proyecto en el panel de Vercel. **Esto hay que
   hacerlo a mano**: sin activarlo, el script se carga pero los eventos se descartan. En Hobby el plan
   incluye 2.500 eventos al mes.

No confundirlo con la **telemetría propia** (`AnalyticsInitializer`), que escribe en Supabase y alimenta
el panel de admin. Esa es independiente y sigue apagada en producción: necesita las dos variables a la
vez, porque el cliente no emite sin la primera y la API `/api/analytics/batch` rechaza sin la segunda.

```
NEXT_PUBLIC_ANALYTICS_ENABLED=true
ANALYTICS_ENABLED=true
```

Las variables de entorno se aplican **en build**, así que después de añadirlas hay que redesplegar.
