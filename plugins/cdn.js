import sharp from "sharp";
import { tmpdir } from "os";
import { join } from "path";

export default {
  command: ["subir", "cdn", "host"],
  category: "tools",
  description: "Sube una imagen al CDN",
  run: async (sock, msg, args, context) => {
    const { chatId } = context;

    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMsg = msg.message?.imageMessage || quoted?.imageMessage;

    if (!imageMsg) {
      await sock.sendMessage(chatId, {
        text: "Respondé a una imagen o enviá una con el comando *subir*",
      }, { quoted: msg });
      return;
    }

    try {
      await sock.sendMessage(chatId, { text: "Subiendo..." }, { quoted: msg });

      const mediaUrl = imageMsg.url;
      
      const response = await fetch(mediaUrl, {
        headers: { "User-Agent": "WhatsApp/2.0" },
      });

      if (!response.ok) throw new Error("No se pudo descargar la imagen");

      const buffer = Buffer.from(await response.arrayBuffer());

      const procesado = await sharp(buffer)
        .resize(1280, null, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      const form = new FormData();
      const blob = new Blob([procesado], { type: "image/jpeg" });
      form.append("file", blob, "foto.jpg");

      const res = await fetch("https://duancdn.onrender.com/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!data.status) {
        await sock.sendMessage(chatId, {
          text: "Error al subir: " + (data.error || "desconocido"),
        }, { quoted: msg });
        return;
      }

      await sock.sendMessage(chatId, {
        text: `Listo\n\n*Link:*\n${data.urlPropia}`,
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(chatId, {
        text: "Error: " + err.message,
      }, { quoted: msg });
    }
  },
};