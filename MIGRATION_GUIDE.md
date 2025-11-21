# 🌱 Guía de Migración a Supabase - Ev1

## ✅ Cambios Realizados

### 1. **Instalación de Dependencias**
- ✅ Instalado `@supabase/supabase-js`

### 2. **Archivo `src/db/products.ts`**
- ✅ Migrado de array local a consultas de Supabase
- ✅ Agregados tipos TypeScript (`Product` interface)
- ✅ Funciones actualizadas:
  - `getProducts()` - Obtiene todos los productos
  - `getProductBySlug(slug)` - Obtiene un producto por slug
  - `getRelatedProducts(productId, category, limit)` - Productos relacionados
  - `getFeaturedProducts()` - Productos destacados (home=true)
  - `getProductsByCategory(category)` - Productos por categoría

### 3. **Archivo `src/app/(main)/planta/[id]/page.tsx`**
- ✅ Actualizado `priceOffer` → `price_offer` (snake_case para Supabase)
- ✅ Las funciones ahora consultan Supabase automáticamente

### 4. **Script SQL creado: `supabase_products.sql`**
- ✅ Crea la tabla `products` con todos los campos necesarios
- ✅ Inserta los 14 productos
- ✅ Configura índices para optimización

---

## 📋 Próximos Pasos

### Paso 1: Ejecutar el SQL en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **SQL Editor** (en el menú lateral izquierdo)
3. Crea una **New Query**
4. Copia y pega todo el contenido de `supabase_products.sql`
5. Haz clic en **Run** (▶️) para ejecutar

### Paso 2: Verificar que los datos se insertaron

Después de ejecutar el SQL, verifica en **Table Editor** que la tabla `products` tiene los 14 registros.

### Paso 3: Probar la aplicación

Tu aplicación Next.js ya está configurada para usar Supabase. Solo necesitas:

1. Asegurarte de que el dev server esté corriendo:
   ```bash
   npm run dev
   ```

2. Navega a algún producto, por ejemplo:
   ```
   http://localhost:3000/planta/cala-de-color
   http://localhost:3000/planta/monstera-deliciosa
   ```

3. Verifica que los datos se muestren correctamente

---

## 🔧 Estructura de la Base de Datos

```sql
products
├── id (SERIAL PRIMARY KEY)
├── title (TEXT NOT NULL)
├── price (INTEGER NOT NULL)
├── price_offer (INTEGER DEFAULT 0)
├── description (TEXT)
├── image (TEXT)
├── rating (JSONB)
├── stock (INTEGER DEFAULT 0)
├── slug (TEXT UNIQUE NOT NULL)
├── category (TEXT)
├── home (BOOLEAN DEFAULT false)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 🚀 Funciones Disponibles

### En `src/db/products.ts`

```typescript
// Obtener todos los productos
const products = await getProducts();

// Obtener un producto específico
const product = await getProductBySlug('monstera-deliciosa');

// Obtener productos relacionados
const related = await getRelatedProducts(productId, 'interior', 4);

// Obtener productos destacados
const featured = await getFeaturedProducts();

// Obtener por categoría
const interior = await getProductsByCategory('interior');
```

---

## ❓ Troubleshooting

### Si la aplicación no muestra datos:

1. **Verifica la conexión a Supabase:**
   - Revisa que las credenciales en `src/db/supabase.ts` sean correctas
   - Comprueba que la tabla `products` exista en Supabase

2. **Revisa la consola del navegador:**
   - Abre las DevTools (F12)
   - Busca errores en la pestaña Console

3. **Verifica los permisos en Supabase:**
   - Ve a **Authentication** > **Policies**
   - Asegúrate de que la tabla `products` permita lectura pública

### Para habilitar acceso público a productos:

En Supabase SQL Editor, ejecuta:

```sql
-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura pública
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  USING (true);
```

---

## 📝 Notas Importantes

- ✅ Los datos ahora se obtienen desde Supabase en tiempo real
- ✅ Se pueden agregar/editar productos desde el dashboard de Supabase
- ✅ El campo `rating` usa JSONB para almacenar `{rate, count}`
- ✅ Todos los slugs son únicos (constraint en base de datos)

---

¡Tu aplicación está lista para usar Supabase! 🎉
