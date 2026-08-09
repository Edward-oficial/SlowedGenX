import { config } from "../config.js";

const GENERATOR_URL = "https://botgenx.onrender.com";

export default {
  command: ["gen", "generar", "botgen"],
  category: "General",
  description: "Genera un bot nuevo con IA y lo manda como zip",
  run: async (sock, msg, args, context) => {
    const { chatId } = context;

    const texto = args.join(" ").trim();
    const partes = texto.split("|").map((p) => p.trim());

    if (partes.length < 2 || !partes[0] || !partes[1]) {
      await sock.sendMessage(chatId, {
        text:
          "Uso: *gen NombreDelBot | especificaciones*\n\n" +
          "Ejemplo:\n" +
          "*gen Bot De Prueba | quiero un comando sticker que convierta una imagen citada en figurita, y un comando clima que devuelva el clima de una ciudad*",
      }, { quoted: msg });
      return;
    }

    const [botName, instruction] = partes;

    try {
      await sock.sendMessage(chatId, {
        text: "Generando, puede tardar un poco (el servidor a veces está dormido)...",
      }, { quoted: msg });

      const chatController = new AbortController();
      const chatTimeout = setTimeout(() => chatController.abort(), 60000);

      const chatRes = await fetch(`${GENERATOR_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ existingPlugins: [], instruction }),
        signal: chatController.signal,
      });
      clearTimeout(chatTimeout);

      const chatData = await chatRes.json();

      if (!chatData.status) {
        await sock.sendMessage(chatId, {
          text: "Error generando los comandos: " + (chatData.error || "fallo desconocido"),
        }, { quoted: msg });
        return;
      }

      const lista = chatData.plugins.map((p) => `• ${p.filename}`).join("\n");
      await sock.sendMessage(chatId, {
        text: `Listo, ${chatData.plugins.length} comando(s) generados:\n\n${lista}\n\nArmando el zip...`,
      }, { quoted: msg });

      const zipController = new AbortController();
      const zipTimeout = setTimeout(() => zipController.abort(), 30000);

      const zipRes = await fetch(`${GENERATOR_URL}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botName,
          creator: config.botName,
          ownerNumber: config.ownerNumber,
          plugins: chatData.plugins,
        }),
        signal: zipController.signal,
      });
      clearTimeout(zipTimeout);

      if (!zipRes.ok) {
        await sock.sendMessage(chatId, { text: "No se pudo armar el zip." }, { quoted: msg });
        return;
      }

      const zipBuffer = Buffer.from(await zipRes.arrayBuffer());

      await sock.sendMessage(chatId, {
        document: zipBuffer,
        fileName: `${botName.replace(/\s+/g, "-")}.zip`,
        mimetype: "application/zip",
      }, { quoted: msg });

    } catch (err) {
      const mensaje = err.name === "AbortError"
        ? "Se agoto el tiempo de espera, el servidor puede estar tardando en despertar. Probá de nuevo en unos segundos."
        : "Error: " + err.message;

      await sock.sendMessage(chatId, { text: mensaje }, { quoted: msg });
    }
  },
};
