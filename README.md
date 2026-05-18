# 🐱 Catsino Meme Slot Machine Engine

Un motor de juego de tragamonedas (Slot Machine) altamente optimizado para entornos web modernos (React/Zustand), completamente personalizado con una estética de gatos meme y GIFs animados de alta velocidad.

Este proyecto cuenta con un algoritmo robusto que implementa líneas de pago complejas, gestión avanzada de símbolos especiales (*Wild* y *Scatter*), multiplicadores sorpresa aleatorios y un sistema automatizado de rondas de giros gratis (*Free Spins*).

---

## 🚀 Arquitectura y Componentes del Sistema

El motor está estructurado de manera modular dividiendo de forma estricta las matemáticas del juego, el estado global y los componentes de renderizado visual:

### 1. Capa de Configuración Matemáticas (`src/engine/constants.js`)
Define las propiedades estáticas, la matriz visual indexada y las secuencias físicas de los rodillos[cite: 1]:
* **Símbolos y Pesos:** Configura los 11 símbolos únicos mapeados como un diccionario indexado por ID (optimizando la lectura directa por puntero en el motor)[cite: 1]. Los memes `meme_cat_1` a `meme_cat_9` actúan como símbolos base, mientras que `WILD` (Gato 10) y `SCATTER` (Gato 11) gestionan las bonificaciones[cite: 1].
* **Paylines (Líneas de Pago):** Define las coordenadas bidimensionales `[fila, columna]` dentro de la ventana visible de 5 × 3 para las 9 líneas de premio configurables[cite: 1].
* **Reel Strips (Cintas de Rodillo):** Secuencias físicas cíclicas balanceadas estadísticamente para garantizar una experiencia de juego justa con una volatilidad media-alta[cite: 1].

### 2. Motor de Evaluación Logística (`src/engine/slotEngine.js`)
Contiene la lógica puramente matemática del juego[cite: 1]:
* **`generateSpinPositions()`:** Genera los desplazamientos aleatorios virtuales para los 5 rodillos independientes de forma síncrona[cite: 1].
* **`getResultMatrix()`:** Mapea de forma cíclica (usando aritmética modular `index % strip.length`) las posiciones físicas convirtiéndolas en la matriz visible de juego[cite: 1].
* **`evaluateMatrix()`:** El núcleo algorítmico[cite: 1]. Evalúa las líneas de pago activas buscando rachas idénticas continuas de izquierda a derecha, sustituye dinámicamente comodines mediante la lógica de exclusión de *Wilds*, procesa la dispersión de *Scatters* de manera global en pantalla y calcula las recompensas[cite: 1].

### 3. Renderizador Óptico Adaptativo (`ReelStrip.jsx`)
Módulo encargado de transformar la matriz de datos en la interfaz gráfica del usuario de forma eficiente[cite: 1]:
* Evalúa si la propiedad `label` del símbolo corresponde a un hipervínculo de imagen/GIF válido en lugar de texto plano[cite: 1].
* Genera animaciones de desvanecimiento por desenfoque (*motion blur*) mediante manipulación de clases CSS dinámicas durante la animación de giro[cite: 1].
* Destaca con bordes dorados e iluminación de neón únicamente las coordenadas que el motor marcó como ganadoras[cite: 1].

### 4. Interfaz de Usuario y Reglas del Juego (`PlaytableModal.jsx`)
Un componente modal interactivo que traduce las complejas mecánicas del motor a un lenguaje accesible para el usuario, renderizando dinámicamente las imágenes reales de los memes y detallando las bonificaciones vigentes[cite: 1].

---

## 📈 Especificaciones de Matemáticas y Volatilidad

* **RTP (Retorno Teórico al Jugador):** Configurado y balanceado de manera precisa a un **96.4%**[cite: 1].
* **Volatilidad:** Media - Alta (Frecuencia de acierto balanceada con grandes pagos exponenciales gracias a las mecánicas especiales)[cite: 1].
* **Frecuencia de Multiplicador:** 25% de probabilidad en cualquier tiro ganador[cite: 1].

---

## 🎯 Mecánicas Especiales de Bonificación

### 🐾 Gato Comodín (WILD)
Sustituye de forma inteligente a cualquier símbolo regular (`meme_cat_1` al `meme_cat_9`) en una línea de pago activa para formar o expandir combinaciones ganadoras[cite: 1]. 
* *Restricción:* No puede sustituir a un símbolo `SCATTER`[cite: 1].
* *Premio Mayor:* Si se completa una línea de pago pura constituida por 5 comodines (`WILD`), el motor premia al usuario con el multiplicador máximo asignado al símbolo de mayor valor del juego (`meme_cat_1`)[cite: 1].

### 🛸 Gato Bonus (SCATTER)
Funciona mediante mecánica de dispersión global[cite: 1]. No requiere alinearse secuencialmente ni estar sujeto a una línea de pago específica; basta con que aparezcan en cualquier parte de la matriz visual[cite: 1].
* **3 Scatters:** Otorga 10 Giros Gratis + Pago directo de 5x la apuesta total[cite: 1].
* **4 Scatters:** Otorga 15 Giros Gratis + Pago directo de 20x la apuesta total[cite: 1].
* **5 Scatters:** Otorga 25 Giros Gratis + Pago directo de 100x la apuesta total[cite: 1].

### 🔥 Multiplicador de Memes Sorpresa (Meme Multiplier)
Cada vez que el motor valida un giro con ganancias superiores a cero, se dispara un subproceso estocástico con un **25% de probabilidad** de éxito[cite: 1]. Si se activa, se selecciona aleatoriamente un factor del pool de multiplicadores: `[x2, x3, x5, x10]`[cite: 1]. Este factor se aplica sobre el total acumulado de todas las líneas ganadoras de ese tiro de forma inmediata[cite: 1].

---

## 🛠️ Guía de Integración de Flujo de Datos

Para activar correctamente las mecánicas avanzadas calculadas por el motor en tu manejador de estado global de React o Zustand (`useCasinoStore.js`), asegúrate de procesar la respuesta de la siguiente manera[cite: 1]:

```javascript
import { evaluateMatrix } from './engine/slotEngine';
import { useCasinoStore } from './store/useCasinoStore';

const handleSpinExecution = async () => {
  const { balance, freeSpinsLeft, deductBalance, addFreeSpins, decrementFreeSpin } = useCasinoStore.getState();
  const currentBet = totalBet;
  const isFree = freeSpinsLeft > 0;

  // 1. Validar Recursos Financieros o Giros Disponibles
  if (!isFree && balance < currentBet) {
    console.warn("Saldo insuficiente");
    return;
  }

  // 2. Gestionar Descuento Inteligente
  if (isFree) {
    decrementFreeSpin(); // Consume el giro sin alterar el balance económico
  } else {
    deductBalance(currentBet); // Consume saldo real
  }

  // ... (Ejecutar disparadores de animación visual en la UI) ...

  // 3. Evaluar Matriz Resultante con el Motor
  const spinResult = evaluateMatrix(visibleMatrix, activeLinesCount, betPerLine);

  // 4. Inyectar Resultados al Estado Global de la App
  setWinData({
    totalPayout: spinResult.totalPayout,
    winningLines: spinResult.winningLines,
    activeMultiplier: spinResult.activeMultiplier,
    freeSpinsWon: spinResult.freeSpinsWon
  });

  // 5. Verificar si se disparó la ronda Free Spins
  if (spinResult.freeSpinsWon > 0) {
    addFreeSpins(spinResult.freeSpinsWon);
    // Disparar efectos visuales o modales de celebración en la UI
  }
};