export default {
  command: ['grabando', 'recording'],
  category: 'tools',
  description: 'Simula que el bot está grabando',

  run: async (sock, msg, args, context) => {
    const { chatId } = context;

    await sock.sendPresenceUpdate('recording', chatId);

    await new Promise(resolve => setTimeout(resolve, 4000));

    await sock.sendPresenceUpdate('paused', chatId);

    await sock.sendMessage(chatId, {
      text: '🎙️ Ya terminé de grabar.'
    }, { quoted: msg });
  }
};