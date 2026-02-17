# Enlaces de YouTube - Libro de Daniel

## 📍 Ubicación de los Enlaces

Los enlaces de YouTube para cada capítulo del libro de Daniel están configurados en:

**Archivo:** `src/utils/youtubeLinks.ts`

```typescript
export const YOUTUBE_CHAPTER_LINKS: Record<number, string> = {
  1: 'https://youtu.be/nIT4DOKIk3M',
  2: 'https://youtu.be/eJv_Cv8V2MA',
  3: 'https://youtu.be/a8xcTObd0Sw',
  4: 'https://youtu.be/Vsjhy9R0NXI',
  5: 'https://youtu.be/TNHzLkB6KlE',
  6: 'https://youtu.be/dhT_ceFnIi4',
  7: 'https://youtu.be/KviUhZk60L4',
  8: 'https://youtu.be/jIBBs2nj3Vo',
  9: 'https://youtu.be/meFgaDJZ4Mw',
  10: 'https://youtu.be/cw25fyL3fUI',
  11: 'https://youtu.be/3BhedxKft1Y',
  12: 'https://youtu.be/-NJeCMeY2hY'
};
```

## 🎯 Dónde Aparecen los Botones de YouTube

### 1. En las Cards de Capítulos (Vista de Categorías)
**Componente:** `src/components/ChapterCard.tsx`
- Aparece en las páginas de Aventureros, Conquistadores y Guías Mayores
- Botón rojo con icono de YouTube
- Texto: "Escuchar en YouTube"
- Se abre en una nueva pestaña

### 2. Dentro de la Lectura de Cada Capítulo
**Componente:** `src/components/ChapterDetail.tsx`
- Aparece en la página de lectura de cada capítulo
- Card completa con título "Escucha este capítulo"
- Descripción: "Escucha la narración en audio de Daniel [número] en YouTube"
- Botón rojo con icono de YouTube
- Se abre en una nueva pestaña

## 🎨 Diseño de los Botones

### En las Cards (ChapterCard):
```
┌─────────────────────────────────────┐
│ 🎥 Escuchar en YouTube          →  │
└─────────────────────────────────────┘
```
- Fondo: Rojo claro (red-50 / red-900/20)
- Hover: Rojo más intenso
- Icono: YouTube rojo
- Flecha que se mueve al hacer hover

### En la Lectura (ChapterDetail):
```
┌─────────────────────────────────────┐
│ 🎥 Escucha este capítulo            │
│                                     │
│ Escucha la narración en audio de   │
│ Daniel [X] en YouTube               │
│                                     │
│ [🎥 Escuchar en YouTube]            │
└─────────────────────────────────────┘
```
- Card completa con borde
- Fondo adaptado al tema de lectura
- Botón rojo sólido (bg-red-600)
- Efecto de escala al hacer hover

## 🔧 Cómo Actualizar los Enlaces

Si necesitas cambiar algún enlace de YouTube:

1. Abre el archivo `src/utils/youtubeLinks.ts`
2. Busca el número del capítulo que quieres actualizar
3. Reemplaza la URL con el nuevo enlace de YouTube

**Ejemplo:**
```typescript
// Cambiar el enlace del capítulo 1
1: 'https://youtu.be/NUEVO_ID_VIDEO',
```

## 📱 Funcionalidad

- Todos los enlaces se abren en una nueva pestaña (`target="_blank"`)
- Incluyen `rel="noopener noreferrer"` para seguridad
- Funcionan en todas las categorías (Aventureros, Conquistadores, Guías Mayores)
- Disponibles para los 12 capítulos del libro de Daniel

## 🎵 Orden de los Capítulos

Los enlaces están ordenados del capítulo 1 al 12, correspondiendo a:
- Capítulo 1: Daniel y sus compañeros en Babilonia
- Capítulo 2: El sueño de Nabucodonosor
- Capítulo 3: El horno de fuego ardiente
- Capítulo 4: La locura de Nabucodonosor
- Capítulo 5: La escritura en la pared
- Capítulo 6: Daniel en el foso de los leones
- Capítulo 7: Visión de las cuatro bestias
- Capítulo 8: Visión del carnero y del macho cabrío
- Capítulo 9: La oración de Daniel y las setenta semanas
- Capítulo 10: Visión junto al río Hidekel
- Capítulo 11: Los reyes del norte y del sur
- Capítulo 12: El tiempo del fin

## ✅ Verificación

Para verificar que los enlaces funcionan correctamente:
1. Navega a cualquier categoría (Aventureros, Conquistadores o Guías Mayores)
2. Busca el botón "Escuchar en YouTube" en cada card de capítulo
3. Haz clic en el botón para verificar que te lleva al video correcto
4. Entra a la lectura de un capítulo y verifica que el botón también aparece allí
