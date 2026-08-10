export const fsociety = {
  name: "sexo",

  ui: {
    separator: {
      normal: "═".repeat(46),
      short: "━".repeat(14),
      light: "·".repeat(20),
      heavy: `╠${"═".repeat(46)}╣`,
    },
    itemPrefix: "▸",
    selectorButtonText: "✦ ABRIR HUB ✦",
    headerWrap: (t) => `╔══ ✦ *${t}* ✦ ══╗`,
    footerDeco: (line) => `║ ${line}`,

    icons: {
      owner: "👑", clock: "⏱️", commands: "⚙️", wave: "👋", heart: "💠",
      ai: "🧠", group: "🛡️", download: "📥", tools: "🧰",
      games: "🎮", system: "⚙️", nsfw: "🔞", premium: "💎",
    },

    status: { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" },

    progress: { full: "■", empty: "□" },
    border: { tl: "╔", tr: "╗", bl: "╚", br: "╝", h: "═", v: "║" },

    fonts: { boldTitles: true },

    categories: {
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
    },
  },

  // Caja de doble línea fija (46 cols), igual que buildTopPanel/buildFooter
  // del menú FSOCIETY-V1: encabezado siempre del mismo ancho sin importar
  // el largo del título, y todo el contenido cerrado dentro del bloque.
  box: (title, lines = []) => {
    const width = 46;
    const top = `╔${"═".repeat(width)}╗`;
    const mid = `╠${"═".repeat(width)}╣`;
    const bot = `╚${"═".repeat(width)}╝`;
    return [
      top,
      `║ ✦ *${title}*`,
      mid,
      ...lines.map((l) => `║ ${l}`),
      bot,
    ].join("\n");
  },

  badge: (e, l, v) => `▸ ${e} *${l}:* ${v}`,
};
