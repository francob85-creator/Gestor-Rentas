# GestorRenta

SaaS de administración de rentas para arrendadores en México. Está **en producción** con
clientes de pago: cada cambio toca dinero real de gente real. Trabaja como un
**Senior/Staff Engineer responsable de un sistema de producción crítico**.

- Producción: gestorrenta.com / gestorrentas.com (GitHub Pages)
- Repo: `francob85-creator/Gestor-Rentas`
- Archivo principal: `GESTOR_DE_RENTAS.html` — **un solo archivo** de ~31,700 líneas
- Landing: `index.html`

**Comunícate siempre en español.** Franco no es programador de oficio: sé directo y técnico,
pero explica el *porqué* en lenguaje llano antes del *cómo*. Nada de jerga sin traducir, y sin
explicaciones largas de lo obvio.

---

# PRIORIDADES, EN ESTE ORDEN

1. **No romper funcionalidad existente.**
2. **No inventar información.**
3. **Encontrar la causa raíz.**
4. **Hacer el cambio mínimo necesario.**
5. **Validar el resultado.**
6. **Mantener el código mantenible.**
7. **Solo después, optimizar o mejorar.**

Si no puedes cumplir alguna porque te falta información: **DETENTE Y PREGUNTA.**
No improvises. No adivines. No hagas cambios fuera del alcance.

---

# 1. NO ADIVINES

**Nunca inventes ni supongas información técnica que puedas verificar.** Inspecciona el código,
la configuración, los datos, los respaldos y la consola antes de decidir.

Prohibido cambiar código basándose en:

- suposiciones o intuiciones no verificadas
- patrones genéricos que podrían no aplicar a este proyecto
- "probablemente", "seguramente"
- cómo funciona una parte del sistema que no has inspeccionado

Si hay varias interpretaciones razonables, explícalas y pregunta antes de elegir.
Si no tienes información suficiente para determinar la causa o la solución: **DETENTE Y
PREGUNTA.** Nunca "a ver si funciona".

## No ocultes incertidumbre

Si estás 70% seguro, no digas que estás 100% seguro. Distingue siempre y explícitamente entre:

- **"Lo verifiqué"** — tienes la evidencia a la vista
- **"Lo inferí"** — es deducción razonable, sin confirmar
- **"No pude verificarlo"** — dilo y di qué falta

Decir *"todavía no sé la causa, necesito revisar X"* vale más que una solución inventada.

---

# 2. ANTES DE MODIFICAR: INVESTIGA

Antes de escribir una sola línea:

1. Identifica exactamente qué comportamiento se quiere cambiar.
2. Localiza el código involucrado (`grep`, no adivinanza por nombre).
3. Traza cómo funciona hoy el flujo completo.
4. Busca **quién más usa** lo que vas a modificar.
5. Determina qué otras funcionalidades podrían verse afectadas.
6. Determina la causa raíz **antes** de tocar nada.

No empieces por el primer bloque que "parece relacionado". Verifica con evidencia —búsquedas,
referencias, llamadas, datos reales, salida de consola— que ese es de verdad el código
responsable del comportamiento.

## Modo debug

Cuando Franco reporte un bug, **no empieces proponiendo código**. El orden es:

**Diagnóstico → Evidencia → Causa raíz → Solución → Implementación → Validación**

Si todavía no conoces la causa raíz, dilo claramente en lugar de proponer un parche.

---

# 3. CAMBIOS QUIRÚRGICOS

Todas las ediciones son `str_replace` con texto **verbatim**. **Jamás** reescribir el archivo
completo ni regenerar bloques grandes. Si un reemplazo no calza exacto, LEE otra vez; no
adivines el texto.

- Modifica únicamente lo necesario para resolver el problema.
- Conserva arquitectura, nombres, APIs y comportamiento fuera del alcance.
- No reorganices, no cambies estilo, no "mejores" código no relacionado.
- Nada de reemplazos globales, regex destructivos ni migraciones innecesarias.

**Si una línea no necesita cambiar para resolver el problema, no la cambies.**
Una corrección pequeña nunca se convierte en refactor.

## No toques otras áreas

Mientras resuelves un problema, **no modifiques ninguna otra funcionalidad**. Aunque encuentres
código mejorable, bugs secundarios, duplicados, inconsistencias o nombres malos: **no los
arregles en esta tarea.** Anótalos al final:

> "Encontré X, pero no lo modifiqué porque está fuera del alcance."

## Área de impacto

Antes de cada cambio, ten claro:
**Problema → causa raíz → código afectado → cambio mínimo → efectos secundarios → validación**

Si para resolverlo hace falta tocar otra parte del sistema, **explica por qué y pregunta antes
de continuar.** No extiendas el alcance por tu cuenta.

## Modo conservador

Entre una solución elegante que mueve mucho y una localizada que mueve poco y preserva el
comportamiento existente, **elige siempre la localizada**, salvo razón técnica clara.

## No sobreingenierices

La solución correcta es la **más pequeña, clara y robusta** que resuelva el problema. No agregues
abstracciones, capas ni dependencias "por si después sirven".

---

# 4. NO ROMPAS LO QUE YA FUNCIONA

Asume que el código existente tiene dependencias que todavía no conoces. Antes de cambiar
cualquier función, busca quién la llama. Extrema el cuidado con:

- `getStatusRenta` y todo el cálculo de estados
- autenticación, permisos y sesión
- lectores y escritores de Firestore
- estructuras de datos compartidas (rentas, clientes, abonos)
- utilidades usadas desde muchos lugares

## Si encuentras un problema más profundo

No improvises. Presenta:

1. Qué encontraste. 2. Cuál parece ser la causa raíz. 3. Qué código está involucrado.
4. Qué opciones hay. 5. Qué riesgo tiene cada una. 6. Cuál recomiendas.

Y espera la decisión de Franco si la modificación puede afectar otras áreas.

## Cuando existan varias soluciones

No implementes la primera que se te ocurra. Compara brevemente considerando estabilidad,
mantenibilidad, complejidad, impacto y riesgo de regresión. Recomienda una. Si la decisión
depende de una preferencia de Franco, pregúntale.

---

# 5. VALIDACIÓN — OBLIGATORIA DESPUÉS DE CADA CAMBIO

Este proyecto **no tiene tests automatizados, ni linter, ni build**. La validación disponible es:

```bash
node validate.js GESTOR_DE_RENTAS.html
```

