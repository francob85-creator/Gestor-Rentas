# GestorRenta

SaaS de administración de rentas para arrendadores en México. Está **en producción** con
clientes de pago: cada cambio toca dinero real de gente real.

- Producción: gestorrenta.com / gestorrentas.com (GitHub Pages)
- Repo: `francob85-creator/Gestor-Rentas`
- Archivo principal: `GESTOR_DE_RENTAS.html` — **un solo archivo** de ~31,500 líneas
- Landing: `index.html`

**Comunícate siempre en español.** Franco no es programador de oficio: explica el *porqué* en
lenguaje llano antes del *cómo*. Nada de jerga sin traducir.

---

## Reglas no negociables

1. **Solo `var`.** Prohibido `const`, `let`, funciones flecha, optional chaining (`?.`),
   `async/await` nuevo donde no lo haya ya. El archivo es ES5 por decisión deliberada.
2. **Ediciones quirúrgicas.** Siempre `str_replace` con texto verbatim. **Jamás** reescribir el
   archivo completo ni regenerar bloques grandes. Si un reemplazo no calza exacto, LEE otra vez;
   no adivines.
3. **Validar sintaxis después de CADA cambio** con `node validate.js GESTOR_DE_RENTAS.html`.
   Si no dice "TODOS LOS BLOQUES VALIDOS", no sigas: arregla antes de continuar.
4. **Análisis de causa raíz antes de tocar.** Lee el código, rastrea el flujo, confirma el
   mecanismo con evidencia (datos, consola, respaldo). Prohibido parchar por corazonada.
5. **"El pasado no se toca."** Datos históricos y registros pasados no se modifican.
6. **Mockup antes de cambios visuales significativos.** Un HTML aparte que Franco pueda abrir y
   probar, con las variantes lado a lado. Él elige; después se implementa.
7. **Franco marca el ritmo.** Él aprueba cada cambio antes de que salga a producción y decide
   cuándo parar. No sugieras parar ni des el trabajo por terminado por tu cuenta.
8. **Subir `APP_VERSION`** en cada entrega (`var APP_VERSION = 'vNN · DD-mmm-AAAA';`).

### Zona prohibida

Las funciones de **PDF, facturación, CFDI, FiscalAPI y SAT** no se tocan sin autorización
explícita de Franco, función por función, en esa misma sesión. Timbrar mal una factura tiene
consecuencias fiscales reales.

---

## Arquitectura

- **Frontend:** JavaScript vanilla, un archivo HTML monolítico. Sin build, sin bundler.
- **Backend:** Firebase / Firestore. Doc principal en `tenants/{uid}` + subcolecciones
  `rentas`, `clientes`, `abonos`. Usuarios en `tenants/{uid}/meta/users` (campo **`list`**).
- **Pagos:** Stripe (planes Básico, Pro, Enterprise, Admin; prueba de 15 días).
- **Facturación:** FiscalAPI (CFDI 4.0).
- **Mensajería:** WhatsApp vía `wa.me`.
- **Comprobantes:** imagen comprimida (JPEG 800px, 50%) en base64 dentro del abono.

### Conceptos del dominio

- **renta** = propiedad. **cliente** = inquilino. **abono** = pago. **cobranza** = cobros.
- `getStatusRenta` es la **única fuente de verdad** para AL DÍA / ATRASADO. Ningún otro camino
  puede sobreescribir ese estado.
- **Cobranza usa montos NETOS; Mi Portafolio usa SUBTOTALES.** Mezclar unidades produce deuda o
  saldo a favor fantasma. `_detectarMontoPagadoConsistente()` infiere la renta real de los abonos
  recientes y normaliza a subtotal con `_calcFactorNetoRenta()`.
- Montos **menores a $1 peso** (residuos de redondeo de IVA/retenciones) se tratan como cero,
  tanto en morosidad como en saldo a favor.
- El campo `tipo` de una propiedad se usa como **agrupador de edificio** ("Franco Propiedades",
  "Plaza Quebec"), no solo como categoría de inmueble. Es intencional.

---

## La lección más cara: sincronización multi-dispositivo

Franco, su familiar y un asociado usan la app en dispositivos distintos. **Casi todos los bugs
graves de este proyecto nacieron ahí**, y siempre con el mismo patrón:

