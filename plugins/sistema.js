export default {
  command: ['sistema', 'system'],
  category: 'tools',
  description: 'Muestra información del sistema en tabla',

  run: async (sock, msg, args, context) => {
    const { chatId } = context;

    const memoria = process.memoryUsage();

    const filas = [
      ['Estado', '🟢 Online'],
      ['Node.js', process.version],
      ['RAM', `${Math.round(memoria.rss / 1024 / 1024)} MB`],
      ['PID', String(process.pid)],
      ['Plataforma', process.platform],
      ['Arquitectura', process.arch],
      ['Host', 'Xhost'], // Información del hosting
      ['Web', 'https://xhost.hidenfree.com'] // Enlace al host
    ];

    await sock.sendTable(
      chatId,
      '',
      ['Dato', 'Valor'],
      filas,
      msg,
      {
        headerText: '🖥️ Slowend',
        footer: 'Información del proceso | Host: Xhost'
      }
    );
  }
};