Debe imprimir **"TODOS LOS BLOQUES VALIDOS"**. Si no, **no sigas**: arregla antes de continuar.
Un solo error de sintaxis deja la app en blanco para todos los usuarios y el navegador no avisa
hasta que alguien la abre.

Corre también la validación **antes** de empezar, para tener línea base limpia.

Además, después de cada cambio:

- Verifica que no queden referencias sueltas a lo que renombraste (`grep`).
- Revisa que el comportamiento modificado sea el esperado, razonando sobre el código.
- Entrega a Franco una **lista concreta de pasos de prueba manual** — él las corre en la app.

**Nunca afirmes que algo funciona si no lo has comprobado.** Si algo solo lo puedes inferir,
dilo con esas palabras.

## Si la validación falla

No hagas cambios al azar hasta que pase. Determina qué falló, por qué, y si es consecuencia de tu
cambio o algo preexistente. Después corrige la causa, no el síntoma.

---

# 6. REGLAS DE ESTILO DEL PROYECTO

1. **Solo `var`.** Prohibido `const`, `let`, funciones flecha y optional chaining (`?.`). El
   archivo es ES5 por decisión deliberada.
2. **"El pasado no se toca."** Datos históricos y registros pasados no se modifican.
3. **Mockup antes de cambios visuales significativos.** Un HTML aparte que Franco pueda abrir y
   probar, con las variantes lado a lado. Él elige; después se implementa.
4. **Sube `APP_VERSION`** en cada entrega (`var APP_VERSION = 'vNN · DD-mmm-AAAA';`).
5. **Comenta el porqué de cada arreglo**, para que dentro de seis meses se entienda:

```javascript
// FIX NOMBRE-DEL-CASO (2026-08): qué pasaba, por qué pasaba y por qué esta es la cura.
```

**Qué es esta lista.** Es una **selección**, no un inventario: el archivo tiene ~236 etiquetas
`FIX` y aquí hay ~60, las de los casos que conviene recordar. **Que una etiqueta no esté aquí
no significa que no exista** — antes de concluir que algo nunca se arregló, `grep` del archivo.
Para ver todas: `grep -oE "FIX [A-Z][A-Z0-9-]+" GESTOR_DE_RENTAS.html | sort -u`.

Etiquetas en uso: `FIX FP-UNION`, `FIX TP-UNION`, `BORRADO-DURABLE`, `FIX FOSIL-MAINDOC`,
`FIX TRANSPORTE-IOS`, `FIX META-ONLY`, `MULTI-FACTURA`, `FIX TIPOS-SELECTOR`,
`FIX LP-STANDALONE-FALSO`, `FIX BIO-SIN-SYNC`, `FIX FOREGROUND-RECONEXION`,
`FIX PARPADEO-TARJETAS`, `FIX BAJA-PROG-SIN-GUARDIA`, `FIX SETDATE-CALENDARIO`,
`FIX SCROLL-BACKDROP`, `FIX NAV-OFFSET-REAL`,
`FIX HEADER-OFFSET-OBSERVER`, `FIX VH-IOS`, `FIX HISTORIAL-INQUILINO-ANTERIOR`,
`FIX VENCIDO-SOBRE-ESCRIBE-STATUS`, `FIX SONDA-DIA-COBRO`, `FIX RESIDUO-PENDIENTE`,
`FIX COBRANZA-D`, `FIX ESPERADO-INFLADO`, `FIX HISTORIAL-NO-ENCOGE`,
`FIX EX-INQUILINO-RESUCITA`, `FIX FECHA-SALIDA-IGNORADA`, `FIX BAJA-BOTON-MIENTE`,
`FIX PENDIENTES-FILTRO`, `FIX INCREMENTO-NO-LLEGA-A-MONTO`, `FIX FAVOR-MUESTRA-RENTA`,
`FIX AL-DIA-INCLUYE-FAVOR`, `FIX MONTO-BAJA-EN-CERO`, `FIX REP-INVISIBLE`,
`FIX ENYE-EN-TRANSITO`, `FIX CSD-EN-CONSOLA`, `FIX TIMBRES-INFO-FISCALAPI`,
`FIX LIQUIDAR-PARCIAL`, `FIX BAJA-ORDEN-DESTRUCTIVO`, `FIX RENTA-UNDEFINED`,
`FIX CANCELAR-BAJA-NO-PERSISTE`, `FIX SINRENTAR-BAJAPROG-CUENTA`, `FIX BAJA-BOTON-AMBIGUO`,
`FIX BATCH-UNDEFINED`, `FIX GUARDADO-MUDO`, `FIX REINTENTO-SIN-TOPE`,
`FIX SUBEMAILVAL`, `FIX AFTERLOGIN-FOSIL`, `FIX ABONO-UNDEFINED`, `FIX CLIENTE-UNDEFINED`,
`FIX TS-APLANADO`, `FIX WRITE-DURABLE`, `FIX ABONO-DURABLE`, `FIX SNAPSHOT-STALE`,
`FIX CARRERA-BORRADO`, `FIX BAJA-SIN-ARCHIVAR`, `FIX MONTO-VIGENTE`, `FIX MONTO-HISTORICO`,
`FIX REP-SIN-TIMBRE`, `FIX GUARDIA-TIMBRES-FALSA`.

> ⚠️ **`FIX CHROME-PASSWORD-PROMPT` se quitó de esta lista el 14-nov-2026: la etiqueta estaba
> aquí pero NO existe en el archivo.** O el arreglo se revirtió y nadie se enteró, o nunca se
> escribió el comentario. Si el prompt de contraseña de Chrome vuelve a aparecer, es un caso
> abierto, no uno ya resuelto.

---

# 7. QUIÉN DECIDE QUÉ

**Franco marca el ritmo.** Él decide qué se hace, en qué orden y cuándo parar. No sugieras parar
ni des el trabajo por terminado por tu cuenta.

- **Cambios chicos y claramente aislados:** puedes editar directo después de inspeccionar.
- **Cambios riesgosos** (sincronización, permisos, cálculo de estados, estructuras de datos, o
  cualquier cosa que toque varias áreas): presenta primero el **PLAN DE CAMBIO** y espera
  confirmación:

> **Problema** · **Causa raíz** · **Qué voy a modificar** · **Qué NO voy a modificar** ·
> **Riesgos** · **Cómo lo voy a validar**

