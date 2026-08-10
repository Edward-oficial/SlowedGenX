import { obtenerConfigGrupo, actualizarConfigGrupo } from "../groupSettings.js";
import { esAdminDeGrupo } from "../groupHelpers.js";

export default {
  command: ["bienvenida", "welcome", "despedida", "bye"],
  category: "Grupo",
  description: "Activa o desactiva los mensajes de bienvenida y despedida",
  run: async (sock, msg, args, context) => {
    const { chatId, sender, esGrupo, body } = context;

    if (!esGrupo) {
      await sock.sendMessage(chatId, { text: "Este comando es solo para grupos." }, { quoted: msg });
      return;
    }

    const esAdmin = await esAdminDeGrupo(sock, chatId, sender);
    if (!esAdmin) {
      await sock.sendMessage(chatId, { text: "Solo un admin del grupo puede cambiar esto." }, { quoted: msg });
      return;
    }

    const primeraPalabra = body.trim().split(/\s+/)[0].toLowerCase();
    const esBienvenida = primeraPalabra === "bienvenida" || primeraPalabra === "welcome";
    const clave = esBienvenida ? "welcome" : "bye";
    const nombre = esBienvenida ? "bienvenida" : "despedida";

    const estado = (args[0] || "").toLowerCase();

    if (estado !== "on" && estado !== "off") {
      const actual = obtenerConfigGrupo(chatId)[clave];
      await sock.sendMessage(chatId, {
        text: `La ${nombre} esta ${actual ? "activada" : "desactivada"}.\nUso: *${primeraPalabra} on* o *${primeraPalabra} off*`,
      }, { quoted: msg });
      return;
    }

    actualizarConfigGrupo(chatId, { [clave]: estado === "on" });

    await sock.sendMessage(chatId, {
      text: `${nombre.charAt(0).toUpperCase()}${nombre.slice(1)} ${estado === "on" ? "activada" : "desactivada"}.`,
    }, { quoted: msg });
  },
};
