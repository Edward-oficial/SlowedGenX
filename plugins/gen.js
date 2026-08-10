const GENERATOR_URL = "https://botgenx.onrender.com";

async function generarYEnviar(sock, msg, chatId, botName, instruction) {
  try {
    await sock.sendMessage(chatId, {
      text: "Generando, puede tardar un poco (el servidor a veces esta dormido)...",
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
        creator: "Generado por WhatsApp",
        ownerNumber: "50400000000",
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
      ? "Se agoto el tiempo de espera, el servidor puede estar tardando en despertar. Escribi *gen* de nuevo para reintentar."
      : "Error: " + err.message;

    await sock.sendMessage(chatId, { text: mensaje }, { quoted: msg });
  }
}

export default {
  command: ["gen", "generar", "botgen"],
  category: "General",
  description: "Genera un bot nuevo con IA, paso a paso",
  run: async (sock, msg, args, context) => {
    const { chatId, esperarRespuesta } = context;

    await sock.sendMessage(chatId, {
      text: "¿Que nombre queres para el bot?",
    }, { quoted: msg });

    esperarRespuesta(async (sock2, msg2, ctx2) => {
      const botName = (ctx2.body || "").trim();

      if (!botName) {
        await sock2.sendMessage(chatId, {
          text: "No escribiste ningun nombre, cancelado. Escribi *gen* de nuevo para reintentar.",
        }, { quoted: msg2 });
        return;
      }

      await sock2.sendMessage(chatId, {
        text: `Buenisimo, "${botName}". Ahora contame que comandos queres que tenga (podes escribir todo lo que quieras en un solo mensaje).`,
      }, { quoted: msg2 });

      ctx2.esperarRespuesta(async (sock3, msg3, ctx3) => {
        const instruction = (ctx3.body || "").trim();

        if (!instruction) {
          await sock3.sendMessage(chatId, {
            text: "No escribiste nada, cancelado. Escribi *gen* de nuevo para reintentar.",
          }, { quoted: msg3 });
          return;
        }

        await generarYEnviar(sock3, msg3, chatId, botName, instruction);
      });
    });
  },
};
