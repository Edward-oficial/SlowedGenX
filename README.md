# Duan BotgenX

Generador de bots de WhatsApp con IA. Parte de una base real (Baby Ania) y usa Groq para crear los comandos que pida cada persona, de forma conversacional: pedís, revisás el código generado, corregís lo que quieras, y recién al final descargás el zip.

## Cómo funciona

1. La persona escribe qué comandos quiere (texto libre)
2. El servidor le manda ese pedido a Groq, que devuelve los plugins en JSON siguiendo el formato real de la base (mismo estilo que `mentions.js`, `groupHelpers.js`, etc.)
3. Cada plugin generado se valida con `node --check` antes de mostrarlo — si tiene un error de sintaxis, se le pide a Groq que lo corrija (hasta 2 intentos)
4. La persona puede seguir pidiendo cambios sobre lo ya generado, en el mismo hilo
5. Al tocar "Descargar zip", se arma el paquete final: la base completa (`core.js`, `index.js`, `pluginLoader.js`, etc.) + los plugins aprobados, dentro de `plugins/`

## Estructura

```
duan-botgen/
├── index.js              → servidor Express, rutas /chat y /download
├── package.json
├── base/                  → el bot base real, se copia tal cual en cada zip
│   ├── core.js
│   ├── index.js
│   ├── config.js           → tiene placeholders (__BOT_NAME__, __CREATOR__, __OWNER_NUMBER__)
│   ├── package.json         → tiene placeholders (__PKG_NAME__, __CREATOR__)
│   ├── pluginLoader.js
│   ├── mentions.js
│   ├── groupHelpers.js
│   ├── media.js
│   ├── decoracion.js
│   ├── subbots.js
│   └── groupSettings.js
├── utils/
│   ├── groq.js             → prompt del sistema, llamadas a Groq
│   ├── syntaxCheck.js       → valida sintaxis con node --check
│   └── buildZip.js          → arma el zip final reemplazando placeholders
└── public/
    └── index.html           → la interfaz de chat
```

## Rutas

- `POST /chat` → body `{ existingPlugins, instruction }`, devuelve `{ status, plugins }`. No descarga nada, solo genera/corrige.
- `POST /download` → body `{ botName, creator, ownerNumber, plugins }`, devuelve el zip como descarga directa.

## Instalación local

```bash
npm install
npm start
```

Abrí `http://localhost:3000`.

## Desplegar en Render

1. Subí esta carpeta a un repo de GitHub
2. Render → **New +** → **Web Service** → conectá el repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Deploy

## Configuración

- La API key de Groq está hardcodeada en `utils/groq.js` (constante `GROQ_API_KEY`) — si la rotás, actualizala ahí
- El modelo usado es `llama-3.3-70b-versatile`, configurable en la misma constante `MODEL`

## Usarlo desde un bot de WhatsApp

Hay un plugin (`gen.js`) que permite pedir un bot nuevo directo desde WhatsApp, con el formato:

```
gen NombreDelBot | especificaciones del bot
```

El plugin llama a `/chat` y `/download` de este servicio y manda el zip resultante como documento en el chat.

## Limitaciones a tener en cuenta

- El plan free de Render duerme por inactividad — la primera llamada después de un rato puede tardar 20-30 segundos
- La validación solo chequea sintaxis, no que el plugin funcione de verdad contra WhatsApp — pedidos muy específicos pueden generar código válido pero que falle en tiempo de ejecución
- No hay límite de uso por persona — si el servicio queda expuesto públicamente sin restricciones, cualquiera puede consumir la cuota de Groq
