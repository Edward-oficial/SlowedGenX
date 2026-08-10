const API_URL = "https://dv-edward.onrender.com/api/tools/qr";
const API_KEY = "edward";

export default {
  command: ["qr"],
  category: "tools",
  description: "Genera un código QR a partir de un texto o link",
  run: async (sock, msg, args, context) => {
    const { chatId } = context;

    const texto = args.join(" ").trim();
    if (!texto) {
      await sock.sendMessage(chatId, {
        text: "Escribí el texto o link a convertir.\nUso: *qr <texto o url>*",
      }, { quoted: msg });
      return;
    }

    try {
      await sock.sendMessage(chatId, { text: "Generando QR..." }, { quoted: msg });

      const url = `${API_URL}?apiKey=${API_KEY}&text=${encodeURIComponent(texto)}`;
      const res = await fetch(url);
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (!data.status && !data.url) {
          await sock.sendMessage(chatId, {
            text: "Error generando el QR: " + (data.error || "fallo desconocido"),
          }, { quoted: msg });
          return;
        }
        await sock.sendMessage(chatId, {
          image: { url: data.url || data.result },
          caption: `QR generado para: ${texto}`,
        }, { quoted: msg });
        return;
      }

      if (!res.ok) {
        await sock.sendMessage(chatId, {
          text: `Error generando el QR (código ${res.status}).`,
        }, { quoted: msg });
        return;
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      await sock.sendMessage(chatId, {
        image: buffer,
        caption: `QR generado para: ${texto}`,
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(chatId, { text: "Error: " + err.message }, { quoted: msg });
    }
  },
};
