import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const CARPETA_PLUGINS = "./plugins";

function listarArchivosRecursivo(carpeta) {
  const resultado = [];
  const entradas = fs.readdirSync(carpeta, { withFileTypes: true });

  for (const entrada of entradas) {
    const rutaCompleta = path.join(carpeta, entrada.name);

    if (entrada.isDirectory()) {
      resultado.push(...listarArchivosRecursivo(rutaCompleta));
    } else if (entrada.name.endsWith(".js")) {
      resultado.push(rutaCompleta);
    }
  }

  return resultado;
}

export async function loadPlugins() {
  if (!fs.existsSync(CARPETA_PLUGINS)) {
    fs.mkdirSync(CARPETA_PLUGINS, { recursive: true });
    return [];
  }

  const archivos = listarArchivosRecursivo(CARPETA_PLUGINS);
  const plugins = [];

  for (const archivo of archivos) {
    try {
      const ruta = pathToFileURL(path.resolve(archivo)).href;
      const mod = await import(ruta);
      const plugin = mod.default;

      if (!plugin?.command || !plugin?.run) {
        console.log(`Plugin inválido, se ignora: ${archivo}`);
        continue;
      }

      const carpetaPadre = path.basename(path.dirname(archivo));
      const esRaiz = path.resolve(path.dirname(archivo)) === path.resolve(CARPETA_PLUGINS);

      plugin.command = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      plugin.category = plugin.category || (esRaiz ? "General" : carpetaPadre);
      plugin.fileName = path.basename(archivo);
      plugins.push(plugin);
    } catch (err) {
      console.log(`Error cargando el plugin ${archivo}:`, err);
    }
  }

  return plugins;
}

export function agruparPorCategoria(plugins) {
  const grupos = new Map();

  for (const plugin of plugins) {
    const categoria = plugin.category || "General";
    if (!grupos.has(categoria)) grupos.set(categoria, []);
    grupos.get(categoria).push(plugin);
  }

  return grupos;
}
