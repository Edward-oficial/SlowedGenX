import { downloadMediaMessage } from "../media.js";

const CDN_URL = "https://duancdn.hidenfree.com/upload";

export default {
  command: ["subir", "cdn"],
  category: "tools",
  description: "Sube una foto, video o audio a Duan CDN y devuelve el link",
  run: async (sock, msg, args, context) => {
    const { chatId, sender } = context;

    const directa = msg.message?.imageMessage || msg.message?.videoMessage || msg.message?.audioMessage;
    const info = msg.message?.extendedTextMessage?.contextInfo;
    const citada = info?.quotedMessage?.imageMessage || info?.quotedMessage?.videoMessage || info?.quotedMessage?.audioMessage;

    let mensajeParaDescargar = null;
    let mimetype = "image/jpeg";

    if (directa) {
      mensajeParaDescargar = msg;
      mimetype = directa.mimetype || mimetype;
    } else if (citada) {
      mensajeParaDescargar = {
        message: info.quotedMessage,
        key: { remoteJid: chatId, id: info.stanzaId, participant: info.participant },
      };
      mimetype = citada.mimetype || mimetype;
    }

    if (!mensajeParaDescargar) {
      await sock.sendMessage(chatId, {
        text: "Mandá una foto, video o audio con el texto *subir* como descripción, o citá un archivo ya enviado y escribí *subir*.",
      }, { quoted: msg });
      return;
    }

    try {
      let tipoMedia = "archivo";
      if (mimetype.startsWith("video")) tipoMedia = "video";
      else if (mimetype.startsWith("audio")) tipoMedia = "audio";
      else if (mimetype.startsWith("image")) tipoMedia = "foto";
      
      await sock.sendMessage(chatId, { text: `Subiendo ${tipoMedia}...` }, { quoted: msg });

      const buffer = await downloadMediaMessage(mensajeParaDescargar, "buffer", {});

      let ext = mimetype.split("/")[1];
      if (!ext) {
        if (mimetype.startsWith("video")) ext = "mp4";
        else if (mimetype.startsWith("audio")) ext = "ogg";
        else ext = "jpg";
      }
      
      const blob = new Blob([buffer], { type: mimetype });

      const formData = new FormData();
      formData.append("file", blob, `media.${ext}`);
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