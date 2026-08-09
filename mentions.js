export async function mencionarATodos(sock, chatId, texto = "") {
  const metadata = await sock.groupMetadata(chatId);
  const jids = metadata.participants.map((p) => p.id);

  await sock.sendMessage(chatId, {
    text: texto,
    mentions: jids,
  });
}

export async function mencionOculta(sock, chatId, texto = "") {
  const metadata = await sock.groupMetadata(chatId);
  const jids = metadata.participants.map((p) => p.id);

  await sock.sendMessage(chatId, {
    text: texto,
    mentions: jids,
  });
}

export async function mencionarUsuario(sock, chatId, jid, texto = "") {
  await sock.sendMessage(chatId, {
    text: texto,
    mentions: [jid],
  });
}

export async function mencionarAutorDelMensaje(sock, msg, texto = "") {
  const chatId = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;

  await sock.sendMessage(
    chatId,
    { text: texto, mentions: [sender] },
    { quoted: msg }
  );
}