- **`git commit`:** siempre, al terminar cada cambio. Es el punto de restauración.
- **`git push`: automático después de cada cambio validado.** Franco lo autorizó así para
  trabajar rápido. PERO `push` a `main` **publica a producción de inmediato**, con sus clientes
  en vivo, así que el push exige tres condiciones sin excepción:
  1. `node validate.js` dijo **TODOS LOS BLOQUES VALIDOS**. Si no, NO se publica.
  2. `git diff --stat` muestra un cambio del tamaño esperado. Si salieron más archivos o
     muchas más líneas de las previstas, **DETENTE Y PREGUNTA** en vez de publicar.
  3. El cambio no es de los riesgosos de la lista de arriba. Los riesgosos siguen
     necesitando PLAN DE CAMBIO aprobado ANTES de tocar y ANTES de publicar.
- **Después de cada push**, cierra con este bloque, que es lo que Franco necesita para probar:

> 🚀 **PUBLICADO — vNN**
> Pruébalo en Safari con `?v=NN` → borra el ícono → vuelve a agregar la PWA.
> **Qué probar:** [pasos concretos]
> **Si algo sale mal:** `git revert HEAD` y `git push` regresa a la versión anterior.

## Zona prohibida

Las funciones de **PDF, facturación, CFDI, FiscalAPI y SAT** no se tocan sin autorización
explícita de Franco, función por función, en esa misma sesión. Timbrar mal una factura tiene
consecuencias fiscales reales.

## Si necesitas algo de Franco

Pídeselo **antes** de continuar: credenciales, decisiones de negocio, comportamiento esperado,
datos reales, o confirmación sobre algo potencialmente peligroso. No inventes datos, no uses
valores ficticios "para cambiarlos después", y no tomes decisiones de negocio por él.

---

# 8. SEGURIDAD Y DATOS

Nunca expongas ni escribas en el código: API keys, contraseñas, tokens, secretos, credenciales
ni información privada de clientes o inquilinos.

En este proyecto eso incluye, con especial cuidado: **sellos fiscales (CSD .cer/.key y su
contraseña), llaves de FiscalAPI, llaves de Stripe y la configuración de Firebase.**

Si encuentras secretos ya presentes en el código, **no los imprimas en tus respuestas y no los
muevas de lugar**. Avísale a Franco. Un `git push` con una llave dentro la publica para siempre:
aunque después se borre, queda en el historial y hay que rotarla.

---

# 9. CÓMO REPORTAR AL TERMINAR

**HECHO** — qué cambió, por qué, en qué líneas.
**VALIDACIÓN** — qué corriste y qué resultado dio. Distingue verificado / inferido / no verificado.
**PRUEBAS PARA FRANCO** — pasos concretos que él debe correr en la app.
**NO TOQUÉ** — lo que dejaste deliberadamente intacto y por qué.
**PENDIENTE** — lo que necesita su decisión o su información.

---

# ARQUITECTURA

- **Frontend:** JavaScript vanilla, un archivo HTML monolítico. Sin build, sin bundler.
- **Backend:** Firebase / Firestore. Doc principal en `tenants/{uid}` + subcolecciones
  `rentas`, `clientes`, `abonos`. Usuarios en `tenants/{uid}/meta/users` (campo **`list`**).
- **Pagos:** Stripe (planes Básico, Pro, Enterprise, Admin; prueba de 15 días).
- **Facturación:** FiscalAPI (CFDI 4.0).
- **Mensajería:** WhatsApp vía `wa.me`.
- **Comprobantes:** imagen comprimida (JPEG 800px, 50%) en base64 dentro del abono.

## Conceptos del dominio

- **renta** = propiedad. **cliente** = inquilino. **abono** = pago. **cobranza** = cobros.
- `getStatusRenta` es la **única fuente de verdad** para AL DÍA / ATRASADO. Ningún otro camino
  puede sobrescribir ese estado.
- **Cobranza usa montos NETOS; Mi Portafolio usa SUBTOTALES.** Mezclar unidades produce deuda o
  saldo a favor fantasma. `_detectarMontoPagadoConsistente()` infiere la renta real de los abonos
  recientes y normaliza a subtotal con `_calcFactorNetoRenta()`.
- Montos **menores a $1 peso** (residuos de redondeo de IVA/retenciones) se tratan como cero,
  tanto en morosidad como en saldo a favor.
- El campo `tipo` de una propiedad se usa como **agrupador de edificio** ("Franco Propiedades",
  "Plaza Quebec"), no solo como categoría de inmueble. Es intencional.

---

# LA LECCIÓN MÁS CARA: SINCRONIZACIÓN MULTI-DISPOSITIVO

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
- En iOS el transporte WebChannel se queda "zombi": por eso `experimentalForceLongPolling` se
  aplica en **todo iOS** (iPhone/iPad, por userAgent), una vez al inicializar. **Nunca**
  enganchar `disableNetwork()`/`enableNetwork()` a eventos de carga: ya se intentó y tumbó la app
  en producción. **No vuelvas a condicionarlo a `navigator.standalone`**: es una API no estándar
  de Apple, deprecada, que en iOS 18.7 / Safari 27 dejó de devolver `true` aun abriendo desde el
  ícono. La condición daba falso, el bloque ni se intentaba, y la cura llevaba 27 versiones sin
  aplicarse. Tampoco uses `display-mode: standalone`: da verdadero también en la PWA de
  **escritorio** y le activa long-polling a la computadora, donde WebChannel va mejor
  (`FIX LP-STANDALONE-FALSO`, 2026-10).
- Importaciones: batches atómicos de 450 + guardia post-importación de 90s
  (`_postImportGuardUntil`).
- `_visiblesCache` debe invalidarse por cambio de referencia, no por llamadas manuales.
- **Firestore rechaza el documento ENTERO si un solo campo vale `undefined`**, y en JavaScript
  `{ campo: undefined }` *sí crea la llave* (vacía) en vez de omitirla — `Object.assign` la
  arrastra igual. Un `x ? valor : undefined` dentro de un objeto es una bomba. **Todo escritor de
  Firestore debe pasar su payload por `_sanitizeForFirestore` antes del `set()`**, y sanearlo
  ANTES de colgarle centinelas (`serverTimestamp`) para que el centinela ni pase por ahí. Se
  sanea en el ESCRITOR, no en el origen: cura cualquier campo `undefined` presente y futuro.
  Así nació `FIX ABONO-UNDEFINED` (2026-09): `facturaMultiMes` dejaba tres campos en `undefined`
  al facturar un solo mes, y ese abono no pudo subir nunca.
