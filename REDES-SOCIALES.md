# Configuración de Redes Sociales

## 📍 Ubicación de los Enlaces

Los enlaces de redes sociales están configurados en **DOS archivos**:

### 1. Footer Component (Páginas de Categorías)
**Archivo:** `src/components/Footer.tsx`
**Líneas:** 5-10

```typescript
const SOCIAL_LINKS = {
  youtube: 'https://youtube.com/@tu-canal',
  instagram: 'https://instagram.com/tu-usuario',
  facebook: 'https://facebook.com/tu-pagina',
  tiktok: 'https://tiktok.com/@tu-usuario'
};
```

### 2. HomePage Component (Página Principal)
**Archivo:** `src/components/HomePage.tsx`
**Líneas:** 14-19

```typescript
const SOCIAL_LINKS = {
  youtube: 'https://youtube.com/@tu-canal',
  instagram: 'https://instagram.com/tu-usuario',
  facebook: 'https://facebook.com/tu-pagina',
  tiktok: 'https://tiktok.com/@tu-usuario'
};
```

## 🔧 Cómo Actualizar los Enlaces

1. Abre cada archivo mencionado arriba
2. Busca la constante `SOCIAL_LINKS`
3. Reemplaza las URLs de ejemplo con tus enlaces reales de **Conexión Bíblica**:

### Ejemplo de URLs reales:
```typescript
const SOCIAL_LINKS = {
  youtube: 'https://youtube.com/@ConexionBiblica',
  instagram: 'https://instagram.com/conexion_biblica',
  facebook: 'https://facebook.com/ConexionBiblica',
  tiktok: 'https://tiktok.com/@conexionbiblica'
};
```

## 📱 Dónde Aparecen los Iconos

### En el Footer (Páginas de Categorías)
- Aparecen en todas las páginas de categorías (Aventureros, Conquistadores, Guías Mayores)
- Ubicados arriba del texto "Desarrollado con ❤️ por Codezardi"
- Diseño: Iconos circulares con fondo blanco/gris oscuro según el tema
- **Nota:** Estas son las redes sociales de Conexión Bíblica, NO de Codezardi

### En el HomePage (Página Principal)
- Aparecen **debajo del botón "Comienza tu aventura"**
- Separados del cuadro de "Desarrollado por Codezardi"
- Ubicación: Entre el botón y el texto de desarrollador
- Diseño: Iconos circulares flotantes con fondo semi-transparente
- Versión móvil y desktop con tamaños adaptados
- Animación flotante independiente con delay escalonado

## 🎨 Colores de los Iconos

- **YouTube:** Rojo (#EF4444)
- **Instagram:** Rosa (#EC4899)
- **Facebook:** Azul (#3B82F6)
- **TikTok:** Blanco/Negro (según tema)

## 📐 Estructura Visual (HomePage)

```
┌─────────────────────────────┐
│  COMIENZA TU AVENTURA       │  ← Botón principal
└─────────────────────────────┘
         ↓
    [Y] [I] [F] [T]              ← Iconos de redes sociales (Conexión Bíblica)
         ↓
┌─────────────────────────────┐
│ Desarrollado con ❤️ por      │  ← Texto de desarrollador (Codezardi)
│      codezardi               │
└─────────────────────────────┘
```

## ⚠️ Importante

- Debes actualizar los enlaces en **AMBOS archivos** para que funcionen en todas las páginas
- Las redes sociales son de **Conexión Bíblica**, no de Codezardi
- Los iconos tienen animaciones de hover (escala y cambio de color)
- Los enlaces se abren en una nueva pestaña (`target="_blank"`)
- Incluyen `rel="noopener noreferrer"` para seguridad
- Cada elemento tiene su propia animación flotante con delays diferentes

## 🧪 Prueba los Enlaces

Después de actualizar los enlaces:
1. Guarda los archivos
2. Recarga la aplicación
3. Haz clic en cada icono para verificar que te lleven a la página correcta
4. Verifica tanto en la página principal como en las páginas de categorías
5. Prueba en móvil y desktop para ver el espaciado correcto