> Un dispositivo con memoria vieja escribe una lista incompleta al servidor, con timestamp
> perfectamente válido, y destruye datos buenos en TODOS los demás dispositivos.

Así se perdieron formas de pago y tipos de propiedad. **La cura correcta es siempre la misma:
fusión-unión con lápidas** — al recibir, lo local que el entrante no traiga se PRESERVA; solo un
borrado explícito del usuario, que deja lápida, puede quitar algo. Ver `_mergeFormasPagoUnion` y
`_mergeListaCfgUnion` como referencia. **Si vas a escribir cualquier lista completa al doc
principal, pregúntate primero si una memoria vieja podría encogerla.**

Corolarios ya aprendidos:

- Las funciones que aplican snapshots (`_applyRentasSnapshot`, `_applyClientesSnapshot`,
  `_applyAbonosSnapshot`) **eliminan de memoria lo que no venga en el snapshot**. Toda ventana
  vulnerable (p. ej. post-importación) necesita guardia.
- Nunca escribir una lista completa a partir de una lectura que pudo fallar. Si `get()` falla y
  devuelve null, NO escribas defaults encima.
- `updatedAt` se guardó alguna vez con tipo malformado (se leía como 1970). El lector universal
  `_leerTs` es la cura canónica; úsalo en todo sitio de lectura.
- iOS mata la PWA durante operaciones largas (ráfagas de timbrado). Toda operación con API
  externa necesita mecanismo de durabilidad/recuperación.
- En iOS PWA standalone el transporte WebChannel se queda "zombi": por eso
  `experimentalForceLongPolling` se aplica solo cuando `navigator.standalone === true`, una vez
  al inicializar. **Nunca** enganchar `disableNetwork()`/`enableNetwork()` a eventos de carga:
  ya se intentó y tumbó la app en producción.
- Importaciones: batches atómicos de 450 + guardia post-importación de 90s
  (`_postImportGuardUntil`).
- `_visiblesCache` debe invalidarse por cambio de referencia, no por llamadas manuales.

---

## Flujo de trabajo

### Antes de editar

```bash
node validate.js GESTOR_DE_RENTAS.html   # línea base limpia
git status                                # árbol limpio
```

### Al terminar un cambio

```bash
node validate.js GESTOR_DE_RENTAS.html   # obligatorio
git add -A && git commit -m "FIX XXX: descripción corta"
```

**No hagas `git push` sin que Franco lo pida.** `push` a `main` = despliegue inmediato a
producción, y ahí están sus clientes.

### Despliegue (lo hace Franco)

`git push` → esperar 1-2 min a GitHub Pages → abrir Safari con `?v=NN` (el número nuevo de
`APP_VERSION`) → confirmar que carga → borrar el ícono viejo de la pantalla de inicio →
volver a agregar la PWA.

### Convención de comentarios

Todo arreglo se marca en el código con una etiqueta y su explicación, para que dentro de seis
meses se entienda el porqué:

```javascript
// FIX NOMBRE-DEL-CASO (2026-08): qué pasaba, por qué pasaba y por qué esta es la cura.
```

Etiquetas ya en uso: `FIX FP-UNION`, `FIX TP-UNION`, `BORRADO-DURABLE`, `FIX FOSIL-MAINDOC`,
`FIX TRANSPORTE-IOS`, `FIX META-ONLY`, `MULTI-FACTURA`, `FIX TIPOS-SELECTOR`.

---

## Pendientes conocidos

- **`subEmailVal is not defined`** en `guardarUsuario` (validación de correo duplicado): usa una
  variable inexistente; la buena es `subEmail`. Hoy no truena por casualidad, pero en cuanto un
  segundo usuario tenga correo, guardar usuarios se rompe entero.
- **`_afterFirebaseLogin`** puede ejecutar `saveUsers([user])` y borrar la lista completa de
  usuarios del servidor si `fbLoadUsers()` falla transitoriamente. Necesita guardia.
- **19 facturas huérfanas** (sin abono asociado): Bodega Tajito, La Rivereña, EL RANCHITO,
  Predio Magdalenas, Bodega Sarabia, Centenario. Sin diagnosticar.
- Arreglo de documento-fósil para **clientes** completo solo a medias.
