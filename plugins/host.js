export default {
  command: ['host', 'hosting'],
  category: 'tools',
  description: 'Muestra tarjeta de host estilo Baileys',

  run: async (sock, msg, args, context) => {
    const { chatId } = context;

    // Enviar imagen con tarjeta estilo Baileys
    await sock.sendMessage(chatId, {
      image: { url: 'http://duancdn.onrender.com/cdn/e6fcc52bf010bc9cd291f26e.png' },
      caption: '🚀 *XHOST - THEBESTHOSTING*\n\n💰 *PRECIO ESPECIAL: $0/mes*\n🔗 https://xhost.hidenfree.com\n\n⚡ Despliegue en segundos\n📡 99.9% Uptime garantizado',
      contextInfo: {
        mentionedJid: [msg.key.participant || msg.key.remoteJid],
        forwardingScore: 9999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363291565656656@newsletter',
          newsletterName: 'XHOST OFERTA',
          serverMessageId: 1
        },
        externalAdReply: {
          title: 'XHOST - THEBESTHOSTING',
          body: '💰 Solo $0/mes',
          thumbnailUrl: 'http://duancdn.onrender.com/cdn/e6fcc52bf010bc9cd291f26e.png',
          sourceUrl: 'https://xhost.hidenfree.com',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });
  }
};