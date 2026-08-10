import { execSync } from "child_process";
import { config } from "../config.js";

// Extrae solo los dígitos, sin importar si el sender viene como
// "1234@s.whatsapp.net", "1234@lid" o el número pelado.
const soloNumero = (valor) => String(valor || "").replace(/\D/g, "");

const esOwner = (sender) => {
  const numeroSender = soloNumero(sender);
  if (!numeroSender) return false;
  return (config.owners || []).some((o) => soloNumero(o) === numeroSender);
};

export default {
  command: ["update", "actualizar", "gitpull"],
  category: "owner",
  description: "Actualiza el bot desde GitHub sin reiniciar",
  run: async (sock, msg, args, context) => {
    const { chatId, sender, recargarComandos } = context;

    if (!esOwner(sender)) {
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

      let recargoOk = false;
      if (typeof recargarComandos === "function") {
        await recargarComandos();
        recargoOk = true;
      }

      await sock.sendMessage(chatId, {
        text:
          `Actualizado\n` +
          `${antes.slice(0, 7)} → ${despues.slice(0, 7)}\n` +
          `${cambios.length} archivos\n` +
          (recargoOk
            ? "Comandos recargados."
            : "⚠️ No se pudo recargar comandos en caliente, reiniciá el bot manualmente."),
      }, { quoted: msg });
    } catch (err) {
      await sock.sendMessage(chatId, {
        text: "Error:\n" + err.message,
      }, { quoted: msg });
    }
  },
};
