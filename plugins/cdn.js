import { downloadMediaMessage } from "../media.js";

const CDN_URL = "https://duancdn.onrender.com/upload";

export default {
  command: ["subir", "cdn"],
  category: "tools",
  description: "Sube una foto a Duan CDN y devuelve el link",
  run: async (sock, msg, args, context) => {
    const { chatId, sender } = context;

    const directa = msg.message?.imageMessage;
    const info = msg.message?.extendedTextMessage?.contextInfo;
    const citada = info?.quotedMessage?.imageMessage;

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
        text: "Mandá una foto con el texto *subir* como descripción, o citá una foto ya enviada y escribí *subir*.",
      }, { quoted: msg });
      return;
    }

    try {
      await sock.sendMessage(chatId, { text: "Subiendo..." }, { quoted: msg });

      const buffer = await downloadMediaMessage(mensajeParaDescargar, "buffer", {});

      const ext = mimetype.split("/")[1] || "jpg";
      const blob = new Blob([buffer], { type: mimetype });

      const formData = new FormData();
      formData.append("file", blob, `foto.${ext}`);
      formData.append("uid", sender.split("@")[0]);

      const res = await fetch(CDN_URL, { method: "POST", body: formData });
      const data = await res.json();

      if (!data.status) {
        await sock.sendMessage(chatId, {
          text: "Error subiendo la foto: " + (data.error || "fallo desconocido"),
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
