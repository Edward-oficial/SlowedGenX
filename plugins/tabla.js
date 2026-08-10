export default {
  command: ["tabla"],
  category: "tools",
  description: "xd",
  run: async (sock, msg, args, context) => {
    const { chatId, sender } = context;
    
    try {

await sock.sendTable(
    chatId,
    '',
    ['Columna 1', 'Columna 2'],
    [
    ['Fila 1', 'Fila 2']
  ],
    msg,
    {
      headerText: 'Title',
      footer: 'Pie'
    }

    } catch (err) {
      await sock.sendMessage(chatId, { text: "Error:\n" + err.message }, { quoted: msg });
    }
  },
};