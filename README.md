# Baby Ania

Base de bot de WhatsApp con eventos, sub-bots y menú con carga automática de plugins por categorías.

## Características

- Conexión con Baileys (pairing code o QR)
- Sistema de plugins automático por carpetas/categorías
- Soporte para sub-bots
- Menú de comandos dinámico
- Cache de metadatos de grupos
- Manejo de reconexión automática

## Requisitos

- Node.js >= 20.0.0

## Instalación

```bash
npm install
npm start
```

Al iniciar por primera vez podrás elegir entre código de emparejamiento o QR.

## Estructura

```
.
├── config.js
├── core.js
├── index.js
├── mentions.js
├── pluginLoader.js
├── subbots.js
├── package.json
├── plugins/
│   └── general/
│       └── menu.js
└── sessions/
    ├── main/
    └── subbots/
```

## Autores

Yulieth & Duan Ed

Jhon 
