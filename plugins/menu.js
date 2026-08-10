import fs from "fs";
import path from "path";
import { config } from "../config.js";

// ─────────────────────────────────────────────
// Metadatos por categoría (título, icono, descripción)
// Ajusta o agrega categorías según tus carpetas en /plugins
// ─────────────────────────────────────────────
const CATEGORY_META = {
  main: { title: "PRINCIPAL", icon: "🌙", description: "Comandos principales del bot" },
  tools: { title: "HERRAMIENTAS", icon: "🛠️", description: "Utilidades varias" },
  sockets: { title: "SOCKETS", icon: "🔌", description: "Gestión de sub-bots" },
  downloaders: { title: "DESCARGAS", icon: "📥", description: "Descarga contenido de otras plataformas" },
  games: { title: "JUEGOS", icon: "🎮", description: "Minijuegos y gacha" },
  group: { title: "GRUPO", icon: "👑", description: "Administración de grupos" },
  owner: { title: "OWNER", icon: "⚙️", description: "Solo para el dueño del bot" },
  economy: { title: "ECONOMÍA", icon: "💰", description: "Sistema de economía" },
  anime: { title: "ANIME", icon: "🌸", description: "Comandos de anime" },
  pokegame: { title: "POKEGAME", icon: "🔴", description: "Sistema Pokémon" },
  general: { title: "GENERAL", icon: "✦", description: "Comandos generales" },
};

function metaDeCategoria(categoria) {
  const key = String(categoria || "general").toLowerCase();
  return (
    CATEGORY_META[key] || {
      title: key.toUpperCase(),
      icon: "✦",
      description: `Comandos de ${key}`,
    }
  );
}

function agrupar(plugins) {
  const grupos = new Map();
  for (const plugin of plugins) {
    const categoria = plugin.category || "general";
    if (!grupos.has(categoria)) grupos.set(categoria, []);
    grupos.get(categoria).push(plugin);
  }
  return grupos;
}

function renderComando(plugin) {
  const principal = plugin.command[0];
  const alias = plugin.command.length > 1 ? ` (${plugin.command.slice(1).join(", ")})` : "";
  const descripcion = plugin.description || "Sin descripción";
  return ` ┆╭┈ *○* • 🌾·ઈ ${principal}${alias}\n ┆┆${descripcion}\n`;
}

function renderSeccion(categoria, plugins) {
  const meta = metaDeCategoria(categoria);
  const comandos = plugins.map(renderComando).join("");
  return (
    `╭┈ ࣪ ${meta.icon}⌒⏜ ׅ *${meta.title}* ㅤ  ꒢∩᷼⌒\n` +
    ` ┆┆${meta.description}\n` +
    comandos +
    ` ╰۫╼࣪╼࣪╾ ○ ···𖹭 ִֶ •┄┈┈┈┈┈┈┈┈• •┄ׅ꣸⃪ꠋ᰷\n`
  );
}

export default {
  command: ["menu"],
  category: "main",
  description: "Muestra el menú de comandos",
  run: async (sock, msg, args, context) => {
    const { chatId, sender, allPlugins } = context;

    const totalComandos = allPlugins.reduce((acc, p) => acc + p.command.length, 0);
    const tipo = chatId.endsWith("@g.us") ? "Grupal" : "Privado";
    const mention = "@" + sender.split("@")[0];
    const channelLine = config.canal ? `> *✦* Canal › *${config.canal}*\n` : "";

    const header =
      `⏜᷼ᩘ۪۪۪۪⏜۪۪۪۪۪᷼︵᷼       ❀      ⏜᷼ᩘ۪۪۪۪⏜۪۪۪۪۪᷼︵᷼\n` +
      `> Hola *${mention}* soy *${config.botName}*, bienvenidx a mi menú.\n` +
      `╭┈┈↷\n` +
      `> *✦* Versión › *${config.version}*\n` +
      `> *✦* Tipo › *${tipo}*\n` +
      `> *✦* Comandos totales › *${totalComandos}*\n` +
      `> ­\n` +
      channelLine +
      `╰ ━ ─ ━ ─ ☞︎︎︎ ✰ ☜︎︎︎ ─ ━ ─ ━ ╯\n\n`;

    const grupos = agrupar(allPlugins);
    let secciones = "";
    for (const [categoria, plugins] of grupos) {
      secciones += renderSeccion(categoria, plugins);
    }

    const footer =
      `ㅤㅤㅤ⏜𖣣︶         ${config.creator} ׂᅟᅟ︶𖣣⏜\n` +
      `                      ͝  ͝ ⏝             ⃜          ⏝ ͝  ͝`;

    const texto = header + secciones + footer;

    const rutaImagen = path.join(process.cwd(), "imagenes", "menu.jpeg");

    if (fs.existsSync(rutaImagen)) {
      await sock.sendMessage(
        chatId,
        {
          image: fs.readFileSync(rutaImagen),
          caption: texto,
          mentions: [sender],
        },
        { quoted: msg }
      );
    } else {
      await sock.sendMessage(
        chatId,
        { text: texto, mentions: [sender] },
        { quoted: msg }
      );
    }
  },
};
