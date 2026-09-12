# AudioClean Pro — Landing Page

Página web oficial de presentación y ventas para **AudioClean Pro**: eliminador inteligente de duplicados de audio, detector de *Fake FLAC* mediante análisis espectral FFT y comparador A/B en tiempo real.

## 🚀 Características destacadas de la Landing Page

- **Diseño Moderno & Responsivo**: Interfaz oscura con estética Cyberpunk/Hi-Fi, efectos de vidrio (glassmorphism) y animaciones fluidas.
- **Simulador A/B Interactivo**: Demostración en el navegador que permite comparar calidad de audio y espectros entre formatos de alta definición y pérdidas.
- **Visualizador Espectral FFT en Canvas**: Visualización dinámica de ondas de audio y frecuencias.
- **Calculadora de Espacio**: Herramienta interactiva para calcular el almacenamiento recuperable según el tamaño de la biblioteca musical.
- **Modales de Conversión**: Flujos para descarga de demo gratuita y checkout simulado.

## 📁 Estructura del Proyecto

```
landing-page/
├── assets/
│   └── app_icon.png        # Icono oficial de la aplicación
├── css/
│   └── styles.css          # Estilos globales y componentes
├── js/
│   ├── ab_simulator.js     # Lógica del reproductor comparativo A/B
│   ├── visualizer.js       # Motor de visualización de espectrograma
│   └── main.js             # Comportamiento interactivo general, FAQ y modales
├── index.html              # Estructura principal de la landing page
└── README.md
```

## 💻 Vista Previa Local

Para visualizar la página localmente, simplemente abre `index.html` en cualquier navegador moderno o utiliza una extensión de servidor local como *Live Server* en VS Code:

```bash
# Con Python (opcional)
python -m http.server 8000
```
Y visita `http://localhost:8000`.
