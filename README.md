# 🎰 Catsino: La Odisea de Gatoberto 🐈💼

¡Bienvenido a **Catsino**, un simulador de máquina tragamonedas (slot machine) web premium desarrollado en React! Sigue la historia de Gatoberto, un felino de oficina cansado de la rutina corporativa, mientras gira los rodillos en busca de su libertad financiera.

Esta aplicación cuenta con una pantalla expandida de **5 columnas por 5 filas**, mecánicas avanzadas de casino y una interfaz de usuario compacta optimizada para evitar el desplazamiento vertical (scroll).

---

## 🚀 Características Recientes y Mejoras Visuales

* **Iconos Gigantes de Alta Visibilidad (76px):** Las tarjetas de los símbolos se han maximizado a 76px de altura para que los GIFs y memes de los gatos se vean imponentes y nítidos.
* **Nombres Flotantes Estilo Badge:** Para no restar espacio a las imágenes, los nombres de los gatos se renderizan como etiquetas flotantes sobre el eje Z con un fondo semi-transparente `rgba`, asegurando una lectura perfecta sin importar el color del meme.
* **Micro-Interfaz de Control:** El panel inferior y los botones laterales (como el botón **Turbo: MIAU/OFF**) han sido reducidos en márgenes, fuentes (`0.6rem`) y paddings, permitiendo que todo el juego encaje perfectamente en ventanas compactas.
* **Corrección en el Motor de Multiplicadores:** Se solucionó un bug lógico en el evaluador de líneas donde la combinación de multiplicadores (ej. x2 y x3) mostraba un x4 visual erróneo debido a un desfase de inicialización en el Front-end. Ahora se propaga limpiamente el beneficio neto acumulado como un **x5** real.

---

## 🛠️ Tecnologías Utilizadas

* **React (Vite):** Arquitectura basada en componentes y hooks personalizados para el manejo del estado del juego.
* **Context / Custom Hooks:** Control del flujo de tiros, retardo de rodillos y sistema de apuestas automáticas (`useSlotMachine`, `useAutobet`).
* **CSS3 Animations:** Efectos de desenfoque por movimiento (`blur-motion`), rebote de rodillos (`reel-bounce`) y destellos dorados en las líneas ganadoras.

---

## 🎮 Mecánicas del Juego

1. **Líneas de Pago Tradicionales:** Evalúa combinaciones de izquierda a derecha a partir de 3 símbolos idénticos o comodines (`WILD`).
2. **Scatters Extensivos:** Consigue 3 o más símbolos *Scatter* en cualquier posición de la pantalla gigante de 5x5 para activar la ronda de **Free Spins** (hasta 25 giros gratis).
3. **Multiplicadores Físicos en Pantalla:** Los multiplicadores que caigan en la matriz acumulan su valor neto (`value - 1`) y potencian el premio total del tiro, siempre y cuando existan líneas ganadoras válidas.

---

## 📦 Instalación y Uso

1. Clona este repositorio en tu máquina local.
2. Instala las dependencias del proyecto:
   ```bash
   npm install
