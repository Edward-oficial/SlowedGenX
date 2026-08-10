import { esAdminDeGrupo } from "../../groupHelpers.js";
import { actualizarConfigGrupo } from "../../groupSettings.js";

export default {
  command: ["setwelcome"],
  category: "group",
  description: "Activa o desactiva la bienvenida: setwelcome on / setwelcome off",
  run: async (sock, msg, args, context) => {
    const { chatId, sender, esGrupo } = context;
    if (!esGrupo) return;

    const esAdmin = await esAdminDeGrupo(sock, chatId, sender);
    if (!esAdmin) {
      return sock.sendMessage(chatId, { text: "Solo las/los admins pueden usar este comando." }, { quoted: msg });
    }

    const valor = args[0]?.toLowerCase();
    if (valor !== "on" && valor !== "off") {
      return sock.sendMessage(chatId, { text: "Usá: setwelcome on  ó  setwelcome off" }, { quoted: msg });
    }

    actualizarConfigGrupo(chatId, { welcome: valor === "on" });
    await sock.sendMessage(chatId, {
      text: `Bienvenida ${valor === "on" ? "activada" : "desactivada"}.`,
    });
  },
};