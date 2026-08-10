import ffmpeg from "fluent-ffmpeg";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

export default {
  command: ["subir", "cdn", "host"],
  category: "Multimedia",
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

      // Descargar directo con fetch de la URL de WhatsApp
      const mediaUrl = imageMsg.url;
      
      const response = await fetch(mediaUrl, {
        headers: { "User-Agent": "WhatsApp/2.0" },
      });

      if (!response.ok) throw new Error("No se pudo descargar la imagen");

      const buffer = Buffer.from(await response.arrayBuffer());

      const inputPath = join(tmpdir(), `input_${Date.now()}.jpg`);
      const outputPath = join(tmpdir(), `output_${Date.now()}.jpg`);

      writeFileSync(inputPath, buffer);

      await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .outputOptions([
            "-vf", "scale=1280:-1",
            "-q:v", "5",
            "-preset", "fast",
          ])
          .output(outputPath)
          .on("end", resolve)
          .on("error", reject)
          .run();
      });

      const procesado = readFileSync(outputPath);

      const form = new FormData();
      const blob = new Blob([procesado], { type: "image/jpeg" });
      form.append("file", blob, "foto.jpg");

      const res = await fetch("https://duancdn.onrender.com/upload", {
        method: "POST",
        body: form,
      });

      unlinkSync(inputPath);
      unlinkSync(outputPath);

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