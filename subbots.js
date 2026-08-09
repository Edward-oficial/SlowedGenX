import fs from "fs";
import path from "path";
import chalk from "chalk";

import { config } from "./config.js";
import { crearBot } from "./core.js";

function carpetaSubBot(id) {
  return path.join(config.subBotsFolder, id);
}

export function listarSubBots() {
  if (!fs.existsSync(config.subBotsFolder)) return [];

  return fs
    .readdirSync(config.subBotsFolder, { withFileTypes: true })
    .filter((entrada) => entrada.isDirectory())
    .map((entrada) => entrada.name)
    .filter((id) => fs.existsSync(path.join(carpetaSubBot(id), "creds.json")));
}

export async function reconectarSubBots({ onMessage, onGroupParticipantsUpdate, onGroupsUpdate } = {}) {
  const ids = listarSubBots();

  if (ids.length === 0) {
    console.log(chalk.gray("No hay sub-bots registrados para reconectar."));
    return [];
  }

  console.log(chalk.cyan(`Reconectando ${ids.length} sub-bot(s)...`));

  const sockets = [];
  for (const id of ids) {
    try {
      const sock = await crearBot({
        sessionFolder: carpetaSubBot(id),
        etiqueta: `SUB:${id}`,
        isSubBot: true,
        onMessage,
        onGroupParticipantsUpdate,
        onGroupsUpdate,
        onLoggedOut: () => {
          console.log(chalk.yellow(`[SUB:${id}] Sesión cerrada por el usuario, eliminando sub-bot.`));
          eliminarSubBot(id);
        },
      });
      sockets.push({ id, sock });
    } catch (err) {
      console.log(chalk.red(`Error reconectando sub-bot "${id}":`), err);
    }
  }

  return sockets;
}

export async function registrarSubBot(id, numero, { onPairingCode, onReady, onMessage, onGroupParticipantsUpdate, onGroupsUpdate } = {}) {
  if (listarSubBots().includes(id)) {
    throw new Error(`Ya existe un sub-bot registrado con el id "${id}".`);
  }

  return crearBot({
    sessionFolder: carpetaSubBot(id),
    etiqueta: `SUB:${id}`,
    isSubBot: true,
    numeroParaPairing: numero,
    onPairingCode,
    onReady,
    onMessage,
    onGroupParticipantsUpdate,
    onGroupsUpdate,
    onLoggedOut: () => {
      console.log(chalk.yellow(`[SUB:${id}] Sesión cerrada por el usuario, eliminando sub-bot.`));
      eliminarSubBot(id);
    },
  });
}

export function eliminarSubBot(id) {
  const carpeta = carpetaSubBot(id);
  if (fs.existsSync(carpeta)) {
    fs.rmSync(carpeta, { recursive: true, force: true });
  }
}
