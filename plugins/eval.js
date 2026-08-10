import syntaxerror from "syntax-error";
import { format } from "util";
import { createRequire } from "module";

import { config } from "../config.js";

const require = createRequire(import.meta.url);

class CustomArray extends Array {
  constructor(...args) {
    if (typeof args[0] === "number") return super(Math.min(args[0], 10000));
    else return super(...args);
  }
}

function esOwner(sender) {
  const numero = sender.split("@")[0];
  return numero === config.ownerNumber || config.owners.includes(numero);
}

export default {
  command: [">", "=>"],
  category: "owner",
  description: "Ejecuta código JS crudo (solo owner)",
  run: async (sock, msg, args, context) => {
    const { chatId, sender, body } = context;

    if (!esOwner(sender)) {
      await sock.sendMessage(chatId, { text: "Este comando es solo para el owner." }, { quoted: msg });
      return;
    }

    const texto = body.trim();
    const usedPrefix = texto.startsWith("=>") ? "=>" : ">";
    const noPrefix = texto.slice(usedPrefix.length).trim();
    const _text = (/^=/.test(usedPrefix) ? "return " : "") + noPrefix;

    let _return;
    let _syntax = "";

    try {
      let i = 15;
      const f = { exports: {} };

      const exec = new (async () => {}).constructor(
        "print", "m", "sock", "conn", "jid", "user",
        "require", "Array", "process", "args", "module", "exports",
        _text
      );

      _return = await exec.call(sock, (...a) => {
        if (--i < 1) return;
        console.log(...a);
        return sock.sendMessage(chatId, { text: format(...a) }, { quoted: msg });
      }, msg, sock, sock, chatId, sender, require, CustomArray, process, args, f, f.exports);

    } catch (e) {
      const err = syntaxerror(_text, "Execution Function", {
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true,
        sourceType: "module",
      });
      if (err) _syntax = "```" + err + "```\n\n";
      _return = e;
    } finally {
      await sock.sendMessage(chatId, { text: _syntax + format(_return) }, { quoted: msg });
    }
  },
};
