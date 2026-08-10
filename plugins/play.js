const BASE_URL = "https://dv-edward.onrender.com";
const API_KEY = "edward";

const MAPA_ESTILO = {
  a: "α", b: "b", c: "c", d: "d", e: "ᧉ", f: "𝖿", g: "g", h: "һ", i: "ꪱ",
  j: "j", k: "k", l: "𝗅", m: "𝗆", n: "𝗇", o: "ᦅ", p: "𝗉", q: "q", r: "ꭇ",
  s: "𝗌", t: "ƚ", u: "𝗎", v: "v", w: "w", x: "x", y: "ᥡ", z: "z",
};

function estilizar(texto) {
  return String(texto)
    .toLowerCase()
    .split("")
    .map((c) => MAPA_ESTILO[c] || c)
    .join("");
}

const MAPA_BOLD = {
  a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶",
  j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿",
  s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
  A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
  J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
  S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
};

function bold(texto) {
  return String(texto)
    .split("")
    .map((c) => MAPA_BOLD[c] || c)
    .join("");
}

function formatearDuracion(segundos) {
  if (!segundos && segundos !== 0) return "Desconocida";
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${seg}`;
}

export default {
  command: ["play"],
  category: "tools",
  description: "Busca una canción en YouTube y la envía en audio. Uso: play <nombre de la canción>",
  run: async (sock, msg, args, context) => {
    const { chatId } = context;
    const query = args.join(" ").trim();

    if (!query) {
      await sock.sendMessage(
        chatId,
        {
          text: `✰ *${bold("Escribe el nombre de la canción")}*\n\n` +
                `🍃⃨^᪲  ✿⵿ⳋ \`${estilizar("ejemplo")}\` ち ៸៸ ぃ 🍂ᩨ\n` +
                `➮ ✰ *play* shape of you\n\n` +
                `╾ׄ𖹭ִ╼ᮀ✿ִ╾ᜒ𖹭╼ִ✿╾᩿ׄ𖹭╼ִ✿╾ᮀ𖹭ִ╼ᜒ✿ִ╾ׄ𖹭᩿╼\n` +
                `➮ *SlowedGenX ×͜×*`
        },
        { quoted: msg }
      );
      return;
    }

    try {
      await sock.sendMessage(
        chatId,
        {
          text: `🔎 *${bold("Buscando")}* ${bold(query)}...\n` +
                `➮ ⏳ Espera un momento...`
        },
        { quoted: msg }
      );

      const searchUrl = `${BASE_URL}/api/search/youtube?apiKey=${API_KEY}&query=${encodeURIComponent(
        query
      )}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      const resultados =
        searchData.result || searchData.data || searchData.results || [];
      const primerVideo = Array.isArray(resultados) ? resultados[0] : resultados;

      if (!primerVideo || !primerVideo.url) {
        await sock.sendMessage(
          chatId,
          {
            text: `✰ *${bold("No encontré resultados")}*\n` +
                  `➮ Para esa búsqueda: *${query}*`
          },
          { quoted: msg }
        );
        return;
      }

      const downloadUrl = `${BASE_URL}/api/download/ytaudio?url=${encodeURIComponent(
        primerVideo.url
      )}&apiKey=${API_KEY}`;
      const downloadRes = await fetch(downloadUrl);
      const downloadData = await downloadRes.json();

      const info = downloadData.result;

      if (!downloadData.status || !info || !info.download_url) {
        await sock.sendMessage(
          chatId,
          {
            text: `✰ *${bold("No pude obtener el audio")}*\n` +
                  `➮ Intenta con otra canción.`
          },
          { quoted: msg }
        );
        return;
      }

      const titulo = info.title || primerVideo.title || query;
      const duracion = formatearDuracion(info.duration);

      // Tarjeta con miniatura grande (externalAdReply)
      if (info.thumbnail) {
        await sock.sendMessage(
          chatId,
          {
            text:
              `🎵 *${bold(titulo)}*\n` +
              `⏱️ *Duración:* ${duracion}\n\n` +
              `╾ׄ𖹭ִ╼ᮀ✿ִ╾ᜒ𖹭╼ִ✿╾᩿ׄ𖹭╼ִ✿╾ᮀ𖹭ִ╼ᜒ✿ִ╾ׄ𖹭᩿╼\n` +
              `➮ *${bold("Enviando audio...")}*`,
            contextInfo: {
              externalAdReply: {
                title: titulo,
                body: duracion,
                thumbnailUrl: info.thumbnail,
                sourceUrl: primerVideo.url,
                mediaType: 1,
                renderLargerThumbnail: true,
              },
            },
          },
          { quoted: msg }
        );
      }

      await sock.sendMessage(
        chatId,
        {
          audio: { url: info.download_url },
          mimetype: "audio/mpeg",
          fileName: `${titulo.slice(0, 60)}.mp3`,
        },
        { quoted: msg }
      );
    } catch (err) {
      console.log("❌ Error en el comando play:", err);
      await sock.sendMessage(
        chatId,
        {
          text: `✰ *${bold("Ocurrió un error")}*\n` +
                `➮ Buscando o descargando la canción.`
        },
        { quoted: msg }
      );
    }
  },
};
