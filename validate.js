// validate.js — valida la sintaxis de TODOS los bloques <script> de GESTOR_DE_RENTAS.html
//
// Uso:  node validate.js GESTOR_DE_RENTAS.html
//
// Un solo error de sintaxis deja la app en blanco para todos los usuarios, y el navegador no
// avisa hasta que alguien la abre. Este script atrapa eso en un segundo, antes de desplegar.
// Correrlo DESPUES DE CADA CAMBIO no es opcional.

var fs = require('fs');

var archivo = process.argv[2] || 'GESTOR_DE_RENTAS.html';

if (!fs.existsSync(archivo)) {
  console.error('No encuentro el archivo: ' + archivo);
  process.exit(1);
}

var contenido = fs.readFileSync(archivo, 'utf8');
var bloques = contenido.match(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g) || [];

var fallas = 0;
var n = 0;

bloques.forEach(function (bloque) {
  var codigo = bloque.replace(/^<script(?:\s[^>]*)?>/, '').replace(/<\/script>$/, '');
  if (!codigo.trim()) return; // <script src="..."> externo, sin codigo propio
  n++;
  try {
    new Function(codigo);
  } catch (e) {
    fallas++;
    console.log('BLOQUE ' + n + ' - ERROR DE SINTAXIS: ' + e.message);
  }
});

// Chequeo extra: reglas de estilo del proyecto (solo avisa, no falla)
var lineas = contenido.split('\n');
var avisos = [];
lineas.forEach(function (linea, i) {
  var limpia = linea.trim();
  if (limpia.indexOf('//') === 0 || limpia.indexOf('*') === 0) return;
  if (/\bconst\s+\w+\s*=/.test(linea) || /\blet\s+\w+\s*=/.test(linea)) {
    avisos.push('  linea ' + (i + 1) + ': usa const/let - el proyecto es solo var');
  }
  if (/\?\.\w/.test(linea)) {
    avisos.push('  linea ' + (i + 1) + ': optional chaining (?.) no permitido');
  }
});

console.log('Bloques revisados: ' + n + ' - ' + (fallas ? fallas + ' CON ERROR' : 'TODOS LOS BLOQUES VALIDOS'));

if (avisos.length) {
  console.log('\nAvisos de estilo (' + avisos.length + '):');
  avisos.slice(0, 15).forEach(function (a) { console.log(a); });
  if (avisos.length > 15) console.log('  ... y ' + (avisos.length - 15) + ' mas');
}

process.exit(fallas ? 1 : 0);
