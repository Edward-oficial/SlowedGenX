export async function identidadNumero(sock, chatId, jid) {
  if (!jid) return null;
  if (jid.endsWith("@s.whatsapp.net")) return jid.split("@")[0];

  try {
    const metadata = await sock.groupMetadata(chatId);
    const participante = metadata.participants.find((p) => p.id === jid);
    if (participante?.phoneNumber) return participante.phoneNumber.split("@")[0];
    if (participante?.jid) return participante.jid.split("@")[0];
  } catch (_) {}

  return jid.split("@")[0];
}

export async function formatoUsuario(sock, chatId, jid) {
  const numero = await identidadNumero(sock, chatId, jid);
  return {
    numero,
    texto: `@${numero}`,
    mentions: [jid],
  };
}

export async function esAdminDeGrupo(sock, chatId, jid) {
  try {
    const metadata = await sock.groupMetadata(chatId);
    const participante = metadata.participants.find((p) => p.id === jid);
    return participante?.admin === "admin" || participante?.admin === "superadmin";
  } catch (_) {
    return false;
  }
}

export async function obtenerFotoPerfil(sock, jid) {
  try {
    return await sock.profilePictureUrl(jid, "image");
  } catch (_) {
    return null;
  }
}

export function nombreUsuario(sock, jid) {
  const contacto = sock.contacts?.[jid];
  return contacto?.notify || contacto?.name || contacto?.pushName || null;
}

export function aplicarPlantilla(plantilla, vars) {
  return plantilla.replace(/\$?\{(\w+)\}/g, (coincidencia, clave) =>
    Object.prototype.hasOwnProperty.call(vars, clave) ? vars[clave] : coincidencia
  );
}

export function obtenerMencionado(msg) {
  const info = msg.message?.extendedTextMessage?.contextInfo;
  return info?.mentionedJid?.[0] || info?.participant || null;
}
