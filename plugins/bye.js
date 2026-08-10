import { esAdminDeGrupo } from "../../groupHelpers.js";
import { actualizarConfigGrupo } from "../../groupSettings.js";

export default {
  command: ["setbye"],
  category: "group",
  description: "Activa o desactiva la despedida: setbye on / setbye off",
  run: async (sock, msg, args, context) => {
    const { chatId, sender, esGrupo } = context;
    if (!esGrupo) return;

    const esAdmin = await esAdminDeGrupo(sock, chatId, sender);
    if (!esAdmin) {
      return sock.sendMessage(chatId, { text: "Solo las/los admins pueden usar este comando." }, { quoted: msg });
    }

    const valor = args[0]?.toLowerCase();
    if (valor !== "on" && valor !== "off") {
      return sock.sendMessage(chatId, { text: "Usá: setbye on  ó  setbye off" }, { quoted: msg });
    }

    actualizarConfigGrupo(chatId, { bye: valor === "on" });
    await sock.sendMessage(chatId, {
      text: `Despedida ${valor === "on" ? "activada" : "desactivada"}.`,
    });
  },
};