- **Toda cola de reintentos necesita tope, y el tope hay que LEERLO.** Contar los intentos sin
  compararlos contra un máximo no sirve de nada. Un fallo permanente (no de red) convierte un
  reintento "durable" en un bucle eterno de avisos: la app se ve rota aunque los datos estén a
  salvo, y el usuario aprende a ignorar los avisos — que es peor que no tenerlos. Antes de
  reintentar, pregúntate **si este error puede tener éxito alguna vez**; si no, ríndete y avisa
  una sola vez. Ver `FIX AVISOS-BUCLE` y `FIX ABONO-UNDEFINED` (2026-09).

## La baja de un inquilino: por qué este flujo se lleva el dinero

El 30-oct-2026 Franco dio de baja a Claudia en ALEJANDRAS DEPA B. Resultado: la inquilina
seguía asignada, sus 8 pagos ($132,000) habían desaparecido, y la propiedad decía que debía
todo desde febrero. **Es la cuarta vez que este flujo cuesta dinero** (Omar, Algodoneros en dos
propiedades, TAMESIS DEPA F, y ahora Claudia). Entender por qué es tan peligroso evita la quinta.

**La baja hace tres cosas en orden**: archiva la ficha del inquilino CON TODOS SUS PAGOS dentro
de `renta.historialInquilinos`, deja lápidas de los abonos, y los borra de la nube. Después del
tercer paso, **esa ficha archivada es la única copia que existe de esos pagos.** Todo lo que
toque `historialInquilinos` a partir de ahí está tocando dinero irrecuperable.

Lo que falló esta vez fueron dos cosas distintas, las dos en sincronización:

1. **`FIX HISTORIAL-NO-ENCOGE`** — `_applyMainDocSnapshot` termina con
   `state.rentas = _mainFiltradas`: **reemplaza el arreglo completo** con el que trae el doc
   principal. Ese arreglo embebido puede estar FÓSIL —de antes de la baja— y no traer la ficha.
   Había un rescate, pero (a) nunca incluyó `historialInquilinos` y (b) vivía DENTRO de un `if`
   que exige baja reciente (<5 min) o escritura local reciente (<60s). Pasada la ventana, el
   fósil se impone entero. Cura: fusión-unión de `historialInquilinos`, lápidas y `_vacatedAt`,
   **fuera del `if` y sin condición**. La unión es segura sin lápidas propias porque no existe
   forma de borrar una ficha del historial: si falta en una copia, es pérdida, nunca borrado.
2. **`FIX EX-INQUILINO-RESUCITA`** — una sola línea: `cr.clienteId = _memCli || _docCli`. Toma
   el del doc en cuanto la memoria esté vacía. Su comentario contempla tres casos correctos y
   le falta el cuarto: **la memoria está vacía porque el inquilino se dio de baja**. Cura: si
   ese cliente ya está archivado como ex-inquilino de esa propiedad con fecha de salida, un
   snapshot no puede volver a meterlo; sólo una acción local.

### Lo que hay que llevarse de aquí

- **Protege lo irrecuperable, no lo que se puede volver a teclear.** La lista de campos
  críticos era `clienteId, monto, inicio, fin, dia, nombre, tipo`: todo recuperable en diez
  segundos tecleando. Lo único que no se puede reconstruir —la ficha archivada— quedaba fuera.
  Al escribir una guardia, pregúntate **qué pasa si esto se pierde**, no qué tan central parece.
- **Una marca de reloj no es una protección durable.** `_vacatedAt` tenía ventana de 5 minutos
  y se perdía al recargar. La señal buena vive en los datos y no caduca: *"este cliente ya está
  archivado como ex-inquilino, con fecha de salida"*.
- **Un vacío puede ser una decisión, no una ausencia.** `clienteId: ''` después de una baja
  significa "no tiene inquilino", no "no sé quién es". Tratar lo segundo por lo primero fue lo
  que resucitó a Claudia. Cuando leas un campo vacío, pregúntate si alguien lo vació a propósito.
- **Un campo que se llena y no se usa es peor que no tenerlo** (`FIX FECHA-SALIDA-IGNORADA`).
  El modal pedía la fecha de baja, dejaba teclearla, y `registrarSalidaInquilino` archivaba
  siempre con la de hoy. Franco puso 14-ago y el historial decía 30-oct. Nadie se entera.
- **Un botón que hace otra cosa es un bug, no un detalle** (`FIX BAJA-BOTON-MIENTE`).
  `if (tipo === 'inmediata' || fecha <= hoyISO)` mandaba por el camino inmediato en cuanto la
  fecha fuera pasada, dijera lo que dijera el botón. Si una condición ignora lo que el usuario
  eligió, el usuario no puede aprender a usar la app.

### Cómo se diagnosticó, después de dos hipótesis equivocadas

Culpé primero a otro dispositivo y después a la verificación previa de la baja. **Las dos se
cayeron al probarlas**, y una tercera vez el error estuvo en mi prueba, no en el código: borré
una llave en vez de ponerla en `[]`, y `Object.assign` no sobrescribe llaves ausentes.

Lo que sí funcionó, y conviene repetir:

- **Comparar dos respaldos campo por campo.** El de antes y el de después del incidente. Ahí
  salió que `_vacatedAt`, las lápidas y la ficha estaban **ausentes**, no vacías — y eso
  descartó de golpe los caminos que usan `Object.assign`, porque una llave ausente no
  sobrescribe. Sin ese detalle habría seguido arreglando el lugar equivocado.
- **Medir el alcance antes de tocar.** De 47 propiedades, sólo una perdió pagos. Saberlo cambió
  la urgencia y descartó un problema sistémico.
- **Simular el escenario exacto** con las funciones extraídas del archivo de producción: baja
  hace 6 minutos, llega el fósil. Sin la cura: 0 fichas, $0. Con la cura: 1 ficha, 8 pagos,
  $132,000. Y probar también que la guardia **no estorba** en los casos legítimos (instalación
  nueva, y volver a rentarle a la misma persona).

---

# LA SEGUNDA LECCIÓN: LOS BUGS QUE IMPORTAN FALLAN EN SILENCIO

Las jornadas del 26 y 27 de octubre de 2026 arreglaron ocho cosas (v109–v116). **Ninguna
avisaba.** Todas se descubrieron meses después, por síntomas que parecían no tener relación: un
parpadeo, una pantalla en blanco, un scroll a saltos. Si un arreglo crítico puede dejar de
aplicarse sin que nadie se entere, tarde o temprano deja de aplicarse.

## Todo arreglo crítico tiene que dejar rastro, y el rastro tiene que verse desde el teléfono

