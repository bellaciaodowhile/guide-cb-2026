# 📖 Explorador del Libro de Daniel

Una aplicación web moderna e interactiva para explorar el libro de Daniel de la Biblia, construida con React, Vite y Tailwind CSS.

## ✨ Características

- 📚 **Navegación completa**: Explora los 12 capítulos del libro de Daniel
- 🌙 **Tema oscuro/claro**: Cambia entre temas con un solo clic
- 📱 **Diseño responsive**: Optimizado para móviles, tablets y desktop
- 🎨 **Interfaz moderna**: Diseño elegante con Tailwind CSS
- 📊 **Estadísticas detalladas**: Información sobre versículos, capítulos y más
- ⚡ **Carga rápida**: Construido con Vite para máximo rendimiento
- 🔍 **Información contextual**: Títulos, subtítulos y resúmenes de cada capítulo
- 🎯 **Experiencia intuitiva**: Navegación fluida y animaciones suaves

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework de CSS utilitario
- **Lucide React** - Iconos modernos y elegantes
- **Bible API** - API de bible-api.deno.dev
- **Reina Valera 1995** - Versión bíblica utilizada

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd daniel-bible-app
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   La aplicación se abrirá automáticamente en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── ChapterCard.tsx     # Tarjeta de capítulo
│   ├── ChapterDetail.tsx   # Vista detallada del capítulo
│   ├── LoadingSpinner.tsx  # Indicador de carga
│   └── StatsCard.tsx       # Tarjeta de estadísticas
├── hooks/              # Hooks personalizados
│   └── useTheme.ts        # Hook para manejo de temas
├── services/           # Servicios de API
│   └── bibleApi.ts        # Servicio para consumir la API
├── types/              # Definiciones de TypeScript
│   └── bible.ts           # Tipos para datos bíblicos
├── utils/              # Utilidades y constantes
│   └── constants.ts       # Configuración y datos estáticos
├── App.tsx             # Componente principal
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

## 🎯 Funcionalidades Principales

### 🏠 Vista Principal
- Lista interactiva de los 12 capítulos
- Información detallada de cada capítulo (título, subtítulo, resumen)
- Estadísticas del libro completo
- Cambio de tema claro/oscuro

### 📖 Vista de Capítulo
- Lectura completa del capítulo seleccionado
- Numeración clara de versículos
- Información contextual del capítulo
- Navegación fácil de regreso

### 📊 Estadísticas Interactivas
- Total de capítulos y versículos
- Promedio de versículos por capítulo
- Capítulo más largo y más corto
- Información adicional del libro

## 🎨 Características de Diseño

- **Paleta de colores**: Azul y blanco como colores principales
- **Responsive**: Adaptable a todos los tamaños de pantalla
- **Animaciones**: Transiciones suaves y efectos visuales
- **Accesibilidad**: Contraste adecuado y navegación por teclado
- **Tipografía**: Fuentes legibles y jerarquía clara

## 🔌 API Utilizada

La aplicación consume la API de `bible-api.deno.dev`:

- **Base URL**: `https://bible-api.deno.dev/api`
- **Endpoints utilizados**:
  - `/read/rv1995/daniel/{chapter}` - Obtener capítulo completo
  - `/read/rv1995/daniel/{chapter}/{verse}` - Obtener versículo específico
- **Versión**: Reina Valera 1995 (rv1995)
- **Libro**: Daniel (12 capítulos)

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Construcción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la construcción de producción

# Linting
npm run lint         # Ejecuta ESLint para verificar el código
```

## 🎛️ Configuración

### Cambiar Versión de la Biblia
Para usar una versión diferente, modifica `API_CONFIG.VERSION` en `src/utils/constants.ts`:

```typescript
export const API_CONFIG = {
  VERSION: 'rv1960', // Cambiar aquí
  // ... otras configuraciones
};
```

Versiones disponibles:
- `rv1960` - Reina Valera 1960
- `rv1995` - Reina Valera 1995
- `dhh` - Dios Habla Hoy
- `nvi` - Nueva Versión Internacional

### Personalizar Colores
Los colores se pueden modificar en `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Personalizar la paleta de colores aquí
      }
    }
  }
}
```

## 🌟 Características Avanzadas

### Información Contextual
Cada capítulo incluye:
- **Título descriptivo**: Nombre temático del capítulo
- **Subtítulo**: Descripción específica del contenido
- **Resumen**: Breve explicación del capítulo
- **Estadísticas**: Número de versículos y posición en el libro

### Experiencia de Usuario
- **Carga progresiva**: Los capítulos se cargan de forma asíncrona
- **Estados de carga**: Indicadores visuales durante las operaciones
- **Manejo de errores**: Mensajes informativos y opciones de reintento
- **Navegación intuitiva**: Flujo natural entre vistas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Bible API](https://bible-api.deno.dev/) por proporcionar acceso gratuito a las Escrituras
- [Lucide](https://lucide.dev/) por los hermosos iconos
- [Tailwind CSS](https://tailwindcss.com/) por el framework de CSS
- [Vite](https://vitejs.dev/) por la herramienta de construcción rápida

---

**Hecho con ❤️ para el estudio bíblico interactivo**