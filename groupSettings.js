import fs from "fs";
import path from "path";

const ARCHIVO = "./data/groupSettings.json";

function cargar() {
  if (!fs.existsSync(ARCHIVO)) return {};
  try {
    return JSON.parse(fs.readFileSync(ARCHIVO, "utf-8"));
  } catch (_) {
    return {};
  }
}

function guardar(data) {
  fs.mkdirSync(path.dirname(ARCHIVO), { recursive: true });
  fs.writeFileSync(ARCHIVO, JSON.stringify(data, null, 2));
}

let cache = cargar();

export function obtenerConfigGrupo(chatId) {
  return cache[chatId] || { welcome: false, bye: false };
}

export function actualizarConfigGrupo(chatId, cambios) {
  cache[chatId] = { ...obtenerConfigGrupo(chatId), ...cambios };
  guardar(cache);
  return cache[chatId];
}