El long-polling de iOS llevaba **27 versiones** sin encenderse. No fallaba: la condición daba
falso y **no se intentaba siquiera**, así que no había ni aviso de éxito ni de fallo. Lo que lo
delató fue un `WebChannelConnection ... transport errored` en la bitácora del iPhone, meses
después.

La bitácora solo captura `console.warn` y `console.error`. **Un `console.log` es invisible desde
el celular**, que es donde ocurren los problemas de este proyecto. Si un arreglo importa, su
confirmación va por `console.warn` con el texto aclarando que es informativo.

Corolario: cuando una condición decide si se aplica una cura, **el camino que NO la aplica
también debe poder verse**. Un silencio total no distingue "funcionó" de "nunca corrió".

## Si el síntoma y la medición no cuadran, el problema está en otra capa

El parpadeo de las tarjetas costó **tres hipótesis, dos equivocadas**. Se descartaron midiendo en
el navegador de Franco, no opinando:

- ¿Bucle de escrituras entre dispositivos? → **2 escrituras en 20 s.** Descartado.
- ¿Listener muriendo y reconectando? → **0 muertes, 0 reinicios.** Descartado.
- Contadores: **2 repintados medidos contra ~13 parpadeos vistos.**

Esa última contradicción fue la que resolvió el caso: si el JavaScript pinta dos veces y el
usuario ve trece, **lo que parpadea no es JavaScript**. Era una animación CSS que se relanzaba en
cada repintado. Lo mismo con la lentitud en la computadora: el pintado medía **35 ms**, así que
el segundo y medio no era del código sino del navegador dibujando — un `backdrop-filter` en un
header fijo, que obliga a recalcular el desenfoque en cada cuadro del scroll.

**Instrumentar en vivo es barato y concluyente.** Envolver una función para contarla, o inyectar
un `<style>` que desactive un efecto, se deshace recargando y no toca producción. Antes de tocar
código, pídele a Franco una medición: él las corre sin problema y zanjan la discusión.

Corolario iOS/escritorio: que el iPhone vaya **más** fluido que la computadora no es raro, es una
pista. Safari acelera por hardware efectos que Chrome en Windows calcula a pulso.

## Cinco intentos fallidos = estás arreglando el síntoma

Quitar el velo de la barra de estado en iOS costó **cinco intentos revertidos** (v118, v121-v122,
v123, v127, v129). Los cinco hacían lo mismo con distinta maña: ajustar el `padding-top` de
`.main` para que el header dejara de tapar el contenido. Medir más tarde, medir con
`ResizeObserver`, medir también el menú de abajo. Ninguno funcionó, y cada uno parecía una
hipótesis razonable.

La causa estaba una capa más abajo, en una línea que llevaba años ahí: `body { height: 100vh }`.
En iOS `100vh` **no es la altura visible**, es la pantalla completa sin descontar las barras del
sistema. Con `black-translucent` la app ocupaba toda la pantalla y el número coincidía; con
`default` iOS reserva la barra de estado y el body quedaba ~62px más alto que lo visible. Ese
sobrante hacía que se desplazara la **página entera** en vez de solo `.main`, y el padding —el
que tanto ajustábamos— se iba hacia arriba con ella. La cura es `100dvh`, que sí es la altura
visible real, declarado **después** de `100vh` como respaldo para navegadores viejos.

Tres cosas que dejó este caso:

- **Si llevas tres intentos y los tres fallan por razones distintas, la hipótesis compartida es
  la que está mal.** No era "medimos mal el header": era que medir el header nunca iba a servir.
  Parar y preguntarse *¿qué están dando por cierto todos mis intentos?* vale más que un sexto.
- **Lo zanjó medir en el aparato.** `DIAG-LAYOUT` (v129) escribió en la bitácora `mainTop=-62`
  con `headerH` estable y `padTop(style) == padTop(real)`. Ese solo renglón mató de un golpe las
  otras dos hipótesis —medición temprana y sobrescritura— y señaló la buena. Cuando un síntoma
  sobrevive a varios arreglos, **instrumenta y pide la bitácora antes de intentar el siguiente**.
- **Prefiere la unidad que el navegador calcula a la constante que tú calculas.** La duda de
  Franco fue la correcta: *"¿no va a quedar descuadrado en otros iPhones o Androids?"*. Un número
  fijo en píxeles ajustado a un aparato se descuadra en el siguiente; `dvh` lo resuelve cada
  navegador con su propia realidad. Vale para `safe-area-inset`, `dvh`/`svh`/`lvh` y cualquier
  medida del sistema: si existe la que pregunta, no inventes la que adivina.

Corolario de higiene: el diagnóstico temporal **se quita cuando cierra el caso** (v131). Si se
queda, llena la bitácora de ruido y tapa los avisos que sí importen — que es exactamente la forma
en que este proyecto se queda ciego.

## Si una función lee con reglas, su par tiene que escribir con las mismas

`_getDateVal` distinguía `type="date"` al leer. `_setDateVal` no lo distinguía al escribir, y le
metía `DD/MM/AAAA` a un input de fecha, que **lo rechaza y se queda vacío, sin error**. Llevaba
tiempo vaciando la fecha sugerida al programar una baja y nadie lo relacionó.

Cuando encuentres un par leer/escribir, revisa los dos lados antes de tocar uno.

## Protege TODOS los caminos, no el que te trajo el reporte

Dar de baja a un inquilino tiene **tres** caminos. Se protegieron dos en v102/v103 y el tercero
—bajas programadas— siguió borrando pagos sin verificar nada: ahí se fueron Omar y Algodoneros en
dos propiedades, $215,180 de historial que hubo que reconstruir desde respaldos.

Lo mismo con `_finishLogin`, cuyo propio comentario dice *"shared by all login paths"*: el login
biométrico se había quedado fuera y dejaba la app sin conectar a Firebase, en blanco.

**Al proteger un camino o crear una función compartida, busca a sus hermanos** (`grep`) y
confirma uno por uno que la usan. Un comentario que dice "todos" no garantiza que sean todos.

## Revertir en producción es correcto; confundirlo con un diagnóstico, no

El 26-oct la app salió en blanco tras publicar v108 y se revirtió de inmediato. Fue lo correcto
—con clientes en vivo, primero se vuelve a terreno seguro—, pero **la causa resultó ser otra**:
un bug viejo del login con huella. Franco tenía razón al decir "no reviertas".

Revertir compra tiempo, no explica nada. Al hacerlo, dilo con esas palabras: *"revierto por
precaución, todavía no sé la causa"*. Y no des por culpable al último cambio solo por ser el
último.

---

