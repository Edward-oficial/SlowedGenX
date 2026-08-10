import { downloadContentFromMessage } from "baileysxz";

export async function downloadMediaMessage(msg, type = "buffer", options = {}) {
  const content = msg.message?.imageMessage || msg.message?.videoMessage || msg.message?.audioMessage || msg.message?.documentMessage || msg.message?.stickerMessage;
  if (!content) throw new Error("No hay media en el mensaje");
  const stream = await downloadContentFromMessage(content, type === "buffer" ? "image" : type);
  let buffer = Buffer.from([]);
  for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
  return buffer;
}
