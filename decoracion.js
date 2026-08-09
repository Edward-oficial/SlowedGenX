const ESTILOS = {
  mono: { upper: 0x1d670, lower: 0x1d68a, digit: 0x1d7f6 },
  sansBold: { upper: 0x1d5d4, lower: 0x1d5ee, digit: 0x1d7ec },
  sansBoldItalic: { upper: 0x1d63c, lower: 0x1d656, digit: null },
  sansItalic: { upper: 0x1d608, lower: 0x1d622, digit: null },
};

function estilizar(texto, estilo) {
  const { upper, lower, digit } = ESTILOS[estilo];
  let resultado = "";

  for (const char of texto) {
    const code = char.codePointAt(0);

    if (code >= 65 && code <= 90) {
      resultado += String.fromCodePoint(upper + (code - 65));
    } else if (code >= 97 && code <= 122) {
      resultado += String.fromCodePoint(lower + (code - 97));
    } else if (digit !== null && code >= 48 && code <= 57) {
      resultado += String.fromCodePoint(digit + (code - 48));
    } else {
      resultado += char;
    }
  }

  return resultado;
}

export const mono = (texto) => estilizar(texto, "mono");
export const sansBold = (texto) => estilizar(texto, "sansBold");
export const sansBoldItalic = (texto) => estilizar(texto, "sansBoldItalic");
export const sansItalic = (texto) => estilizar(texto, "sansItalic");

const ESTILOS_SCRIPT = { upper: 0x1d4d0, lower: 0x1d4ea, digit: null };
function estilizarScript(texto) {
  const { upper, lower } = ESTILOS_SCRIPT;
  let resultado = "";
  for (const char of texto) {
    const code = char.codePointAt(0);
    if (code >= 65 && code <= 90) resultado += String.fromCodePoint(upper + (code - 65));
    else if (code >= 97 && code <= 122) resultado += String.fromCodePoint(lower + (code - 97));
    else resultado += char;
  }
  return resultado;
}
export const script = (texto) => estilizarScript(texto);

export const FLOR = "✿⃝░";

export const bullet = (emoji) => `°ʚ${emoji}ɞ°`;

export const SEPARADOR_TITULO = "˖ ݁𖥔 ݁˖";
export const DIVISOR_FINO = "﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏";
export const DIVISOR_ESTRELLAS = "＊┈┈┈┈＊┈┈┈┈＊┈┈";
export const DIVISOR_SUAVE = "·˚ ༘₊· ͟͟͞͞";
export const CIERRE = "♡⑅*˖•. ·͙*̩̩͙˚̩̥̩̥*̩̩̥͙·̩̩̥͙*̩̩̥͙˚̩̥̩̥*̩̩͙‧͙ .•˖*⑅♡";