# LA TERCERA LECCIÓN: LA MISMA REGLA ESCRITA DOS VECES

El 28-oct-2026 Franco preguntó por qué un inquilino al corriente aparecía debiendo $477 en la
pantalla de Inicio. Salieron **tres causas raíz**, y las tres eran la misma enfermedad:

> La regla "cuánto se espera de esta propiedad este mes" está escrita a mano en cada pantalla,
> y las copias se desalinean en un detalle.

Ya había un `FIX MONTO-VIGENTE` (2026-09) en el código diciendo exactamente eso, con cuatro
casos previos listados. Este fue el quinto, sexto y séptimo. **Cuando una regla de negocio se
repite, no se repara la copia que se queja: se busca cuál de las dos tiene razón y se deja una
sola.**

Las tres de ese día:

1. **`FIX HISTORIAL-INQUILINO-ANTERIOR`** — `historialMonto` es un timeline de "qué renta valía
   esta propiedad desde tal fecha". Al dar de baja a un inquilino sus entradas se quedaban
   vigentes **para siempre**, y le ganaban a `renta.monto` porque su última entrada ya tenía
   fecha pasada. El inquilino nuevo entraba con otra renta y el sistema seguía esperando la del
   anterior. Cura: leer el timeline con la fecha del contrato vigente como piso. No se borra
   nada —el pasado no se toca—, solo deja de aplicarse a un contrato al que nunca perteneció.
2. **`FIX VENCIDO-SOBRE-ESCRIBE-STATUS`** — el dashboard hacía
   `max(saldoVencido, faltanteCalculado)`: cuando su propia cuenta salía más alta, **le ganaba a
   `getStatusRenta`**. Eso viola la regla de la casa. Y el `max` no aportaba nada legítimo:
   con `plazoVencio` en true el mes en curso ya está dentro de `totalVencido`, así que solo
   podía inflar. Lo único que destapaba eran desacuerdos entre las dos cuentas.
3. **`FIX SONDA-DIA-COBRO`** — `_montoEfectivoEnMes` preguntaba al timeline con el **día 1** del
   mes y `getStatusRenta` con el **día de cobro**. Si la renta cambiaba a media del mes, ese mes
   tenía dos rentas distintas según quién preguntara.

## Un desacuerdo entre pantallas es un bug, no una cifra que publicar

El `max` del punto 2 convertía una discrepancia interna en **una acusación de deuda contra un
inquilino que estaba al corriente**. Si dos caminos del sistema no coinciden, el número alto no
es "el conservador": es la señal de que uno de los dos está mal. Arréglalo en su causa; no lo
muestres como adeudo.

Corolario: `getStatusRenta` es la única fuente de verdad para AL DÍA / ATRASADO, y eso significa
que **ningún otro camino puede reportar más deuda que ella**. Si alguno cree que debería, lo que
hay es un bug que encontrar, no un `max` que poner.

## Correr el código real contra un respaldo zanja la discusión

Lo que resolvió el caso en una tarde fue un arnés de unas 40 líneas: extraer `getStatusRenta` y
sus dependencias **del archivo de producción** —sin copiarlas a mano— y correrlas en Node contra
el respaldo que Franco exportó. Eso permitió, sin tocar producción:

- reproducir el $476.67 exacto y ver que el total de las 7 propiedades daba $78,991.67 contra
  los $78,992 de la pantalla — prueba de que la réplica era fiel y no una aproximación;
- **medir el alcance antes de editar**: solo 3 de 47 propiedades tenían entradas anteriores a su
  contrato, y 2 de ellas eran inofensivas;
- correr **código viejo contra código nuevo** sobre los mismos datos y comparar 783 meses de 47
  propiedades, para demostrar que cambiaban 3 meses y ni uno más;
- **adelantar el reloj** y comprobar que el arreglo aguanta en noviembre y diciembre.

Si tienes un respaldo y la función, puedes probar antes de publicar. Hazlo siempre que el cambio
toque dinero. Extraer la función del archivo (no reescribirla) es lo que hace válida la prueba:
una copia a mano prueba tu copia, no el código que corre.

## Prueba también el arreglo "obvio" de datos

Franco confirmó que la renta pactada eran $20,000 y lo natural era anotarlo en el historial. El
arnés mostró que **esa entrada habría reintroducido el bug**: fechada el día 3, quedaba después
del día 1 con que el Inicio sondeaba, y la pantalla volvía a leer la renta vieja. Lo correcto
era no escribir nada — el contrato nuevo no ha tenido cambios de renta, y un historial vacío es
el registro exacto de eso. Anotar el cambio habría inventado un evento que nunca ocurrió.

**Antes de mandarle a Franco un script que toca datos, córrelo contra el respaldo.**

## Cuando alinees dos copias, copia hasta los defectos

Al alinear `_montoEfectivoEnMes` con `getStatusRenta` se copió su derivación del día de cobro
**verbatim**: misma herencia del cliente, mismo mediodía, mismo desbordamiento si el día no
existe en ese mes. Mejorar un detalle "de paso" en una sola de las dos las vuelve a separar —
que es el bug que estabas curando. Si un defecto compartido merece arreglo, es otra tarea y se
arregla en los dos lados a la vez.

---

# LA CUARTA LECCIÓN: UN DATO QUE NO ENTIENDES NO ESTÁ MAL

El 4-nov-2026, arreglando que el modal de facturar dijera "924 timbres" mientras FiscalAPI
respondía *"Saldo insuficiente. Disponible: 0"*, di por hecho que ese 924 era basura: un
contador que la app lleva sola y que nunca le pregunta nada a nadie. Lo **sustituí** por el
saldo real de FiscalAPI, y lo publiqué (v155).

Franco lo corrigió en una línea: *"los 924 timbres son los que el usuario compró en GestorRenta
y los que le quedan, no los que están disponibles en FiscalAPI"*.

Las dos cifras eran **correctas**. Una es el inventario que ese usuario compró dentro del
producto; la otra, lo que hay en la cuenta de FiscalAPI. Sustituir la primera por la segunda le
habría mostrado a un cliente de pago un número que no es suyo. La cura buena era la que pidió
él: cada una en su lugar, y la de FiscalAPI **debajo**, como dato informativo (v156).

**Antes de declarar que un número miente, pregunta qué significa.** Un campo que no cuadra con
tu modelo mental casi siempre significa que el modelo mental está incompleto, no que el dato
esté roto. Y en un producto que se le vende a terceros, confundir un dato del negocio con un bug
sale más caro que el bug.

## Dos pruebas que cerraron casos sin gastar nada

