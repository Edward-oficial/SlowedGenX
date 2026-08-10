import { downloadMediaMessage } from "../media.js";

const CDN_URL = "https://duancdn.hidenfree.com/upload";

function detectarMedia(msg) {
  const directo = msg.message?.imageMessage || msg.message?.videoMessage || msg.message?.audioMessage;
  if (directo) {
    const tipo = msg.message.imageMessage ? "image" : msg.message.videoMessage ? "video" : "audio";
    return { mensajeParaDescargar: msg, mimetype: directo.mimetype, tipo };
  }

  const info = msg.message?.extendedTextMessage?.contextInfo;
  const citado = info?.quotedMessage;
  const citada = citado?.imageMessage || citado?.videoMessage || citado?.audioMessage;

  if (citada) {
    const tipo = citado.imageMessage ? "image" : citado.videoMessage ? "video" : "audio";
    return {
      mensajeParaDescargar: {
        message: citado,
        key: { remoteJid: null, id: info.stanzaId, participant: info.participant },
      },
      mimetype: citada.mimetype,
      tipo,
    };
  }

  return null;
}

export default {
  command: ["subir", "cdn"],
  category: "tools",
  description: "Sube un archivo a Duan CDN y devuelve el link",
  run: async (sock, msg, args, context) => {
    const { chatId, sender } = context;

    const encontrado = detectarMedia(msg);

    if (!encontrado) {
      await sock.sendMessage(chatId, {
        text: "Mandá una foto, video o audio con el texto *subir* como descripción, o citá uno ya enviado y escribí *subir*.",
      }, { quoted: msg });
      return;
    }

    const { mensajeParaDescargar, mimetype, tipo } = encontrado;
    if (mensajeParaDescargar.key) mensajeParaDescargar.key.remoteJid = chatId;

    try {
      await sock.sendMessage(chatId, { text: "Subiendo..." }, { quoted: msg });

      const buffer = await downloadMediaMessage(mensajeParaDescargar, "buffer", {});

      const ext = mimetype.split("/")[1]?.split(";")[0] || (tipo === "image" ? "jpg" : tipo === "video" ? "mp4" : "ogg");
      const blob = new Blob([buffer], { type: mimetype });

      const formData = new FormData();
      formData.append("file", blob, `archivo.${ext}`);
      formData.append("uid", sender.split("@")[0]);

      const res = await fetch(CDN_URL, { method: "POST", body: formData });
      const data = await res.json();

      if (!data.status) {
        await sock.sendMessage(chatId, {
          text: "Error subiendo el archivo: " + (data.error || "fallo desconocido"),
        }, { quoted: msg });
        return;
      }

      await sock.sendMessage(chatId, {
        text: `Listo, tu link:\n${data.urlPropia}`,
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(chatId, { text: "Error: " + err.message }, { quoted: msg });
    }
  },
};
