import fs from "fs";
import path from "path";
let sharp = null;
try {
  const mod = await import("sharp");
  sharp = mod.default;
} catch {}

import { config } from "../config.js";
import {
  clip,
  BOT_NAME,
  GROUP_URL,
  getCategoryLabel,
  getCategoryIcon,
  renderHeader,
  renderSection,
  renderCommand,
  renderFooter,
} from "../deco.js";

function clean(value = "") {
  return String(value || "").trim();
}

function normalizeCategory(value = "") {
  const key = clean(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const alias = {
    menu: "general", general: "general",
    herramientas: "herramientas", tools: "herramientas",
    descargas: "descargas", downloads: "descargas",
    owner: "owner", dueno: "owner",
    grupos: "grupos", group: "grupos",
    juegos: "juegos", games: "juegos",
    sistema: "sistema", system: "sistema",
    entretenimiento: "entretenimiento",
    hackingetico: "hackingEtico", hacking: "hackingEtico",
    ia: "ia", ai: "ia",
    nsfw: "nsfw",
    otros: "otros",
  };
  return alias[key] || key || "otros";
}

const CATEGORY_ORDER = [
  "general", "descargas", "herramientas", "entretenimiento",
  "juegos", "grupos", "sistema", "hackingEtico", "ia", "nsfw", "owner", "otros",
];

function collectCommands(plugins = []) {
  const byMain = new Map();
  for (const p of plugins) {
    if (!p?.command?.length) continue;
    const main = clean(p.command[0]).toLowerCase();
    if (byMain.has(main)) continue;
    byMain.set(main, {
      main,
      aliases: p.command.slice(1).map(clean).filter(Boolean),
      description: clean(p.description || ""),
      category: normalizeCategory(p.category || "otros"),
      isOwner: Boolean(p.isOwner),
    });
  }
  return Array.from(byMain.values());
}

function groupByCategory(commands) {
  const out = {};
  for (const c of commands) {
    if (!out[c.category]) out[c.category] = [];
    out[c.category].push(c);
  }
  return out;
}

function sortedCategoryNames(categories) {
  return Object.keys(categories).sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
}

function buildFullMenu(categories, totalCommands, botDisplayName, senderName) {
  const names = sortedCategoryNames(categories);

  const channelLine = GROUP_URL ? `> *✦* Canal › *${GROUP_URL}*\n` : "";

  let texto = renderHeader({
    user: senderName || "usuario",
    bot: botDisplayName,
    version: config.version || "1.0.0",
    total: String(totalCommands),
    categories: String(names.length),
    channelLine,
  });

  for (const catKey of names) {
    const cmds = categories[catKey].sort((a, b) => a.main.localeCompare(b.main));
    const catLabel = getCategoryLabel(catKey);
    const catIcon = getCategoryIcon(catKey);

    let commandsBlock = "";
    for (const cmd of cmds) {
      const ownerTag = cmd.isOwner ? " (owner)" : "";
      commandsBlock += renderCommand({
        command: `${cmd.main}${ownerTag}`,
        description: cmd.description ? clip(cmd.description, 40) : "Sin descripción",
      });
    }

    texto += renderSection({
      icon: catIcon,
      title: catLabel,
      commands: commandsBlock,
    });
  }

  texto += renderFooter({ footer: `${botDisplayName} ✦` });

  return texto;
}

let cachedImageBuffer = null;
let cachedImageKey = "";

function getImageCandidates() {
  return [
    path.join(process.cwd(), "imagenes", "menu.mp4"),
    path.join(process.cwd(), "imagenes", "menu.png"),
    path.join(process.cwd(), "imagenes", "menu.jpeg"),
  ];
}

async function getMenuImageBuffer() {
  const imagePath = getImageCandidates().find((p) => fs.existsSync(p));
  if (!imagePath) return null;

  const isGif = imagePath.toLowerCase().endsWith(".mp4");
  try {
    const stat = fs.statSync(imagePath);
    const cacheKey = `${imagePath}:${stat.mtimeMs}:${stat.size}`;
    if (cachedImageBuffer && cachedImageKey === cacheKey) return cachedImageBuffer;

    const original = fs.readFileSync(imagePath);
    let optimized = original;

    if (!isGif && sharp) {
      optimized = await sharp(original)
        .rotate()
        .resize({ width: 1280, withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
    }

    cachedImageBuffer = { buffer: optimized, isGif };
    cachedImageKey = cacheKey;
    return cachedImageBuffer;
  } catch (err) {
    console.log("[MENU] Error imagen:", err.message);
    return null;
  }
}

async function sendMenuMedia(sock, chatId, msg, text, media) {
  if (media?.buffer) {
    try {
      const payload = media.isGif
        ? { video: media.buffer, gifPlayback: true, caption: text }
        : { image: media.buffer, caption: text };
      await sock.sendMessage(chatId, payload, { quoted: msg });
      return;
    } catch (err) {
      console.log("[MENU] Fallo envío con media:", err.message);
    }
  }
  await sock.sendMessage(chatId, { text }, { quoted: msg });
}

function normalizeNumber(input = "") {
  return String(input || "").split("@")[0].split(":")[0].replace(/\D/g, "");
}

export default {
  command: ["menu", "menú", "help", "ayuda"],
  category: "General",
  description: "Muestra el menú completo con todos los comandos",
  run: async (sock, msg, args, context) => {
    const { chatId, allPlugins } = context;

    try {
      const botDisplayName = config.botName || BOT_NAME;
      const senderName = msg.pushName || "usuario";

      const commands = collectCommands(allPlugins || []);
      const categories = groupByCategory(commands);

      const texto = buildFullMenu(categories, commands.length, botDisplayName, senderName);
      const media = await getMenuImageBuffer();

      await sendMenuMedia(sock, chatId, msg, texto, media);
    } catch (err) {
      console.error("[MENU] Error:", err);
      await sock.sendMessage(
        chatId,
        { text: "❌ No pude generar el menú: " + err.message },
        { quoted: msg }
      );
    }
  },
};