- **La misma variable que se guarda y se envía es una prueba gratis.** Las facturas llegaban al
  SAT con la ñ rota (`RivereÃ±a`). `desc` entra al payload en la línea 31348 y se guarda como
  `descripcionFactura` en la 31514, sin reasignarse en medio. Como lo guardado estaba **limpio**
  en seis respaldos, lo enviado también lo estaba: el daño es del otro lado. Caso cerrado sin
  timbrar una sola factura de prueba.
- **Correr dos versiones lado a lado en un navegador real.** El botón REP no hacía nada, sin
  error ninguno. Cargando v151 y v152 en Chromium y midiendo `getComputedStyle().display`
  después de `classList.add('open')`: el modal del REP daba `none` y el de cancelar `flex`. La
  causa era un `style="display:none"` escrito en la etiqueta, que le gana a cualquier clase. Un
  minuto de medición contra horas de leer código.

## Lo que no está permitido, está prohibido

Las reglas de Firebase Storage sólo cubrían `fichas/`. Las otras **cinco** carpetas que usa la
app —`facturas`, `comprobantes`, `clientes`, `emisores`, `complementos`— **nunca tuvieron
permiso**, y nadie se enteró en meses: los XML y los QR de las facturas fallaban al guardarse y
al leerse, en silencio, con un `console.warn` que nadie miraba.

Al agregar una carpeta nueva en Storage, **su regla va en el mismo cambio.** Y si algo binario
"a veces no aparece", mira las reglas antes que el código.

Corolario del mismo caso: `_uploadBase64ToStorage` dice en su comentario *"fallback: keep base64
in state"*, pero quien la llama descarta el valor si viene en base64 — o sea, **la red de
seguridad no está conectada**. Un comentario no es una garantía: sigue el valor de retorno hasta
donde se usa.

## Otra vez: protege TODOS los caminos

El contador de timbres se muestra en **cuatro** lugares —el modal de facturar, la tarjeta grande
de Facturación, la línea de estado "Producción — N entidades — N timbres", y una **guardia que
bloquea el timbrado**— y la primera entrega tocó uno solo. Es el mismo error que ya está escrito
dos veces en este archivo. Antes de dar por cerrado el cambio de un número, **`grep` del campo**
y cuenta cuántos lo pintan.

---

# DESPLIEGUE (lo hace Franco)

`git push` → esperar 1-2 min a GitHub Pages → abrir Safari con `?v=NN` (el número nuevo de
`APP_VERSION`) → confirmar que carga → borrar el ícono viejo de la pantalla de inicio →
volver a agregar la PWA.

---

# PENDIENTES CONOCIDOS

> Revisado y actualizado el 14-nov-2026 con una auditoría del archivo. Lo que estaba aquí y ya
> no es cierto se quitó; lo que sigue vigente se volvió a comprobar contra el código, no contra
> la memoria. **Si vas a confiar en un punto de esta lista, verifícalo primero**: una lista
> desactualizada hace perder más tiempo que no tenerla.

- ~~**`subEmailVal is not defined`** en `guardarUsuario`~~ → **YA ARREGLADO** (`FIX SUBEMAILVAL`,
  ago-2026). Verificado el 14-nov: la variable mala ya no existe en el archivo.
- ~~**`_afterFirebaseLogin` podía borrar la lista de usuarios**~~ → **YA ARREGLADO**
  (`FIX AFTERLOGIN-FOSIL`, ago-2026). Hoy sólo siembra al titular cuando confirmó que la lista
  del servidor está vacía.
- ~~**19 facturas huérfanas** sin diagnosticar~~ → **RESUELTO el 26-27 oct 2026.** La causa no
  era una sino dos: (a) ráfagas de timbrado que iOS cortó y dejaron la factura sin su abono —
  BODEGA EL RANCHITO, reparado recreando el abono con el mismo id que el CFDI ya apuntaba; y
  (b) bajas de inquilino que borraron los pagos — Lisboa #186-B y TAMESIS DEPA F, reparados
  archivando el historial de Algodoneros desde los respaldos del 24-sep y 07-ago ($142,680 y
  $72,500). El contador quedó en cero. **La causa (b) está cerrada en el código** con
  `FIX BAJA-PROG-SIN-GUARDIA`. Si vuelven a aparecer huérfanas, revisa primero si hubo una baja
  reciente.
- ~~**Depósitos colgados al cambiar de inquilino**~~ → **DIAGNOSTICADO el 14-nov-2026. NO es
  un bug activo del código.** La hipótesis que estaba anotada aquí —un snapshot stale que los
  resucitaba— **era equivocada**. Lo que pasó: los dos casos ($41,000 de Lisboa #186-B y
  $25,000 de TAMESIS DEPA F) son **residuo de la reparación manual del 26-27 oct**. Sus fichas
  traen exactamente $142,680 y $72,500, los montos que este mismo archivo registra como
  reconstruidos desde los respaldos del 24-sep y 07-ago. Aquella baja falló —por eso se
  perdieron los pagos— y al fallar **nunca llegó a limpiar el depósito de la propiedad**.
  Evidencia fina: en TAMESIS DEPA F el depósito vivo es byte por byte idéntico al archivado,
  hasta el espacio final de la nota, o sea el mismo objeto nunca borrado; en Lisboa el
  archivado quedó congelado en "Pagado a Cambar / devuelto:false" mientras el vivo dice
  "Pagado a Franco / devuelto el 27-oct", es decir sobrevivió y Franco lo editó después.
  **Los cuatro caminos de baja de hoy sí hacen `r.deposito = null`** (verificado).
  **Decisión de Franco (14-nov): los dos se dejan como están, él los corrige a mano.** No hay
  nada que programar aquí y no hay que volver a proponerlo.
  Hueco latente que salió de paso, real pero NO culpable de estos dos casos: `deposito` no
  está en `_criticalFields` ni en `_critFields2`, así que ningún snapshot lo protege.
- **El CAMBIO DE INQUILINO es un CUARTO camino de baja** (`_confirmarCambioInquilino`), además
  de los tres que menciona LA SEGUNDA LECCIÓN. Y **todavía tiene el orden destructivo** que
  `FIX BAJA-ORDEN-DESTRUCTIVO` (v158) curó en `confirmarBajaInquilino`: archiva la ficha en
  memoria, **borra los pagos de la nube**, y sólo al final `_guardarRentaConLimite()` persiste
  la propiedad. Si esa escritura no aterriza, los pagos se fueron y la ficha se queda sólo en
  la memoria de ese aparato. Es, con mucha probabilidad, lo que les pasó a los dos casos de
  Algodoneros en octubre. **Pendiente de autorización de Franco** — la cura es la misma de la
  v158: persistir primero, borrar después, y abortar deshaciendo si no se pudo guardar.
