import { config } from "../config.js";
import { agruparPorCategoria } from "../pluginLoader.js";
import { fsociety } from "../deco.js";

const MAPA_CATEGORIAS = {
  general: "general",
  herramientas: "herramientas",
  tools: "herramientas",
  descargas: "descargas",
  downloads: "descargas",
  owner: "owner",
  sistema: "sistema",
  system: "sistema",
  grupos: "grupos",
  group: "grupos",
  juegos: "juegos",
  games: "juegos",
  entretenimiento: "entretenimiento",
  hacking: "hackingEtico",
  hackingetico: "hackingEtico",
  ia: "ia",
  ai: "ia",
  nsfw: "nsfw",
};

function normalizar(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function resolverCategoria(nombreCategoria) {
  const clave = MAPA_CATEGORIAS[normalizar(nombreCategoria)] || "otros";
  return fsociety.ui.categories[clave] || fsociety.ui.categories.otros;
}

export default {
  command: ["menu", "menú", "help", "ayuda"],
  category: "General",
  description: "Muestra el listado de comandos disponibles",
  run: async (sock, msg, args, context) => {
    const { chatId, allPlugins } = context;
    const { ui, badge } = fsociety;

    const plugins = allPlugins || [];
    const categorias = agruparPorCategoria(plugins);
    const totalComandos = plugins.reduce((acc, p) => acc + p.command.length, 0);

    let texto = `${ui.headerWrap(config.botName)}\n\n`;
    texto += `${badge(ui.icons.owner, "Creador", config.creator)}\n`;
    texto += `${badge(ui.icons.commands, "Comandos", totalComandos)}\n`;
    texto += `${badge(ui.icons.clock, "Versión", config.version)}\n\n`;
    texto += `${ui.separator.normal}\n\n`;

    for (const [nombreCategoria, pluginsDeCategoria] of categorias) {
      const cat = resolverCategoria(nombreCategoria);
      const lines = pluginsDeCategoria.map((p) => {
        const comandoPrincipal = p.command[0];
        const desc = p.description ? ` — ${p.description}` : "";
        return `${ui.itemPrefix} *${comandoPrincipal}*${desc}`;
      });

      texto += fsociety.box(`${cat.icon} ${cat.label}`, lines);
      texto += "\n\n";
    }

    texto += `${ui.separator.short}\n`;
    texto += `${ui.footerDeco(`${ui.icons.wave} ${config.botName} — ${ui.selectorButtonText}`)}\n`;
    if (config.canal) {
      texto += `${ui.footerDeco(`📢 ${config.canal}`)}\n`;
    }

    await sock.sendMessage(chatId, { text: texto.trim() }, { quoted: msg });
  },
};
