export default {
  command: ['tabla', 'random'],
  category: 'tools',
  description: 'Muestra una tabla aleatoria',

  run: async (sock, msg, args, context) => {
    const { chatId } = context;

    const filas = [
      ['Rin', 'Disponible'],
      ['Sakura', 'Ocupada'],
      ['Neko', 'Disponible'],
      ['Yuki', 'Ausente'],
      ['Miku', 'Disponible'],
      ['Hinata', 'Ocupada'],
      ['Asuna', 'Disponible'],
      ['Zero Two', 'Ausente'],
      ['Rem', 'Disponible'],
      ['Emilia', 'Ocupada']
    ];

    const random = [...filas]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    await sock.sendTable(
      chatId,
      '',
      ['Personaje', 'Estado'],
      random,
      msg,
      {
        headerText: 'ATÚ BOT',
        footer: 'Tabla aleatoria'
      }
    );
  }
};