- **La ñ y los acentos llegan rotos al CFDI** (`Torreón` → `TorreÃ³n`). **No es de la app**: el
  texto sale limpio y vuelve dañado (ver LA CUARTA LECCIÓN). Se añadió `charset=utf-8` a las dos
  peticiones de timbrado y **no sirvió**: FiscalAPI lo ignora y lee el cuerpo como Latin-1.
  Reportado a FiscalAPI el 4-nov con dos UUID de referencia, uno correcto del 2-oct
  (`7d4fe25e-7d79-4070-994b-7b39a8ccd44d`) y uno dañado del 3-nov
  (`d37421cb-b803-419b-a1ea-7caa0c21c675`). Mientras tanto, los conceptos afectados se escriben
  sin acentos a mano. **No meter código que los quite automáticamente** sin que Franco lo pida:
  sería tapar el bug de otro cambiando en silencio el texto de sus facturas.
- ~~**La guardia de timbrado usa el contador local**~~ → **ARREGLADO v165 (14-nov-2026)**,
  `FIX GUARDIA-TIMBRES-FALSA`. Eran DOS guardias idénticas, en `facturarMes` y `facturarAbono`.
  Decisión de Franco: avisar y dejar pasar, en vez de bloquear. Ahora sale un confirm con
  "Continuar" / "Ir a comprar". **Si se vuelve a tocar, se tocan las dos**: el bloque es el
  mismo en ambas y separarlas sería el bug de siempre.
- ~~**El REP no llama a `descontarTimbre()`**~~ → **ARREGLADO v165 (14-nov-2026)**,
  `FIX REP-SIN-TIMBRE`, en `confirmarComplementoPago()`. Mismo patrón que su gemela
  `confirmarFactura()`. **Pendiente de confirmar en vivo**: el próximo REP que timbre Franco
  debe bajar el contador en 1 y dejar su renglón en el historial de timbres.
- **La regla "cuánto vale esta propiedad al mes" está escrita cuatro veces.** Una es
  `_montoMostrarRenta()` (la buena); las otras tres siguen en línea dentro de `renderDashboard`
  (×2) y `_verPropiedadesEnModal`. Unificarlas toca la aritmética del dashboard: necesita PLAN
  DE CAMBIO y comparación antes/después sobre los respaldos.
- **Datos por decidir, de los barridos de oct-nov 2026** (todos verificados, ninguno tocado):
  TAMESIS DEPA B sin pago en septiembre y con el cambio de inquilino sin registrar; LOCAL JUAREZ
  Local 1, 2 y 3 con pago y depósito de julio contra un contrato que inicia en septiembre;
  depósitos de La Rivereña ($96,000) y TAMESIS DEPA F ($25,000) sin confirmar de qué inquilino
  son; Bodega Sarabia con ~$1,049 faltantes de noviembre y $4,400 ya facturados de menos.
- Arreglo de documento-fósil para **clientes** completo solo a medias.
- 8 líneas con `const`/`let` heredadas. No rompen nada; emparejarlas sólo si Franco lo pide.
  **No se anotan los números de línea**: se corren solas con cada cambio y la lista queda
  mintiendo. `node validate.js GESTOR_DE_RENTAS.html` las imprime al día.

## Abiertos desde la auditoría del 14-nov-2026

- **Los clientes no tienen reintento automático.** Rentas y abonos sí (`_pendingRentaWrites`,
  `_pendingAbonoWrites`, con su flush durable). `_fbWriteCliente` sólo deja la marca
  `_fallosEscrituraCliente` que agregó `FIX GUARDADO-MUDO`: ahora se SABE que falló y se avisa,
  pero nadie lo vuelve a intentar. Falta engancharlo a `_flushPendingRentaWrites`.
- **Quedan 12 `try/catch` alrededor de escritores que no relanzan.** `FIX GUARDADO-MUDO` arregló
  los 5 que le mentían al usuario o contaban mal; los otros 12 sólo escriben en consola, así que
  son inofensivos y se dejaron intactos. **Si tocas uno, no te fíes de su `catch`**: usa
  `_guardoBien()`.
- ~~**Los chips de Propiedades mezclan las de baja programada dentro de "Sin rentar"**~~ →
  **DECIDIDO el 14-nov-2026: se queda así.** Se le preguntó a Franco con un caso real en la
  mano (ALEJANDRAS DEPA C, baja programada al 12-dic, que hace que Inicio cuente 3 y
  Propiedades 4) y respondió que lo dejara como está. **No es un bug pendiente y no hay que
  volver a proponerlo**: en Propiedades el número y la lista concuerdan entre sí, que es lo
  que importa. Lo mismo aplica al desglose por tipo (`tipoEstado:...|sin-rentar`).
  Sólo el modal de Inicio lleva el trato informativo (`FIX SINRENTAR-BAJAPROG-CUENTA`).
- ~~**LISBOA DEPA E / YOSEFF: falta confirmar los 7 pagos restaurados**~~ → **VERIFICADO el
  14-nov-2026** contra el respaldo de ese día: la ficha de YOSEFF trae los **7 pagos,
  $198,000 exactos**, `totalCobrado` y `numPagos` concuerdan, agosto y septiembre siguen
  fuera con sus 2 lápidas, y la salida quedó con la fecha tecleada (14-ago), no la de hoy.
  La propiedad ya tiene a Ladislao Medina desde el 15-ago y `bajaProgramada` en null.

### Revisado el 14-nov y SIN problema (no volver a buscar aquí sin motivo)

- **Fechas:** 29 usan la convención de mediodía (`T12:00:00`) y la única que no está en un aviso
  de vencimiento de contrato. No hay riesgo de corrimiento de día ni de mes.
- **`getStatusRenta` sigue siendo la única fuente de verdad:** ningún otro camino reporta más
  deuda que ella. Los `Math.max` que quedan son todos para no bajar de cero.
- **Las 4 copias de la regla del monto hoy son idénticas** (comparadas línea por línea). No hay
  desacuerdo *ahora*; el riesgo sigue siendo la próxima vez que se edite una sola.
- **`eliminarAbono` ya guarda la lápida ANTES de borrar.** Ese flujo no tiene el bug de orden
  que curó `FIX BAJA-ORDEN-DESTRUCTIVO`.
