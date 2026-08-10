import { obtenerConfigGrupo } from "./groupSettings.js";
import { formatoUsuario, aplicarPlantilla } from "./groupHelpers.js";
import { config } from "./config.js";

export async function onGroupParticipantsUpdate(sock, update, metadata) {
  if (!metadata) return;
  const { id: chatId, participants, action } = update;
  const configGrupo = obtenerConfigGrupo(chatId);

  if (action === "add" && configGrupo.welcome) {
    for (const participante of participants) {
      const formato = await formatoUsuario(sock, chatId, participante);
      const texto = aplicarPlantilla(config.welcome.mensajeBienvenida, {
        mention: formato.texto,
        grupo: metadata.subject,
        cantidad: metadata.participants.length,
      });
      await sock.sendMessage(chatId, { text: texto, mentions: formato.mentions });
    }
  }

  if (action === "remove" && configGrupo.bye) {
    for (const participante of participants) {
      const formato = await formatoUsuario(sock, chatId, participante);
      const texto = aplicarPlantilla(config.welcome.mensajeDespedida, {
        mention: formato.texto,
        grupo: metadata.subject,
        cantidad: metadata.participants.length,
      });
      await sock.sendMessage(chatId, { text: texto, mentions: formato.mentions });
    }
  }
}
