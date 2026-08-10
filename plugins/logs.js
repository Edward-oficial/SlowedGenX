import { readFileSync, existsSync, statSync } from "fs";
import { join } from "path";
import config from "../../config.js";

export default {
  command: ["logs", "log"],
  category:sistema",
  description: "Muestra los últimos logs del bot",
  run: async (sock, msg, args, context) => {
    const { chatId, sender } = context;

    if (!config.owners.includes(sender)) {
      await sock.sendMessage(chatId, {
        text: "No tenés permiso para usar este comando.",
      }, { quoted: msg });
      return;
    }

    const cantidad = parseInt(args[0]) || 20;
    const archivosLogs = [
      join(process.cwd(), "logs.txt"),
      join(process.cwd(), "error.log"),
      join(process.cwd(), "out.log"),
    ];

    let logsEncontrados = false;

    for (const ruta of archivosLogs) {
      if (!existsSync(ruta)) continue;

      logsEncontrados = true;
      const stats = statSync(ruta);
      const tamaño = (stats.size / 1024).toFixed(2);
      const contenido = readFileSync(ruta, "utf-8");
      const lineas = contenido.split("\n").filter(Boolean);
      const ultimas = lineas.slice(-cantidad);

      await sock.sendMessage(chatId, {
        text:
          `Archivo: ${ruta.split("/").pop()}\n` +
          `Tamaño: ${tamaño} KB\n` +
          `Líneas: ${lineas.length}\n\n` +
          `${ultimas.join("\n").slice(0, 4000) || "Sin contenido"}`,
      }, { quoted: msg });
    }

    if (!logsEncontrados) {
      await sock.sendMessage(chatId, {
        text: "No se encontraron archivos de logs.",
      }, { quoted: msg });
    }
  },
};