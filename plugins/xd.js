export default {
  command: ['escribiendo', 'typing'],
  category: 'tools',
  description: 'Muestra el estado escribiendo',

  run: async (sock, msg, args, context) => {
    const { chatId } = context;

    await sock.sendPresenceUpdate('composing', chatId);

    await new Promise(resolve => setTimeout(resolve, 3000));

    await sock.sendPresenceUpdate('paused', chatId);

    await sock.sendMessage(chatId, {
      text: '✍️ Terminé de escribir.'
    }, { quoted: msg });
  }
};