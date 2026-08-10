import { config } from "./config.js";

// ── Identidad del bot (tomada de tu config.js) ─────────────────────────
// Si tu config.js no tiene `repo` o `canal`, quedan vacíos y simplemente
// no se muestran esas líneas en el menú (ver uso de REPO_URL/GROUP_URL).
export const BOT_NAME = config.botName;
export const BOT_CREATOR = config.creator;
export const REPO_URL = config.repo || "";
export const GROUP_URL = config.canal || "";

const WIDTH = 46;

// ── Separadores ─────────────────────────────────────────────────────
const SEPARATORS = {
  normal: "═".repeat(WIDTH),
  short: "━".repeat(14),
  light: "·".repeat(20),
  heavy: `╠${"═".repeat(WIDTH)}╣`,
};

export function sep(type = "normal") {
  return SEPARATORS[type] || SEPARATORS.normal;
}

// ── Iconos ──────────────────────────────────────────────────────────
const ICONS = {
  owner: "👑", clock: "⏱️", commands: "⚙️", wave: "👋", heart: "💠",
  ai: "🧠", group: "🛡️", download: "📥", tools: "🧰",
  games: "🎮", system: "⚙️", nsfw: "🔞", premium: "💎",
};

export function getIcon(key) {
  return ICONS[key] || "•";
}

// ── Estados ─────────────────────────────────────────────────────────
const STATUS = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };

export function getStatus(key) {
  return STATUS[key] || STATUS.info;
}

// ── Categorías ──────────────────────────────────────────────────────
const CATEGORIES = {
  general:         { label: "MENÚ PRINCIPAL",  icon: "📜" },
  herramientas:    { label: "HERRAMIENTAS",    icon: "🧰" },
  descargas:       { label: "DESCARGAS",       icon: "📥" },
  owner:           { label: "OWNER",           icon: "👑" },
  sistema:         { label: "SISTEMA",         icon: "⚙️" },
  grupos:          { label: "GRUPOS",          icon: "🛡️" },
  juegos:          { label: "JUEGOS",          icon: "🎮" },
  entretenimiento: { label: "ENTRETENIMIENTO", icon: "🕹️" },
  hackingEtico:    { label: "HACKING ÉTICO",   icon: "💻" },
  ia:              { label: "IA",              icon: "🧠" },
  nsfw:            { label: "NSFW",            icon: "🔞" },
  otros:           { label: "OTROS",           icon: "✦" },
};

export function getCategoryLabel(key) {
  return (CATEGORIES[key] || CATEGORIES.otros).label;
}

export function getCategoryIcon(key) {
  return (CATEGORIES[key] || CATEGORIES.otros).icon;
}

// ── Texto ───────────────────────────────────────────────────────────
export function boldText(text = "") {
  return `*${text}*`;
}

export function themeText(text = "") {
  return `✦ ${text} ✦`;
}

export function item(text = "") {
  return `▸ ${text}`;
}

// Recorta texto largo para que no rompa el ancho de la caja.
// max = cantidad máxima de caracteres antes de cortar (sin contar "…").
export function clip(text = "", max = 40) {
  const t = String(text || "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trimEnd()}…`;
}

// badge(icon, label, value) — si value viene vacío, solo muestra el
// encabezado (para poner el valor en un item() en la línea de abajo,
// como hace menu2); si viene con valor, lo muestra todo en una línea.
export function badge(icon, label, value = "") {
  return value
    ? `▸ ${icon} *${label}:* ${value}`
    : `▸ ${icon} *${label}*`;
}

// ── Caja ────────────────────────────────────────────────────────────
export function box(title, lines = []) {
  const top = `╔${"═".repeat(WIDTH)}╗`;
  const mid = `╠${"═".repeat(WIDTH)}╣`;
  const bot = `╚${"═".repeat(WIDTH)}╝`;
  return [
    top,
    `║ ✦ ${boldText(title)}`,
    mid,
    ...lines.map((l) => `║ ${l}`),
    bot,
  ].join("\n");
}

// ── Uptime ──────────────────────────────────────────────────────────
export function formatUptime(seconds = 0) {
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor((seconds / 3600) % 24);
  const d = Math.floor(seconds / 86400);
  const partes = [];
  if (d) partes.push(`${d}d`);
  if (h) partes.push(`${h}h`);
  if (m) partes.push(`${m}m`);
  partes.push(`${s}s`);
  return partes.join(" ");
}

export default {
  BOT_NAME, BOT_CREATOR, REPO_URL, GROUP_URL,
  item, badge, sep, boldText, themeText, box, formatUptime, clip,
  getCategoryLabel, getCategoryIcon, getIcon, getStatus,
};

// ── Diseño fijo tipo "clasico" (llamativo, no editable) ────────────────
function fillTemplate(template, vars) {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => vars[key] ?? "");
}

export function renderHeader(vars) {
  const template =
    "⏜᷼ᩘ۪۪۪۪⏜۪۪۪۪۪᷼︵᷼       ❀      ⏜᷼ᩘ۪۪۪۪⏜۪۪۪۪۪᷼︵᷼\n" +
    "> Hola *{user}*, soy *{bot}*, bienvenidx a mi menú.\n" +
    "╭┈┈↷\n" +
    "> *✦* Versión › *{version}*\n" +
    "> *✦* Comandos totales › *{total}*\n" +
    "> *✦* Categorías › *{categories}*\n" +
    "{channelLine}" +
    "╰ ━ ─ ━ ─ ☞︎︎︎ ✰ ☜︎︎︎ ─ ━ ─ ━ ╯\n\n";
  return fillTemplate(template, vars);
}

export function renderSection(vars) {
  const template =
    "╭┈ ࣪ {icon}⌒⏜ ׅ *{title}* ㅤ  ꒢∩᷼⌒\n" +
    "{commands}" +
    " ╰۫╼࣪╼࣪╾ ○ ···𖹭 ִֶ •┄┈┈┈┈┈┈┈┈• •┄ׅ꣸⃪ꠋ᰷\n\n";
  return fillTemplate(template, vars);
}

export function renderCommand(vars) {
  const template =
    " ┆╭┈ *○* • 🌾·ઈ {command}\n" +
    " ┆┆{description}\n";
  return fillTemplate(template, vars);
}

export function renderFooter(vars) {
  const template =
    "ㅤㅤㅤ⏜𖣣︶     {footer}     ׂᅟᅟ︶𖣣⏜\n" +
    "          ͝  ͝ ⏝             ⃜          ⏝ ͝  ͝";
  return fillTemplate(template, vars);
}
