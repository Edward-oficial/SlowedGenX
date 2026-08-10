import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import config from "../../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  command: ["update", "actualizar", "gitpull"],
  category: "Sistema",
  description: "Actualiza el bot desde GitHub sin reiniciar",
  run: async (sock, msg, args, context) => {
    const { chatId, sender, recargarComandos } = context;

    if (!config.owners.includes(sender)) {
      await sock.sendMessage(chatId, {
        text: "No tenés permiso para usar este comando.",
      }, { quoted: msg });
      return;
    }

    try {
      await sock.sendMessage(chatId, { text: "Actualizando..." }, { quoted: msg });

      const antes = execSync("git rev-parse HEAD").toString().trim();
      const pull = execSync("git pull").toString();

      if (pull.includes("Already up to date")) {
        await sock.sendMessage(chatId, {
          text: "Ya está actualizado.",
        }, { quoted: msg });
        return;
      }

      const despues = execSync("git rev-parse HEAD").toString().trim();
      const cambios = execSync(`git diff --name-only ${antes} ${despues}`)
        .toString().trim().split("\n").filter(Boolean);

      if (typeof recargarComandos === "function") {
        await recargarComandos();
      }

      await sock.sendMessage(chatId, {
        text:
          `Actualizado\n` +
          `${antes.slice(0, 7)} → ${despues.slice(0, 7)}\n` +
          `${cambios.length} archivos\n` +
          `Comandos recargados.`,
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(chatId, {
        text: "Error:\n" + err.message,
      }, { quoted: msg });
    }
  },
};