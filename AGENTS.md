\# AGENTS & WORKSPACE GUIDELINES \- MiCoche PWA

Este documento establece las normas estrictas de desarrollo, diseño UI/UX, auditoría estética y auditoría técnica que el agente debe seguir obligatoriamente en todas las fases del proyecto.

\---

\#\# 1\. Directrices de Ingeniería Frontend (Rol: Creador de Código)  
\- \*\*Stack tecnológico:\*\* HTML5 semántico, Tailwind CSS (vía CDN) para el diseño, Leaflet.js para mapas, y Vanilla JavaScript (ES6+) modular. Nada de frameworks pesados.  
\- \*\*Calidad de código:\*\* Escribe código completo, limpio y funcional de principio a fin. \*\*Nunca\*\* dejes bloques truncados, comentarios de relleno (\`// TODO\`) o código incompleto.  
\- \*\*Rendimiento y Core Web Vitals:\*\* Evita saltos de diseño (CLS \< 0.1), optimiza la carga asíncrona de scripts y asegura una fluidez de 60fps en dispositivos móviles.

\---

\#\# 2\. Directrices de Diseño y Experiencia de Usuario (Rol: Diseñador Web UI/UX)  
\- \*\*Enfoque:\*\* Mobile-first absoluto, pensado para uso rápido con una sola mano (zona del pulgar) y bajo condiciones de luz solar directa o baja iluminación.  
\- \*\*Contraste y Color:\*\* Ratio de contraste estricto (\> 4.5:1). Superficies oscuras (\`Slate-950\` / \`Slate-900\`) con transparencias funcionales (\`backdrop-blur\`).  
\- \*\*Ergonomía:\*\* Botones táctiles principales con altura mínima de \`56px-60px\`. Toda la botonera crítica debe residir en el tercio inferior (\*Bottom Sheet\*).  
\- \*\*Indicadores visuales claros:\*\* Uso de estados semánticos (Verde para GPS óptimo, Ámbar para calibración/aviso, Rojo para errores o alertas de parquímetro).

\---

\#\# 3\. Directrices de Auditoría Visual y Estética (Rol: Auditor de Diseño)  
\- \*\*Inspección visual y de estabilidad:\*\* Revisa la jerarquía visual, la armonía de la paleta de colores, la tipografía, el microcopy y la estabilidad de renderizado (prevención estricta de Cumulative Layout Shift \- CLS).  
\- \*\*Consistencia UI:\*\* Asegura que no haya elementos desalineados, tarjetas con padding incorrecto, contrastes pobres bajo luz solar o desajustes en los paneles flotantes (\*Bottom Sheets\*).  
\- \*\*Alcance:\*\* Este rol \*\*no escribe código\*\*, sino que emite un informe de fallos visuales y de diseño para que el desarrollador los corrija antes de pasar a producción.

\---

\#\# 4\. Directrices de Auditoría y Seguridad Defensiva (Rol: Auditor de Código)  
\- \*\*Manejo robusto de errores de APIs nativas:\*\* Las APIs críticas (Geolocation, DeviceOrientation, WakeLock) deben contar siempre con bloques \`try/catch\` y \*fallbacks\* visuales elegantes si el navegador deniega permisos o el dispositivo no soporta la función.  
\- \*\*Gestión de memoria:\*\* Asegura la correcta limpieza de eventos y observadores del navegador (ej. limpiar \`watchPosition\` o listeners de orientación).  
\- \*\*Validación de cambios:\*\* Antes de dar por bueno un archivo, verifica su integridad en runtime para evitar que un cambio rompa la lógica del mapa o el almacenamiento local (\`localStorage\` / \`IndexedDB\`).

\#\# 5\. Directrices a la hora de crear el código.  
\- \*\*Criterio de corte y línea idónea\*\*:  
          \- Nunca cortes de forma arbitraria a mitad de una etiqueta, selector CSS, regla \`@media\`, string literal o cuerpo de una función JS.  
          \- Localiza siempre la frontera estructural natural más idónea dentro de la ventana de 650-850 líneas:  
              \* Cierre de bloques de estilos (\`\</style\>\`).  
              \* Cierre de tarjetas, secciones o contenedores principales (\`\</div\>\`, \`\</section\>\`).  
              \* Cierre de modales completos.  
              \* Cierre de funciones o bloques temáticos de JavaScript (ej. antes de un nuevo bloque de utilidades, listeners o inicialización).  
              \* Apertura o cierre del bloque \`\<script\>\`.  
      \- \*\*Marcadores de Ensamblaje Exactos (Inicio y Fin)\*\*:  
          \- En secciones HTML fuera de \`\<script\>\`, utiliza marcadores de comentario HTML: \\\`\\\`  
          \- \*\*REGLA ESTRICTA DE JAVASCRIPT\*\*: Si el corte o marcador se sitúa DENTRO de etiquetas \`\<script\>\` o en archivos JS, queda \*\*TERMINANTEMENTE PROHIBIDO\*\* usar la sintaxis \\\`\\\`. Debe escribirse obligatoriamente como comentario nativo de JavaScript: \`// \--- \=== MARCADOR DE ENSAMBLAJE: PEGAR PARTE X JUSTO DEBAJO DE ESTA LÍNEA \=== \---\`  
          \- Al final de cada entrega intermedia, incluye el marcador de fin correspondiente indicando qué parte es y cuál debe solicitar a continuación.  
          \- Al inicio de la siguiente entrega, incluye el marcador de continuación correspondiente para garantizar que el usuario sepa exactamente dónde empalmar el código sin duplicar ni perder líneas en su editor (como VS Code).  
      \- Al finalizar la parte actual, indica al usuario de manera concisa que pida la siguiente parte (ej. \*"Indica 'continúa con la Parte X' para entregarte el siguiente bloque"\*).  
