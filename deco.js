import { config } from "./config.js";

export const BOT_NAME = config.botName;
export const BOT_CREATOR = config.creator;
export const REPO_URL = config.repo || "";
export const GROUP_URL = config.canal || "";

const WIDTH = 46;

const SEPARATORS = {
  normal: "═".repeat(WIDTH),
  short: "━".repeat(14),
  light: "·".repeat(20),
  heavy: `╠${"═".repeat(WIDTH)}╣`,
};

export function sep(type = "normal") {
  return SEPARATORS[type] || SEPARATORS.normal;
}

const ICONS = {
  owner: "👑", clock: "⏱️", commands: "⚙️", wave: "👋", heart: "💠",
  ai: "🧠", group: "🛡️", download: "📥", tools: "🧰",
  games: "🎮", system: "⚙️", nsfw: "🔞", premium: "💎",
};

export function getIcon(key) {
  return ICONS[key] || "•";
}

const STATUS = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };

export function getStatus(key) {
  return STATUS[key] || STATUS.info;
}

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

export function boldText(text = "") {
  return `*${text}*`;
}

export function themeText(text = "") {
  return `✦ ${text} ✦`;
}

export function item(text = "") {
  return `▸ ${text}`;
}

export function badge(icon, label, value = "") {
  return value
    ? `▸ ${icon} *${label}:* ${value}`
    : `▸ ${icon} *${label}*`;
}

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
  item, badge, sep, boldText, themeText, box, formatUptime,
  getCategoryLabel, getCategoryIcon, getIcon, getStatus,
};
